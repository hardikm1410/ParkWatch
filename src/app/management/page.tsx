
'use client';
import { useState, useEffect } from 'react';
import type { ParkingLocation, ParkedVehicle } from '@/lib/types';
import CreateLocationForm from '@/components/management/create-location-form';
import ManagementLocationTable from '@/components/management/management-location-table';
import ParkedVehiclesTable from '@/components/management/parked-vehicles-table';
import ManualEntryForm from '@/components/management/manual-entry-form';
import { useToast } from '@/hooks/use-toast';
import { useUser, useFirestore, useCollection } from '@/firebase/index';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  query,
  where,
  getDocs,
  writeBatch,
} from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import type { Firestore } from 'firebase/firestore';

export default function ManagementPage() {
  const { toast } = useToast();
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore() as Firestore;
  const router = useRouter();

  const locationsQuery =
    user && firestore
      ? query(
          collection(firestore, 'parkingLocations'),
          where('ownerId', '==', user.uid)
        )
      : null;

  const { data: locations, loading: locationsLoading } =
    useCollection<ParkingLocation>(locationsQuery);

  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/management');
    }
  }, [user, userLoading, router]);

  const addLocation = async (
    newLocationData: Omit<ParkingLocation, 'id' | 'occupiedSpots' | 'imageUrl' | 'imageHint' | 'ownerId'>
  ) => {
    if (!user || !firestore) return;

    try {
      const docRef = await addDoc(collection(firestore, 'parkingLocations'), {
        ...newLocationData,
        occupiedSpots: 0,
        // Using a placeholder image for now
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'parking lot',
        ownerId: user.uid,
        createdAt: serverTimestamp(),
      });
      console.log('Document written with ID: ', docRef.id);
      toast({
        title: 'Location Added',
        description: `${newLocationData.name} has been added to your locations.`,
      });
    } catch (e) {
      console.error('Error adding document: ', e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add the location.',
      });
    }
  };

  const updateOccupancy = async (locationId: string, occupiedSpots: number) => {
    if (!firestore) return;
    const location = locations?.find(loc => loc.id === locationId);
    if (!location) return;

    const newOccupiedSpots = Math.max(0, Math.min(location.totalSpots, occupiedSpots));

    const locationRef = doc(firestore, 'parkingLocations', locationId);
    try {
      await updateDoc(locationRef, { occupiedSpots: newOccupiedSpots });
    } catch (e) {
      console.error('Error updating occupancy: ', e);
    }
  };

  const addParkedVehicle = async (
    vehicleData: Omit<ParkedVehicle, 'id' | 'checkInTime' | 'chargesPaid' | 'locationName'>,
    locationId: string
  ) => {
    if (!firestore) return;
    const location = locations?.find(loc => loc.id === locationId);
    if (!location) return;

    const newVehicle: Omit<ParkedVehicle, 'id'> = {
      ...vehicleData,
      checkInTime: new Date(),
      locationName: location.name,
      chargesPaid: vehicleData.duration * location.currentFee,
    };
    
    // In a real app, this would be a transaction
    try {
      await addDoc(collection(firestore, 'parkedVehicles'), newVehicle);
      await updateOccupancy(locationId, location.occupiedSpots + 1);

      // This part is for local state update. `useCollection` will handle this for locations.
      // For parked vehicles, we'd ideally use another `useCollection` hook.
      // For now, simple local update.
      setParkedVehicles(prev => [...prev, { ...newVehicle, id: `temp-${Date.now()}` }]);
    } catch(e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not register vehicle.',
      });
    }
  };
  
  if (userLoading || locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading Management Dashboard...
      </div>
    );
  }

  if (!user) {
    return null; // Redirect is handled by useEffect
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Parking Management
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <ManagementLocationTable locations={locations || []} onUpdateOccupancy={updateOccupancy} />
            <ParkedVehiclesTable vehicles={parkedVehicles} />
        </div>
        <div className="space-y-8">
            <CreateLocationForm onAddLocation={addLocation} />
            <ManualEntryForm locations={locations || []} onAddVehicle={addParkedVehicle} />
        </div>
      </div>
    </div>
  );
}
