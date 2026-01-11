
'use client';

import { useState, useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, ResponsiveContainer } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { generateHistoricalDataForTime } from '@/lib/data';

const timeSlots = Array.from({ length: 12 }, (_, i) => {
  const hour = i + 8; // 8 AM to 7 PM
  return `${hour.toString().padStart(2, '0')}:00`;
});

type HistoricalTrendChartProps = {
  locationId: string;
};

export default function HistoricalTrendChart({ locationId }: HistoricalTrendChartProps) {
  const [selectedTime, setSelectedTime] = useState('14:00');

  const chartData = useMemo(
    () => generateHistoricalDataForTime(selectedTime, locationId),
    [selectedTime, locationId]
  );
  
  const chartConfig = {
    occupancy: {
      label: 'Occupancy',
      color: 'hsl(var(--accent))',
    },
  };

  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Weekly Trends</CardTitle>
            <CardDescription className="text-sm">Occupancy by day for selected time</CardDescription>
          </div>
          <Select value={selectedTime} onValueChange={setSelectedTime}>
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Select time" />
            </SelectTrigger>
            <SelectContent>
              {timeSlots.map((time) => (
                <SelectItem key={time} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[150px] w-full">
          <ChartContainer config={chartConfig} className="h-full w-full">
            <BarChart accessibilityLayer data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="day"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent indicator="dot" />}
              />
              <Bar dataKey="occupancy" fill="var(--color-occupancy)" radius={4} />
            </BarChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  );
}
