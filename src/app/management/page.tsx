'use client';

import { useState, useEffect } from 'react';
import { useUser, useFirestore } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, addDoc, onSnapshot, doc, updateDoc, query, where } from 'firebase/firestore';
import type { ParkingLocation, ParkedVehicle } from '@/lib/types';
import CreateLocationForm from '@/components/management/create-location-form';
import ManagementLocationTable from '@/components/management/management-location-table';
import ParkedVehiclesTable from '@/components/management/parked-vehicles-table';
import ManualEntryForm from '@/components/management/manual-entry-form';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function ManagementPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const { toast } = useToast();

  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user && firestore) {
      const q = query(collection(firestore, 'locations'), where('ownerId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userLocations: ParkingLocation[] = [];
        querySnapshot.forEach((doc) => {
          userLocations.push({ id: doc.id, ...doc.data() } as ParkingLocation);
        });
        setLocations(userLocations);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, firestore]);
  
   useEffect(() => {
    if (!firestore) return;

    const unsubscribe = onSnapshot(collection(firestore, 'parkedVehicles'), (snapshot) => {
      const vehicles = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as ParkedVehicle));
      setParkedVehicles(vehicles);
    });

    return () => unsubscribe();
  }, [firestore]);

  const addLocation = async (newLocationData: Omit<ParkingLocation, 'id' | 'occupiedSpots' | 'imageUrl' | 'imageHint' | 'ownerId'>) => {
    if (!firestore || !user) return;
    try {
      await addDoc(collection(firestore, 'locations'), {
        ...newLocationData,
        ownerId: user.uid,
        occupiedSpots: 0,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'parking lot',
      });
      toast({
        title: 'Location Added',
        description: `${newLocationData.name} has been added to your locations.`,
      });
    } catch (error) {
      console.error("Error adding document: ", error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not add the location.',
      });
    }
  };

  const updateOccupancy = async (locationId: string, occupiedSpots: number) => {
    if (!firestore) return;
    const locationRef = doc(firestore, 'locations', locationId);
    const location = locations.find(loc => loc.id === locationId);
    if(location) {
        const newOccupiedSpots = Math.max(0, Math.min(location.totalSpots, occupiedSpots));
        await updateDoc(locationRef, { occupiedSpots: newOccupiedSpots });
    }
  };

  const addParkedVehicle = async (vehicleData: Omit<ParkedVehicle, 'id' | 'checkInTime' | 'chargesPaid' | 'locationName'>, locationId: string) => {
    if (!firestore) return;
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;

    const newVehicle: Omit<ParkedVehicle, 'id'> = {
      ...vehicleData,
      checkInTime: new Date(),
      locationName: location.name,
      chargesPaid: vehicleData.duration * location.currentFee,
    };
    
    await addDoc(collection(firestore, 'parkedVehicles'), newVehicle);
    updateOccupancy(locationId, location.occupiedSpots + 1);
  };

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Parking Management
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2 space-y-8">
            <ManagementLocationTable locations={locations} onUpdateOccupancy={updateOccupancy} />
            <ParkedVehiclesTable vehicles={parkedVehicles} />
        </div>
        <div className="space-y-8">
            <CreateLocationForm onAddLocation={addLocation} />
            <ManualEntryForm locations={locations} onAddVehicle={addParkedVehicle} />
        </div>
      </div>
    </div>
  );
}
