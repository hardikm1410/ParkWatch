'use client';
import type { ParkedVehicle } from '@/lib/types';
import { format } from 'date-fns';
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
import { Car, Clock, Calendar, IndianRupee, Tag } from 'lucide-react';

type ParkedVehiclesTableProps = {
  vehicles: ParkedVehicle[];
};

const vehicleTypeMap = {
  '2w': '2 Wheeler',
  '4w': '4 Wheeler',
  'auto': 'Auto'
};

export default function ParkedVehiclesTable({ vehicles }: ParkedVehiclesTableProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Parked Vehicles</CardTitle>
        <CardDescription>
          A real-time list of all vehicles currently parked in your lots.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Vehicle Details</TableHead>
              <TableHead>Check-in Info</TableHead>
              <TableHead>Location</TableHead>
              <TableHead className="text-right">Charges</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {vehicles.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  No vehicles currently parked.
                </TableCell>
              </TableRow>
            ) : (
              vehicles.map((vehicle) => (
                <TableRow key={vehicle.id}>
                  <TableCell>
                    <div className="font-medium flex items-center gap-2">
                        <Car className="h-4 w-4 text-muted-foreground" />
                        {vehicle.vehicleNumber}
                    </div>
                    <div className="text-sm text-muted-foreground ml-6">
                      {vehicleTypeMap[vehicle.vehicleType]}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                       <Calendar className="h-4 w-4 text-muted-foreground" />
                       {format(vehicle.checkInTime, 'dd MMM, yyyy')}
                    </div>
                    <div className="text-sm text-muted-foreground ml-6 flex items-center gap-2">
                      <Clock className="h-3 w-3" />
                      {format(vehicle.checkInTime, 'p')} for {vehicle.duration}hr
                    </div>
                  </TableCell>
                   <TableCell>
                     <Badge variant="outline">{vehicle.locationName}</Badge>
                  </TableCell>
                  <TableCell className="text-right font-mono flex items-center justify-end gap-1">
                     <IndianRupee className="h-4 w-4 text-muted-foreground" />
                     {vehicle.chargesPaid.toFixed(2)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
