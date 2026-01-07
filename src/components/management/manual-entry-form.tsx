'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Car, Send } from 'lucide-react';
import type { ParkingLocation } from '@/lib/types';
import type { ParkedVehicle } from '@/lib/types';

const FormSchema = z.object({
  locationId: z.string().min(1, 'Please select a location.'),
  vehicleNumber: z.string().min(3, 'Vehicle number must be at least 3 characters.'),
  vehicleType: z.enum(['2w', '4w', 'auto']),
  duration: z.coerce.number().int().min(1, 'Duration must be at least 1 hour.'),
  mobileNumber: z.string().regex(/^\d{10}$/, 'Please enter a valid 10-digit mobile number.'),
});

type ManualEntryFormProps = {
  locations: ParkingLocation[];
  onAddVehicle: (data: Omit<ParkedVehicle, 'id' | 'checkInTime' | 'chargesPaid' | 'locationName'>, locationId: string) => void;
};

export default function ManualEntryForm({ locations, onAddVehicle }: ManualEntryFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      locationId: '',
      vehicleNumber: '',
      vehicleType: '4w',
      duration: 1,
      mobileNumber: '',
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const { locationId, ...vehicleData } = data;
    onAddVehicle(vehicleData, locationId);
    
    toast({
      title: 'Vehicle Registered & Notified',
      description: `QR code sent to ${data.mobileNumber} for vehicle ${data.vehicleNumber}.`,
    });
    form.reset({ ...form.getValues(), vehicleNumber: '', mobileNumber: '' });
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Car className="text-primary" />
              Manual Vehicle Entry
            </CardTitle>
            <CardDescription>
              Manually register a vehicle and send them a virtual ticket.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="locationId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Parking Location</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a location..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {locations.map((loc) => (
                        <SelectItem key={loc.id} value={loc.id}>
                          {loc.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="vehicleNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Vehicle Number</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., DL 5C AB 1234" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="mobileNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile Number</FormLabel>
                  <FormControl>
                    <Input type="tel" placeholder="10-digit mobile number" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="vehicleType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Type</FormLabel>
                     <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="2w">2 Wheeler</SelectItem>
                          <SelectItem value="4w">4 Wheeler</SelectItem>
                          <SelectItem value="auto">Auto</SelectItem>
                        </SelectContent>
                      </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="duration"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Duration (Hrs)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit">
                <Send className="mr-2 h-4 w-4" />
                Register & Send QR
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
