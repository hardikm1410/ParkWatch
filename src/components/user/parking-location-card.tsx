
'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import type { ParkingLocation } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { MapPin, Timer, Ticket, XCircle } from 'lucide-react';
import OccupancyBar from './occupancy-bar';
import HistoricalTrendChart from './historical-trend-chart';
import { cn } from '@/lib/utils';

type ParkingLocationCardProps = {
  location: ParkingLocation;
};

export default function ParkingLocationCard({ location }: ParkingLocationCardProps) {
  const [isBooked, setIsBooked] = useState(false);
  const [countdown, setCountdown] = useState(0);

  const availableSpots = location.totalSpots - location.occupiedSpots - (isBooked ? 1 : 0);
  const occupiedSpots = location.occupiedSpots + (isBooked ? 1 : 0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isBooked && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (isBooked && countdown === 0) {
      setIsBooked(false); // Release booking when timer ends
    }
    return () => clearTimeout(timer);
  }, [isBooked, countdown]);

  const handleBooking = () => {
    if (isBooked) {
      // Cancel booking
      setIsBooked(false);
      setCountdown(0);
    } else if (availableSpots > 0) {
      // Start booking
      setIsBooked(true);
      setCountdown(15 * 60); // 15 minutes in seconds
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
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
      <CardFooter className="p-6 pt-0">
        <Button 
          onClick={handleBooking} 
          disabled={!isBooked && availableSpots <= 0} 
          className={cn(
            "w-full transition-all duration-300",
            isBooked ? 'bg-destructive/90 hover:bg-destructive' : 'bg-accent hover:bg-accent/90'
          )}
        >
          {isBooked ? (
            <>
              <XCircle className="mr-2 h-4 w-4" />
              Cancel Reservation
            </>
          ) : (
            <>
              <Ticket className="mr-2 h-4 w-4" />
              Book a Spot
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
}
