'use client';

import { useState, useEffect } from 'react';
import { parkingLocations as initialLocations } from '@/lib/data';
import type { ParkingLocation, BookingDetails } from '@/lib/types';
import ParkingLocationCard from '@/components/user/parking-location-card';
import { Separator } from '@/components/ui/separator';

export default function UserDashboard() {
  const [locations, setLocations] = useState<ParkingLocation[]>(initialLocations);
  const [bookingDetails, setBookingDetails] = useState<
    (BookingDetails & { locationId: string }) | null
  >(null);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    // Simulate occupancy changes for unbooked locations
    const interval = setInterval(() => {
      setLocations((prevLocations) =>
        prevLocations.map((loc) => {
          if (bookingDetails && loc.id === bookingDetails.locationId) {
            return loc; // Don't simulate changes for the booked location
          }
          const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          let newOccupiedSpots = loc.occupiedSpots + change;
          if (newOccupiedSpots < 0) newOccupiedSpots = 0;
          if (newOccupiedSpots > loc.totalSpots) newOccupiedSpots = loc.totalSpots;
          return { ...loc, occupiedSpots: newOccupiedSpots };
        })
      );
    }, 3000); 

    return () => clearInterval(interval);
  }, [bookingDetails]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bookingDetails && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (bookingDetails && countdown === 0) {
      // Release booking when timer ends
      setBookingDetails(null);
    }
    return () => clearTimeout(timer);
  }, [bookingDetails, countdown]);

  const handleConfirmBooking = (
    locationId: string,
    details: Omit<BookingDetails, 'bookedAt' | 'locationName'>
  ) => {
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    if(bookingDetails){
        // In this implementation, only one booking is allowed at a time.
        // If another booking is made, the previous one is cancelled.
        console.log("Cancelling previous booking to make a new one.");
    }
    
    setBookingDetails({
      ...details,
      locationId: locationId,
      locationName: location.name,
      bookedAt: new Date(),
    });
    setCountdown(15 * 60); // 15 minutes
  };

  const handleCancelBooking = (locationId: string) => {
    if (bookingDetails && bookingDetails.locationId === locationId) {
      setBookingDetails(null);
      setCountdown(0);
    }
  };

  const bookedLocation = bookingDetails ? locations.find(l => l.id === bookingDetails.locationId) : null;
  const otherLocations = locations.filter(l => !bookingDetails || l.id !== bookingDetails.locationId);


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
            {otherLocations.map((location) => (
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
