'use client';

import { useState, useEffect } from 'react';
import { parkingLocations as initialLocations } from '@/lib/data';
import type { ParkingLocation } from '@/lib/types';
import ParkingLocationCard from '@/components/user/parking-location-card';

export default function UserDashboard() {
  const [locations, setLocations] = useState<ParkingLocation[]>(initialLocations);

  useEffect(() => {
    const interval = setInterval(() => {
      setLocations((prevLocations) =>
        prevLocations.map((loc) => {
          // Simulate occupancy changes
          const change = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
          let newOccupiedSpots = loc.occupiedSpots + change;
          if (newOccupiedSpots < 0) newOccupiedSpots = 0;
          if (newOccupiedSpots > loc.totalSpots) newOccupiedSpots = loc.totalSpots;
          return { ...loc, occupiedSpots: newOccupiedSpots };
        })
      );
    }, 3000); // Update every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter text-center font-headline">
        Find Parking Fast
      </h1>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {locations.map((location) => (
          <ParkingLocationCard key={location.id} location={location} />
        ))}
      </div>
    </div>
  );
}
