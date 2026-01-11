
'use client';

import { useState, useEffect } from 'react';
import type { ParkingLocation, BookingDetails } from '@/lib/types';
import ParkingLocationCard from '@/components/user/parking-location-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function UserDashboard() {
  const { toast } = useToast();

  const staticLocations: ParkingLocation[] = PlaceHolderImages.map((img, index) => ({
      id: img.id,
      name: img.description,
      address: `Location ${index + 1}`,
      totalSpots: 100 + index * 20,
      occupiedSpots: 50 + Math.floor(Math.random() * 50),
      currentFee: 50 + index * 10,
      imageUrl: img.imageUrl,
      imageHint: img.imageHint,
      ownerId: 'static',
  }));

  const [locations, setLocations] = useState<ParkingLocation[] | null>(staticLocations);
  const locationsLoading = false;

  const [bookingDetails, setBookingDetails] = useState<(BookingDetails & { locationId: string }) | null>(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bookingDetails && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (bookingDetails && countdown === 0) {
      handleCancelBooking(bookingDetails.locationId, true); 
    }
    return () => clearTimeout(timer);
  }, [bookingDetails, countdown]);

  const handleConfirmBooking = async (
    locationId: string,
    details: Omit<BookingDetails, 'bookedAt' | 'locationName'>
  ) => {
    if (!locations) return;

    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    if(bookingDetails){
        console.log("Cancelling previous booking to make a new one.");
        await handleCancelBooking(bookingDetails.locationId, true);
    }

    const newBookingDetails = {
      ...details,
      locationId: locationId,
      locationName: location.name,
      bookedAt: new Date(),
    };
    
    setBookingDetails(newBookingDetails);
    setCountdown(15 * 60); // 15 minutes

    const originalLocations = locations;
    const updatedLocations = originalLocations.map(loc => 
        loc.id === locationId 
        ? { ...loc, occupiedSpots: loc.occupiedSpots + 1 } 
        : loc
    );
    setLocations(updatedLocations);
  };

  const handleCancelBooking = async (locationId: string, silent = false) => {
    if (!bookingDetails || bookingDetails.locationId !== locationId || !locations) {
      return;
    }

    const bookingToCancel = { ...bookingDetails };
    
    setBookingDetails(null);
    setCountdown(0);
    const originalLocations = locations;
    const updatedLocations = originalLocations.map(loc => 
        loc.id === locationId && loc.occupiedSpots > 0
          ? { ...loc, occupiedSpots: loc.occupiedSpots - 1 } 
          : loc
    );
    setLocations(updatedLocations);
    if (!silent) {
        toast({
            title: "Booking Cancelled",
            description: `Your booking for ${bookingToCancel.locationName} has been cancelled.`,
        });
    }
  };

  if (locationsLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Parking Locations...</div>;
  }

  const bookedLocation = bookingDetails ? locations?.find(l => l.id === bookingDetails.locationId) : null;
  const otherLocations = locations?.filter(l => !bookingDetails || l.id !== bookingDetails.locationId);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter text-center font-headline">
        Find Parking Fast
      </h1>
      <div className="space-y-12">
        {bookedLocation && (
          <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">Your Active Booking</h2>
            <div className="flex justify-center">
                 <ParkingLocationCard 
                    key={bookedLocation.id} 
                    location={bookedLocation}
                    isBooked={true}
                    countdown={countdown}
                    bookingDetails={bookingDetails}
                    onConfirmBooking={handleConfirmBooking}
                    onCancelBooking={handleCancelBooking}
                />
            </div>
            <Separator className="my-8" />
          </div>
        )}

        <div>
            <h2 className="text-2xl font-bold tracking-tight mb-4">{bookedLocation ? 'Other Locations' : 'Available Locations'}</h2>
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {otherLocations?.map((location) => (
                <ParkingLocationCard 
                    key={location.id} 
                    location={location}
                    isBooked={false}
                    countdown={0}
                    bookingDetails={null}
                    onConfirmBooking={handleConfirmBooking}
                    onCancelBooking={handleCancelBooking}
                />
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}
