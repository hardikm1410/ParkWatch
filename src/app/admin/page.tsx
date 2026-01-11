
'use client';

import { useState, useEffect } from 'react';
import type { ParkingLocation } from '@/lib/types';
import AdminLocationTable from '@/components/admin/admin-location-table';
import OccupancyPredictionCard from '@/components/admin/occupancy-prediction-card';
import FeeRecommendationCard from '@/components/admin/fee-recommendation-card';
import { useUser, useFirestore, useCollection } from '@/firebase/index';
import { collection, query, where, Firestore } from 'firebase/firestore';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const firestore = useFirestore() as Firestore;
  const router = useRouter();

  const locationsQuery =
    user && firestore
      ? query(
          collection(firestore, 'parkingLocations'),
          where('ownerId', '==', user.uid)
        )
      : null;

  const { data: locations, loading: locationsLoading } =
    useCollection<ParkingLocation>(locationsQuery);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login?redirect=/admin');
    }
  }, [user, userLoading, router]);

  if (userLoading || locationsLoading) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        Loading Admin Dashboard...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-3">
          <AdminLocationTable locations={locations || []} />
        </div>
        <div className="lg:col-span-2">
          <OccupancyPredictionCard locations={locations || []} />
        </div>
        <div>
          <FeeRecommendationCard locations={locations || []} />
        </div>
      </div>
    </div>
  );
}
