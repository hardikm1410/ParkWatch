
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import type { ParkingLocation, BookingDetails } from '@/lib/types';
import { useUser } from '@/firebase';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Timer, Ticket, XCircle, QrCode } from 'lucide-react';
import OccupancyBar from './occupancy-bar';
import HistoricalTrendChart from './historical-trend-chart';
import BookingModal from './booking-modal';
import QrCodeModal from './qr-code-modal';

type ParkingLocationCardProps = {
  location: ParkingLocation;
  isBooked: boolean;
  countdown: number;
  bookingDetails: (BookingDetails & { locationId: string }) | null;
  onConfirmBooking: (
    locationId: string,
    details: Omit<BookingDetails, 'bookedAt' | 'locationName'>
  ) => void;
  onCancelBooking: (locationId: string) => void;
};

export default function ParkingLocationCard({
  location,
  isBooked,
  countdown,
  bookingDetails,
  onConfirmBooking,
  onCancelBooking,
}: ParkingLocationCardProps) {
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const { user } = useUser();
  const router = useRouter();


  const availableSpots = location.totalSpots - location.occupiedSpots - (isBooked ? 1 : 0);
  const occupiedSpots = location.occupiedSpots + (isBooked ? 1 : 0);

  const handleBookingInitiation = () => {
    if (!user) {
      router.push('/login');
      return;
    }
    if (availableSpots > 0) {
      setIsBookingModalOpen(true);
    }
  };

  const handleConfirmBooking = (details: Omit<BookingDetails, 'bookedAt' | 'locationName'>) => {
    onConfirmBooking(location.id, details);
    setIsBookingModalOpen(false);
  };

  const handleCancelBooking = () => {
    onCancelBooking(location.id);
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <>
      <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
        <CardHeader className="p-0">
          <div className="relative h-48 w-full">
            <Image
              src={location.imageUrl}
              alt={location.name}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              className="object-cover"
              data-ai-hint={location.imageHint}
            />
            {isBooked && (
              <div className="absolute top-2 right-2 flex items-center gap-2 rounded-full bg-primary/80 px-3 py-1 text-primary-foreground backdrop-blur-sm animate-pulse">
                <Timer className="h-4 w-4" />
                <span className="text-sm font-semibold">{formatTime(countdown)}</span>
              </div>
            )}
          </div>
          <div className="p-6 pb-2">
            <CardTitle className="text-xl font-headline">{location.name}</CardTitle>
            <CardDescription className="flex items-center gap-2 pt-2">
              <MapPin className="h-4 w-4" />
              {location.address}
            </CardDescription>
          </div>
        </CardHeader>
        <CardContent className="flex flex-grow flex-col justify-between p-6 pt-0">
          <div>
            <div className="mb-4">
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm font-medium text-muted-foreground">Availability</span>
                <span className="text-lg font-bold text-accent">{availableSpots} <span className="text-sm font-medium text-muted-foreground">/ {location.totalSpots} spots</span></span>
              </div>
              <OccupancyBar
                occupied={occupiedSpots}
                total={location.totalSpots}
              />
            </div>
            <HistoricalTrendChart locationId={location.id} />
          </div>
        </CardContent>
        <CardFooter className="grid grid-cols-2 gap-2 p-6 pt-0">
          {isBooked ? (
            <>
              <Button
                onClick={() => setIsQrModalOpen(true)}
                className="w-full transition-all duration-300 bg-sky-500 hover:bg-sky-600"
              >
                <QrCode className="mr-2 h-4 w-4" />
                Show QR
              </Button>
              <Button
                onClick={handleCancelBooking}
                variant="destructive"
                className="w-full transition-all duration-300"
              >
                <XCircle className="mr-2 h-4 w-4" />
                Cancel
              </Button>
            </>
          ) : (
            <Button
              onClick={handleBookingInitiation}
              disabled={availableSpots <= 0}
              className="w-full transition-all duration-300 bg-accent hover:bg-accent/90 col-span-2"
            >
              <Ticket className="mr-2 h-4 w-4" />
              Book a Spot
            </Button>
          )}
        </CardFooter>
      </Card>
      <BookingModal 
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        onConfirm={handleConfirmBooking}
        location={location}
      />
      {bookingDetails && (
        <QrCodeModal 
            isOpen={isQrModalOpen}
            onClose={() => setIsQrModalOpen(false)}
            bookingDetails={bookingDetails}
        />
      )}
    </>
  );
}
