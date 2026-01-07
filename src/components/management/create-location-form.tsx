'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { PlusCircle, FileCheck } from 'lucide-react';

const FormSchema = z.object({
  name: z.string().min(3, 'Name must be at least 3 characters.'),
  address: z.string().min(5, 'Address must be at least 5 characters.'),
  totalSpots: z.coerce.number().int().min(1, 'Total spots must be at least 1.'),
  currentFee: z.coerce.number().min(0, 'Fee must be a positive number.'),
  document: z
    .any()
    // This validation is for client-side, browser environments
    .refine((files) => typeof window === 'undefined' || (files instanceof FileList && files.length > 0), 'A verification document is required.')
});

type CreateLocationFormProps = {
  onAddLocation: (data: Omit<z.infer<typeof FormSchema>, 'document'>) => void;
};

export default function CreateLocationForm({ onAddLocation }: CreateLocationFormProps) {
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: '',
      address: '',
      totalSpots: 100,
      currentFee: 50,
    },
  });
  
  const documentRef = form.register("document");

  function onSubmit(data: z.infer<typeof FormSchema>) {
    // For now, we are not handling the file upload itself, just the form data.
    const { document, ...locationData } = data;
    console.log("Verification document submitted:", document[0].name);

    onAddLocation(locationData);
    toast({
      title: 'Location Added',
      description: `${data.name} has been added to your locations.`,
    });
    form.reset();
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PlusCircle className="text-primary" />
              Create New Parking Location
            </CardTitle>
            <CardDescription>
              Add a new parking facility to the system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., North Lot" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., 456 Tech Park Ave" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
                <FormField
                control={form.control}
                name="totalSpots"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Total Spots</FormLabel>
                    <FormControl>
                        <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="currentFee"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Fee (₹)</FormLabel>
                    <FormControl>
                        <Input type="number" step="10" {...field} />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </div>
             <FormField
              control={form.control}
              name="document"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="flex items-center gap-2">
                    <FileCheck className="h-4 w-4" />
                    Verification Document
                  </FormLabel>
                  <FormControl>
                    <Input type="file" {...documentRef} />
                  </FormControl>
                  <FormDescription>
                    Upload a document to verify the location (e.g., ownership, lease).
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button type="submit">Add Location</Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
