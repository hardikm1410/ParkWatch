import Image from 'next/image';
import type { ParkingLocation } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { MapPin } from 'lucide-react';
import OccupancyBar from './occupancy-bar';
import HistoricalTrendChart from './historical-trend-chart';

type ParkingLocationCardProps = {
  location: ParkingLocation;
};

export default function ParkingLocationCard({ location }: ParkingLocationCardProps) {
  const availableSpots = location.totalSpots - location.occupiedSpots;
  const occupancyPercentage = (location.occupiedSpots / location.totalSpots) * 100;

  return (
    <Card className="flex flex-col overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader className="p-0">
        <div className="relative h-48 w-full">
          <Image
            src={location.imageUrl}
            alt={location.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
            data-ai-hint={location.imageHint}
          />
        </div>
        <div className="p-6 pb-2">
          <CardTitle className="text-xl font-headline">{location.name}</CardTitle>
          <CardDescription className="flex items-center gap-2 pt-2">
            <MapPin className="h-4 w-4" />
            {location.address}
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-grow flex-col justify-between p-6 pt-0">
        <div>
          <div className="mb-4">
            <div className="flex justify-between items-baseline mb-1">
              <span className="text-sm font-medium text-muted-foreground">Availability</span>
              <span className="text-lg font-bold text-accent">{availableSpots} <span className="text-sm font-medium text-muted-foreground">/ {location.totalSpots} spots</span></span>
            </div>
            <OccupancyBar
              occupied={location.occupiedSpots}
              total={location.totalSpots}
            />
          </div>
          <HistoricalTrendChart locationId={location.id} />
        </div>
      </CardContent>
    </Card>
  );
}
