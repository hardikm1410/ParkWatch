
'use client';

import { useState, useMemo, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useUser, useFirestore, useCollection } from '@/firebase/index';
import type { ParkingLocation } from '@/lib/types';
import SpotVisualizer from '@/components/management/spot-visualizer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import type { Firestore } from 'firebase/firestore';
import { collection, query, where } from 'firebase/firestore';

export default function VisualizerPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore() as Firestore;
  const initialLocationId = searchParams.get('location');

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(initialLocationId);

  const locationsQuery =
    user && firestore
      ? query(
          collection(firestore, 'parkingLocations'),
          where('ownerId', '==', user.uid)
        )
      : null;

  const { data: parkingLocations, loading: locationsLoading } = useCollection<ParkingLocation>(locationsQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      const redirectPath = initialLocationId 
        ? `/login?redirect=/management/visualizer?location=${initialLocationId}`
        : '/login?redirect=/management/visualizer';
      router.push(redirectPath);
    }
  }, [user, userLoading, router, initialLocationId]);
  
  useEffect(() => {
    // If no location is selected but locations are loaded, select the first one.
    if (!selectedLocationId && parkingLocations && parkingLocations.length > 0) {
      const firstLocationId = parkingLocations[0].id;
      setSelectedLocationId(firstLocationId);
      window.history.replaceState(null, '', `/management/visualizer?location=${firstLocationId}`);
    }
  }, [selectedLocationId, parkingLocations]);


  const selectedLocation = useMemo(() => {
    return parkingLocations?.find(loc => loc.id === selectedLocationId) || null;
  }, [selectedLocationId, parkingLocations]);
  
  const handleLocationChange = (locationId: string) => {
      setSelectedLocationId(locationId);
      // Update URL without reloading the page
      window.history.pushState(null, '', `/management/visualizer?location=${locationId}`);
  }

  if (userLoading || locationsLoading) {
    return <div className="container mx-auto px-4 py-8 text-center">Loading Visualizer...</div>;
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <h1 className="text-4xl font-bold tracking-tighter font-headline">
          Parking Spot Visualizer
        </h1>
        <div className="w-full sm:w-auto">
            <Select onValueChange={handleLocationChange} value={selectedLocationId || ''}>
            <SelectTrigger className="w-full sm:w-[280px]">
                <SelectValue placeholder="Select a location..." />
            </SelectTrigger>
            <SelectContent>
                {parkingLocations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                    {location.name}
                </SelectItem>
                ))}
            </SelectContent>
            </Select>
        </div>
      </div>
      
      {selectedLocation ? (
        <SpotVisualizer location={selectedLocation} />
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          <p>You have not created any locations yet.</p>
          <p>Go to the management page to add a new parking location.</p>
        </div>
      )}
    </div>
  );
}
