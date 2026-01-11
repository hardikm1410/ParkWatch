
'use client';

import { useState } from 'react';
import type { ParkingLocation } from '@/lib/types';
import AdminLocationTable from '@/components/admin/admin-location-table';
import FeeRecommendationCard from '@/components/admin/fee-recommendation-card';
import OccupancyPredictionCard from '@/components/admin/occupancy-prediction-card';

export default function AdminPage() {

  const [locations] = useState<ParkingLocation[]>([
      {id: 'demo-1', name: 'Demo North Lot', address: '123 Demo St', totalSpots: 100, occupiedSpots: 78, currentFee: 50, imageUrl: `https://picsum.photos/seed/loc1/600/400`, imageHint: 'parking lot', ownerId: 'temp-admin-user'},
      {id: 'demo-2', name: 'Demo South Lot', address: '456 Demo Ave', totalSpots: 150, occupiedSpots: 45, currentFee: 60, imageUrl: `https://picsum.photos/seed/loc2/600/400`, imageHint: 'parking garage', ownerId: 'temp-admin-user'},
      {id: 'demo-3', name: 'Demo Downtown Garage', address: '789 Demo Blvd', totalSpots: 250, occupiedSpots: 220, currentFee: 75, imageUrl: `https://picsum.photos/seed/loc3/600/400`, imageHint: 'underground parking', ownerId: 'temp-admin-user'}
  ]);
  const locationsLoading = false;

  if (locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading Admin Dashboard...
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-2">
          <AdminLocationTable locations={locations || []} />
        </div>
        <div className="space-y-8">
            <OccupancyPredictionCard locations={locations || []} />
            <FeeRecommendationCard locations={locations || []} />
        </div>
      </div>
    </div>
  );
}
