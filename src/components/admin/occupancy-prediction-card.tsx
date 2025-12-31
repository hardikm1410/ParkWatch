'use client';

import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { predictFutureOccupancy } from '@/ai/flows/predict-future-occupancy';
import type { PredictFutureOccupancyOutput } from '@/ai/flows/predict-future-occupancy';

import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, Loader2, Wand2, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import type { ParkingLocation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const FormSchema = z.object({
  parkingLocation: z.string().min(1, 'Please select a parking location.'),
  date: z.date({ required_error: 'A date is required.' }),
  time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Invalid time format. Use HH:MM.'),
});

type OccupancyPredictionCardProps = {
  locations: ParkingLocation[];
};

export default function OccupancyPredictionCard({ locations }: OccupancyPredictionCardProps) {
  const [prediction, setPrediction] = useState<PredictFutureOccupancyOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const geminiApiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      parkingLocation: '',
      date: new Date(),
      time: '17:00',
    },
  });

  async function onSubmit(data: z.infer<typeof FormSchema>) {
    setIsLoading(true);
    setPrediction(null);
    try {
      const dateTime = new Date(data.date);
      const [hours, minutes] = data.time.split(':').map(Number);
      dateTime.setHours(hours, minutes);

      const result = await predictFutureOccupancy({
        parkingLocation: data.parkingLocation,
        dateTime: dateTime.toISOString(),
      });
      setPrediction(result);
    } catch (error) {
      console.error('Prediction failed:', error);
      toast({
        variant: 'destructive',
        title: 'Prediction Error',
        description: 'Could not generate a prediction. Please try again.',
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
              <Wand2 className="text-primary" />
              Occupancy Prediction
            </CardTitle>
            <CardDescription>
              Use AI to predict future occupancy rates based on historical data.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-3 gap-6">
            {!geminiApiKey && (
                <div className="md:col-span-3">
                    <Alert variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertTitle>API Key Missing</AlertTitle>
                        <AlertDescription>
                        The Gemini API key is not configured. Please set it in the environment variables.
                        </AlertDescription>
                    </Alert>
                </div>
            )}
            <fieldset disabled={!geminiApiKey} className="grid md:grid-cols-3 gap-6 contents">
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
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                    <FormItem className="flex flex-col">
                    <FormLabel>Date</FormLabel>
                    <Popover>
                        <PopoverTrigger asChild>
                        <FormControl>
                            <Button
                            variant={'outline'}
                            className={cn(
                                'pl-3 text-left font-normal',
                                !field.value && 'text-muted-foreground'
                            )}
                            >
                            {field.value ? format(field.value, 'PPP') : <span>Pick a date</span>}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                        </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) => date < new Date('1900-01-01')}
                            initialFocus
                        />
                        </PopoverContent>
                    </Popover>
                    <FormMessage />
                    </FormItem>
                )}
                />
                <FormField
                control={form.control}
                name="time"
                render={({ field }) => (
                    <FormItem>
                    <FormLabel>Time (24h)</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="e.g., 14:30" />
                    </FormControl>
                    <FormMessage />
                    </FormItem>
                )}
                />
            </fieldset>
          </CardContent>
          <CardFooter className="flex flex-col items-start gap-4">
            <Button type="submit" disabled={isLoading || !geminiApiKey}>
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Predicting...
                </>
              ) : (
                'Predict Occupancy'
              )}
            </Button>

            {prediction && (
              <Card className="w-full bg-accent/20">
                <CardHeader>
                  <CardTitle className="text-lg">AI Prediction Result</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex justify-around text-center">
                    <div>
                      <p className="text-sm text-muted-foreground">Predicted Occupancy</p>
                      <p className="text-3xl font-bold text-primary">
                        {prediction.predictedOccupancyRate.toFixed(1)}%
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Recommended Fee</p>
                      <p className="text-3xl font-bold text-primary">
                        ${prediction.recommendedParkingFee.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Reasoning:</p>
                    <p className="text-sm text-muted-foreground">{prediction.reasoning}</p>
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
