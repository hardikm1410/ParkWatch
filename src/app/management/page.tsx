
'use client';
import { useState } from 'react';
import type { ParkingLocation, ParkedVehicle } from '@/lib/types';
import CreateLocationForm from '@/components/management/create-location-form';
import ManagementLocationTable from '@/components/management/management-location-table';
import ParkedVehiclesTable from '@/components/management/parked-vehicles-table';
import ManualEntryForm from '@/components/management/manual-entry-form';
import { useToast } from '@/hooks/use-toast';

export default function ManagementPage() {
  const { toast } = useToast();
  const user = { uid: 'temp-manager-user' }; // Mock user

  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const locationsLoading = false;

  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);

  const addLocation = async (
    newLocationData: Omit<ParkingLocation, 'id' | 'occupiedSpots' | 'imageUrl' | 'imageHint' | 'ownerId'>
  ) => {
    if (!user) return;

    try {
      const newLocation: ParkingLocation = {
        id: `loc-${Date.now()}`,
        ...newLocationData,
        occupiedSpots: 0,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'parking lot',
        ownerId: user.uid,
      }
      setLocations(prev => [...prev, newLocation]);
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
    const location = locations?.find(loc => loc.id === locationId);
    if (!location) return;

    const newOccupiedSpots = Math.max(0, Math.min(location.totalSpots, occupiedSpots));

    setLocations(prev => prev.map(loc => loc.id === locationId ? { ...loc, occupiedSpots: newOccupiedSpots } : loc));
  };

  const addParkedVehicle = async (
    vehicleData: Omit<ParkedVehicle, 'id' | 'checkInTime' | 'chargesPaid' | 'locationName'>,
    locationId: string
  ) => {
    const location = locations?.find(loc => loc.id === locationId);
    if (!location) return;

    const newVehicle: ParkedVehicle = {
      ...vehicleData,
      id: `vh-${Date.now()}`,
      checkInTime: new Date(),
      locationName: location.name,
      chargesPaid: vehicleData.duration * location.currentFee,
    };
    
    try {
      setParkedVehicles(prev => [...prev, newVehicle]);
      updateOccupancy(locationId, location.occupiedSpots + 1);
    } catch(e) {
      console.error(e);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Could not register vehicle.',
      });
    }
  };
  
  if (locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading Management Dashboard...
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
