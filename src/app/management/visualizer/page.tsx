'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { parkingLocations } from '@/lib/data';
import type { ParkingLocation } from '@/lib/types';
import SpotVisualizer from '@/components/management/spot-visualizer';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function VisualizerPage() {
  const searchParams = useSearchParams();
  const initialLocationId = searchParams.get('location');

  const [selectedLocationId, setSelectedLocationId] = useState<string | null>(initialLocationId || parkingLocations[0]?.id || null);

  const selectedLocation = useMemo(() => {
    return parkingLocations.find(loc => loc.id === selectedLocationId) || null;
  }, [selectedLocationId]);
  
  const handleLocationChange = (locationId: string) => {
      setSelectedLocationId(locationId);
      // Update URL without reloading the page
      window.history.pushState(null, '', `/management/visualizer?location=${locationId}`);
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
                {parkingLocations.map((location) => (
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
          <p>Please select a location to see the spot visualizer.</p>
        </div>
      )}
    </div>
  );
}
