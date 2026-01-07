'use client';
import type { ParkingLocation } from '@/lib/types';
import { useState } from 'react';
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
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { MapPin, Car, DollarSign, Edit, Save, X } from 'lucide-react';


type ManagementLocationTableProps = {
  locations: ParkingLocation[];
  onUpdateOccupancy: (locationId: string, occupiedSpots: number) => void;
};

export default function ManagementLocationTable({ locations, onUpdateOccupancy }: ManagementLocationTableProps) {
    const [editState, setEditState] = useState<Record<string, number | null>>({});

    const handleEdit = (id: string, occupiedSpots: number) => {
        setEditState(prev => ({ ...prev, [id]: occupiedSpots }));
    };

    const handleCancel = (id: string) => {
        setEditState(prev => ({ ...prev, [id]: null }));
    };

    const handleSave = (id: string) => {
        const value = editState[id];
        if (value !== null && value !== undefined) {
            onUpdateOccupancy(id, value);
        }
        handleCancel(id);
    };

    const handleChange = (id: string, value: string) => {
        const numValue = parseInt(value, 10);
        if (!isNaN(numValue)) {
            setEditState(prev => ({ ...prev, [id]: numValue }));
        } else if (value === '') {
            setEditState(prev => ({ ...prev, [id]: 0 }));
        }
    };


  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Parking Locations</CardTitle>
        <CardDescription>
          View and manage your created parking locations.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Location</TableHead>
              <TableHead className="text-center">Total Spots</TableHead>
              <TableHead className="text-center">Occupied Spots</TableHead>
              <TableHead className="text-right">Fee</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locations.map((location) => {
              const isEditing = editState[location.id] !== null && editState[location.id] !== undefined;
              return (
                <TableRow key={location.id}>
                  <TableCell>
                    <div className="font-medium">{location.name}</div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <MapPin className="h-3 w-3" /> {location.address}
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {location.totalSpots}
                  </TableCell>
                  <TableCell className="text-center font-mono">
                    {isEditing ? (
                        <Input
                            type="number"
                            value={editState[location.id] ?? ''}
                            onChange={(e) => handleChange(location.id, e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleSave(location.id);
                                if (e.key === 'Escape') handleCancel(location.id);
                            }}
                            className="w-24 mx-auto h-8"
                            max={location.totalSpots}
                            min={0}
                        />
                    ) : (
                        location.occupiedSpots
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="font-mono flex items-center justify-end gap-1">
                        <span className="text-muted-foreground">₹</span>
                        {location.currentFee.toFixed(2)}
                    </div>
                  </TableCell>
                   <TableCell className="text-right">
                    {isEditing ? (
                      <div className="flex gap-1 justify-end">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleSave(location.id)}>
                          <Save className="h-4 w-4 text-primary" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleCancel(location.id)}>
                          <X className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    ) : (
                      <Button variant="outline" size="sm" onClick={() => handleEdit(location.id, location.occupiedSpots)}>
                        <Edit className="h-3 w-3 mr-1" />
                        Update
                      </Button>
                    )}
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
