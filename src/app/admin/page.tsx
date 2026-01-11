'use client';

import { useEffect, useState } from 'react';
import { useUser } from '@/firebase';
import { useRouter } from 'next/navigation';
import { collection, query, where, getDocs, onSnapshot } from 'firebase/firestore';
import { useFirestore } from '@/firebase';
import type { ParkingLocation } from '@/lib/types';
import AdminLocationTable from '@/components/admin/admin-location-table';
import OccupancyPredictionCard from '@/components/admin/occupancy-prediction-card';
import FeeRecommendationCard from '@/components/admin/fee-recommendation-card';
import { Loader2 } from 'lucide-react';

export default function AdminPage() {
  const { user, loading: userLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const [locations, setLocations] = useState<ParkingLocation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userLoading && !user) {
      router.push('/login');
    }
  }, [user, userLoading, router]);

  useEffect(() => {
    if (user && firestore) {
      const q = query(collection(firestore, 'locations'), where('ownerId', '==', user.uid));
      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const userLocations: ParkingLocation[] = [];
        querySnapshot.forEach((doc) => {
          userLocations.push({ id: doc.id, ...doc.data() } as ParkingLocation);
        });
        setLocations(userLocations);
        setLoading(false);
      }, (error) => {
        console.error("Error fetching locations:", error);
        setLoading(false);
      });

      return () => unsubscribe();
    }
  }, [user, firestore]);

  if (userLoading || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-16 w-16 animate-spin" />
      </div>
    );
  }


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
