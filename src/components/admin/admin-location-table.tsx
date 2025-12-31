import type { ParkingLocation } from '@/lib/types';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Car, DollarSign, MapPin } from 'lucide-react';

type AdminLocationTableProps = {
  locations: ParkingLocation[];
};

export default function AdminLocationTable({ locations }: AdminLocationTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parking Locations Overview</CardTitle>
        <CardDescription>
          Manage and monitor all parking locations from one place.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Occupancy</TableHead>
              <TableHead className="text-center">Availability</TableHead>
              <TableHead className="text-right">Current Fee</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => {
              const occupancyPercentage = (location.occupiedSpots / location.totalSpots) * 100;
              let availability: "high" | "medium" | "low";
              if (occupancyPercentage > 90) {
                availability = "low";
              } else if (occupancyPercentage > 60) {
                availability = "medium";
              } else {
                availability = "high";
              }

              return (
                <TableRow key={location.id}>
                  <TableCell>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="font-mono">{location.occupiedSpots}/{location.totalSpots}</div>
                    <div className="text-xs text-muted-foreground flex items-center justify-center gap-1">
                      <Car className="h-3 w-3" /> {occupancyPercentage.toFixed(1)}%
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant={availability === 'low' ? 'destructive' : availability === 'medium' ? 'secondary' : 'default'} className={cn({'bg-yellow-500 text-yellow-900': availability === 'medium', 'bg-green-500 text-green-900': availability === 'high'})}>
                      {availability.charAt(0).toUpperCase() + availability.slice(1)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-mono flex items-center justify-end gap-1">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      {location.currentFee.toFixed(2)}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
