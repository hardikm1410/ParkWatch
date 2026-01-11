
'use client';

import { useState, useEffect } from 'react';
import type { ParkingLocation, BookingDetails } from '@/lib/types';
import ParkingLocationCard from '@/components/user/parking-location-card';
import { Separator } from '@/components/ui/separator';
import { useUser, useFirestore, useCollection } from '@/firebase/index';
import { collection, doc, updateDoc, writeBatch, getDoc } from 'firebase/firestore';
import type { Firestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export default function UserDashboard() {
  const firestore = useFirestore() as Firestore;
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const { toast } = useToast();

  const locationsQuery = firestore ? collection(firestore, 'parkingLocations') : null;
  const { data: locations, loading: locationsLoading, setData: setLocations } = useCollection<ParkingLocation>(locationsQuery);

  const [bookingDetails, setBookingDetails] = useState<(BookingDetails & { locationId: string }) | null>(null);
  const [countdown, setCountdown] = useState(0);

  // In a real app, we would listen to live updates from Firestore
  // For this simulation, we'll just show the static data from the initial load

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (bookingDetails && countdown > 0) {
      timer = setTimeout(() => setCountdown(countdown - 1), 1000);
    } else if (bookingDetails && countdown === 0) {
      // Release booking when timer ends
      handleCancelBooking(bookingDetails.locationId, true); // Silent cancellation
    }
    return () => clearTimeout(timer);
  }, [bookingDetails, countdown]);

  const handleConfirmBooking = async (
    locationId: string,
    details: Omit<BookingDetails, 'bookedAt' | 'locationName'>
  ) => {
    if (!user) {
        toast({
            title: "Authentication Required",
            description: "Please log in to book a spot.",
            variant: "destructive",
        });
        router.push(`/login?redirect=/`);
        return;
    }

    if (!firestore || !locations) return;

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

    // Optimistically update UI
    const originalLocations = locations;
    const updatedLocations = originalLocations.map(loc => 
        loc.id === locationId 
        ? { ...loc, occupiedSpots: loc.occupiedSpots + 1 } 
        : loc
    );
    setLocations(updatedLocations);
    
    // Update Firestore
    const locationRef = doc(firestore, "parkingLocations", locationId);
    try {
        const locationDoc = await getDoc(locationRef);
        if(!locationDoc.exists()) throw new Error("Location not found");

        const currentSpots = locationDoc.data().occupiedSpots;
        await updateDoc(locationRef, { occupiedSpots: currentSpots + 1 });
    } catch(e) {
        console.error("Failed to update booking:", e);
        // Revert optimistic update
        setLocations(originalLocations);
        setBookingDetails(null);
        setCountdown(0);
        toast({
            title: "Booking Failed",
            description: "Could not reserve the spot. Please try again.",
            variant: "destructive",
        });
    }
  };

  const handleCancelBooking = async (locationId: string, silent = false) => {
    if (!bookingDetails || bookingDetails.locationId !== locationId || !firestore || !locations) {
      return;
    }

    const bookingToCancel = { ...bookingDetails };
    
    // Optimistically update UI
    setBookingDetails(null);
    setCountdown(0);
    const originalLocations = locations;
    const updatedLocations = originalLocations.map(loc => 
        loc.id === locationId && loc.occupiedSpots > 0
          ? { ...loc, occupiedSpots: loc.occupiedSpots - 1 } 
          : loc
    );
    setLocations(updatedLocations);

    // Update Firestore
    const locationRef = doc(firestore, "parkingLocations", locationId);
    try {
        const locationDoc = await getDoc(locationRef);
        if(!locationDoc.exists()) throw new Error("Location not found");

        const currentSpots = locationDoc.data().occupiedSpots;
        if(currentSpots > 0) {
            await updateDoc(locationRef, { occupiedSpots: currentSpots - 1 });
        }
        if (!silent) {
            toast({
                title: "Booking Cancelled",
                description: `Your booking for ${bookingToCancel.locationName} has been cancelled.`,
            });
        }
    } catch(e) {
        console.error("Failed to cancel booking:", e);
        // Revert optimistic update
        setLocations(originalLocations);
        setBookingDetails(bookingToCancel);
        setCountdown(15 * 60); // Reset timer if failed
        if (!silent) {
            toast({
                title: "Cancellation Failed",
                description: "Could not cancel booking. Please try again.",
                variant: "destructive",
            });
        }
    }
  };

  if (locationsLoading || userLoading) {
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
