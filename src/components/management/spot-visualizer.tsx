'use client';

import type { ParkingLocation } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

type SpotVisualizerProps = {
  location: ParkingLocation;
};

export default function SpotVisualizer({ location }: SpotVisualizerProps) {
  const spots = Array.from({ length: location.totalSpots }, (_, i) => i + 1);
  const occupiedSpotsSet = new Set(
    Array.from({ length: location.occupiedSpots }, (_, i) => i + 1)
  );

  return (
    <Card>
      <CardHeader>
        <CardTitle>Spot Visualizer: {location.name}</CardTitle>
        <CardDescription>
          Real-time view of parking spot availability. Green for available, red for occupied.
        </CardDescription>
        <div className="flex items-center gap-6 pt-2">
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-green-500" />
                <span className="text-sm">Available: {location.totalSpots - location.occupiedSpots}</span>
            </div>
            <div className="flex items-center gap-2">
                <div className="h-4 w-4 rounded-sm bg-red-500" />
                <span className="text-sm">Occupied: {location.occupiedSpots}</span>
            </div>
        </div>
      </CardHeader>
      <CardContent>
        <TooltipProvider>
            <div className="grid grid-cols-10 sm:grid-cols-15 md:grid-cols-20 lg:grid-cols-25 gap-2">
            {spots.map((spotNumber) => {
                const isOccupied = occupiedSpotsSet.has(spotNumber);
                return (
                    <Tooltip key={spotNumber}>
                        <TooltipTrigger asChild>
                            <div
                                className={cn(
                                'h-8 w-8 rounded-sm flex items-center justify-center text-xs font-mono text-white',
                                isOccupied ? 'bg-red-500' : 'bg-green-500'
                                )}
                            >
                            </div>
                        </TooltipTrigger>
                        <TooltipContent>
                            <p>Spot #{spotNumber}</p>
                            <p>Status: {isOccupied ? 'Occupied' : 'Available'}</p>
                        </TooltipContent>
                    </Tooltip>
                );
            })}
            </div>
        </TooltipProvider>
      </CardContent>
    </Card>
  );
}
