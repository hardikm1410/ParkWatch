
'use client';

import { useState, useEffect } from 'react';
import type { ParkingLocation, BookingDetails } from '@/lib/types';
import ParkingLocationCard from '@/components/user/parking-location-card';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import { PlaceHolderImages } from '@/lib/placeholder-images';

export default function UserDashboard() {
  const { toast } = useToast();

  const staticLocations: ParkingLocation[] = [
    {
        id: 'connaught-place',
        name: 'Connaught Place Parking',
        address: 'Inner Circle, New Delhi',
        totalSpots: 500,
        occupiedSpots: 53,
        currentFee: 80,
        imageUrl: "https://images.unsplash.com/photo-1569872011373-0070303cd859?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwyfHxwYXJraW5nJTIwZ2FyYWdlfGVufDB8fHx8MTc2NzA3NzUzNnww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "parking garage",
        ownerId: 'static',
    },
    {
        id: 'indiranagar-metro',
        name: 'Indiranagar Metro Lot',
        address: 'CMH Road, Bangalore',
        totalSpots: 200,
        occupiedSpots: 48,
        currentFee: 60,
        imageUrl: "https://images.unsplash.com/photo-1590938076771-dfe17af4d484?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwzfHxwYXJraW5nJTIwbG90fGVufDB8fHx8MTc2NzA5MzMwOHww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "parking lot",
        ownerId: 'static',
    },
    {
        id: 'mumbai-airport',
        name: 'Mumbai Airport Parking',
        address: 'Chhatrapati Shivaji Maharaj Int\'l',
        totalSpots: 1500,
        occupiedSpots: 197,
        currentFee: 120,
        imageUrl: "https://images.unsplash.com/photo-1630183921674-47cc47ad831e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHw3fHxhaXJwb3J0JTIwcGFya2luZ3xlbnwwfHx8fDE3NjcxNzQ4NzZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "airport parking",
        ownerId: 'static',
    },
    {
        id: 'express-avenue',
        name: 'Express Avenue Mall',
        address: 'Whites Road, Royapettah, Chennai',
        totalSpots: 1000,
        occupiedSpots: 299,
        currentFee: 70,
        imageUrl: "https://images.unsplash.com/photo-1580610447943-1bfbef54f4c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzaG9wcGluZyUyMG1hbGwlMjBwYXJraW5nfGVufDB8fHx8MTc2NzI3NjgxOXww&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "mall parking",
        ownerId: 'static',
    },
    {
        id: 'wankhede-stadium',
        name: 'Wankhede Stadium Lot',
        address: 'D Road, Churchgate, Mumbai',
        totalSpots: 1800,
        occupiedSpots: 1502,
        currentFee: 90,
        imageUrl: "https://images.unsplash.com/photo-1518826762442-823a0932eea2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3NDE5ODJ8MHwxfHNlYXJjaHwxfHxzdGFkaXVtJTIwcGFya2luZ3xlbnwwfHx8fDE3NjcyNzY4NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
        imageHint: "stadium parking",
        ownerId: 'static',
    }
  ];

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
        {bookedLocation && (
          <div className="mb-12">
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
            <h1 className="mb-8 text-3xl font-bold tracking-tighter font-headline">
              {bookedLocation ? 'Other Locations' : 'Available Locations'}
            </h1>
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
  );
}
