'use client';

import { useState } from 'react';
import { parkingLocations as initialLocations } from '@/lib/data';
import type { ParkingLocation, ParkedVehicle } from '@/lib/types';
import CreateLocationForm from '@/components/management/create-location-form';
import ManagementLocationTable from '@/components/management/management-location-table';
import ParkedVehiclesTable from '@/components/management/parked-vehicles-table';
import ManualEntryForm from '@/components/management/manual-entry-form';

export default function ManagementPage() {
  const [locations, setLocations] = useState<ParkingLocation[]>(initialLocations);
  const [parkedVehicles, setParkedVehicles] = useState<ParkedVehicle[]>([]);

  const addLocation = (newLocation: Omit<ParkingLocation, 'id' | 'occupiedSpots' | 'imageUrl' | 'imageHint'>) => {
    setLocations((prevLocations) => [
      ...prevLocations,
      {
        ...newLocation,
        id: newLocation.name.toLowerCase().replace(/\s+/g, '-'),
        occupiedSpots: 0,
        imageUrl: `https://picsum.photos/seed/${Math.random()}/600/400`,
        imageHint: 'parking lot',
      },
    ]);
  };

  const updateOccupancy = (locationId: string, occupiedSpots: number) => {
    setLocations(prevLocations =>
      prevLocations.map(loc => {
        if (loc.id === locationId) {
          const newOccupiedSpots = Math.max(0, Math.min(loc.totalSpots, occupiedSpots));
          return { ...loc, occupiedSpots: newOccupiedSpots };
        }
        return loc;
      })
    );
  };

  const addParkedVehicle = (vehicleData: Omit<ParkedVehicle, 'id' | 'checkInTime'>, locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (!location) return;

    const newVehicle: ParkedVehicle = {
      ...vehicleData,
      id: `${locationId}-${vehicleData.vehicleNumber}-${Date.now()}`,
      checkInTime: new Date(),
      locationName: location.name,
      chargesPaid: vehicleData.duration * location.currentFee,
    };

    setParkedVehicles(prev => [newVehicle, ...prev]);
    // Also update the occupancy of the location
    updateOccupancy(locationId, location.occupiedSpots + 1);
  };

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
