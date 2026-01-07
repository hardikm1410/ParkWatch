'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { recommendOptimalFees } from '@/ai/flows/recommend-optimal-fees';
import type { RecommendOptimalFeesOutput } from '@/ai/flows/recommend-optimal-fees';

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
  const [recommendation, setRecommendation] = useState<RecommendOptimalFeesOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

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
    try {
      const result = await recommendOptimalFees({
        parkingLocation: data.parkingLocation,
        currentFee: selectedLocation.currentFee,
        predictedOccupancy: data.predictedOccupancy / 100,
      });
      setRecommendation(result);
    } catch (error) {
      console.error('Recommendation failed:', error);
      toast({
        variant: 'destructive',
        title: 'Recommendation Error',
        description: 'Could not generate a recommendation. Please try again.',
      });
    } finally {
      setIsLoading(false);
    }
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
            {!geminiApiKey && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>API Key Missing</AlertTitle>
                <AlertDescription>
                  The Gemini API key is not configured. Please set it in the environment variables.
                </AlertDescription>
              </Alert>
            )}
            <fieldset disabled={!geminiApiKey} className="space-y-6">
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
            <Button type="submit" disabled={isLoading || !geminiApiKey} className="bg-accent hover:bg-accent/90">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Analyzing...
                </>
              ) : (
                'Recommend Fee'
              )}
            </Button>
            {recommendation && (
              <Card className="w-full bg-primary/10">
                <CardHeader>
                  <CardTitle className="text-lg">AI Fee Recommendation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">Recommended Fee</p>
                    <p className="text-4xl font-bold text-accent">
                      ₹{recommendation.recommendedFee.toFixed(2)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reasoning:</p>
                    <p className="text-sm text-muted-foreground">{recommendation.reasoning}</p>
                  </div>
                </CardContent>
              </Card>
            )}
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
