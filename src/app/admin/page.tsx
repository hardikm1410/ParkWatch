'use client';

import { useState } from 'react';
import type { ParkingLocation } from '@/lib/types';
import AdminLocationTable from '@/components/admin/admin-location-table';
import OccupancyPredictionCard from '@/components/admin/occupancy-prediction-card';
import FeeRecommendationCard from '@/components/admin/fee-recommendation-card';
import { parkingLocations } from '@/lib/data';

export default function AdminPage() {
  const [locations] = useState<ParkingLocation[]>(parkingLocations);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-3">
          <AdminLocationTable locations={locations} />
        </div>
        <div className="lg:col-span-2">
          <OccupancyPredictionCard locations={locations} />
        </div>
        <div>
          <FeeRecommendationCard locations={locations} />
        </div>
      </div>
    </div>
  );
}
