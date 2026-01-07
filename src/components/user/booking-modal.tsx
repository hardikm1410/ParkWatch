
'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { ParkingLocation } from '@/lib/types';


const BookingFormSchema = z.object({
  vehicleNumber: z.string().min(1, 'Vehicle number is required.'),
  vehicleType: z.enum(['2w', '4w', 'auto'], {
    required_error: 'Please select a vehicle type.',
  }),
  duration: z.coerce.number().min(1, 'Duration must be at least 1 hour.'),
});

type BookingModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (data: z.infer<typeof BookingFormSchema> & { finalFee: number }) => void;
  location: ParkingLocation;
};

export default function BookingModal({
  isOpen,
  onClose,
  onConfirm,
  location,
}: BookingModalProps) {
  const form = useForm<z.infer<typeof BookingFormSchema>>({
    resolver: zodResolver(BookingFormSchema),
    defaultValues: {
      vehicleNumber: '',
      duration: 1,
    },
  });

  const duration = form.watch('duration');
  const finalFee = duration * location.currentFee;

  function onSubmit(data: z.infer<typeof BookingFormSchema>) {
    onConfirm({ ...data, finalFee });
    form.reset();
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <DialogHeader>
              <DialogTitle>Book Your Spot</DialogTitle>
              <DialogDescription>
                Enter your details to reserve a spot for 15 minutes.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-6 py-4">
              <FormField
                control={form.control}
                name="vehicleNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Vehicle Number</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., MH 12 AB 1234" {...field} />
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
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
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
                      <FormLabel>Duration (Hours)</FormLabel>
                      <FormControl>
                        <Input type="number" min="1" max="24" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex justify-between items-center rounded-lg bg-secondary p-3">
                <span className="text-secondary-foreground font-medium">Total Charges</span>
                <span className="text-2xl font-bold text-primary">₹{finalFee.toFixed(2)}</span>
              </div>

            </div>
            <DialogFooter>
              <Button type="button" variant="ghost" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">Confirm Booking</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
