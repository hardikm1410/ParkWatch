'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import type { ParkingLocation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  parkingLocation: z.string().min(1, 'Please select a location.'),
  predictedOccupancy: z.number().min(0).max(100),
});

type FeeRecommendationCardProps = {
  locations: ParkingLocation[];
};

export default function FeeRecommendationCard({ locations }: FeeRecommendationCardProps) {
  const [recommendation, setRecommendation] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      parkingLocation: '',
      predictedOccupancy: 75,
    },
  });

  const selectedLocationName = form.watch('parkingLocation');
  const selectedLocation = locations.find(loc => loc.name === selectedLocationName);

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!selectedLocation) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Selected location not found.',
      });
      return;
    }

    setIsLoading(true);
    setRecommendation(null);
    toast({
        variant: 'destructive',
        title: 'Feature Not Available',
        description: 'AI features are currently disabled due to an installation issue.',
    });
    setIsLoading(false);
  }

  return (
    <Card>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="text-accent" />
              Optimal Fee Finder
            </CardTitle>
            <CardDescription>
              Get AI-driven fee recommendations to maximize revenue.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Feature Disabled</AlertTitle>
                <AlertDescription>
                The AI recommendation feature is temporarily unavailable.
                </AlertDescription>
            </Alert>
            <fieldset disabled={true} className="space-y-6">
              <FormField
                control={form.control}
                name="parkingLocation"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a location" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {locations.map((loc) => (
                          <SelectItem key={loc.id} value={loc.name}>
                            {loc.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedLocation && (
                       <p className="text-xs text-muted-foreground mt-1">Current Fee: ₹{selectedLocation.currentFee.toFixed(2)}</p>
                    )}
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="predictedOccupancy"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>Predicted Occupancy</FormLabel>
                      <span className="text-sm font-medium">{field.value}%</span>
                    </div>
                    <FormControl>
                      <Slider
                        min={0}
                        max={100}
                        step={1}
                        value={[field.value]}
                        onValueChange={(vals) => field.onChange(vals[0])}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </fieldset>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={true} className="bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Recommend Fee'
              )}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
