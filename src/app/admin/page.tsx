import { parkingLocations } from '@/lib/data';
import AdminLocationTable from '@/components/admin/admin-location-table';
import OccupancyPredictionCard from '@/components/admin/occupancy-prediction-card';
import FeeRecommendationCard from '@/components/admin/fee-recommendation-card';

export default function AdminPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="mb-8 text-4xl font-bold tracking-tighter font-headline">
        Admin Dashboard
      </h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        <div className="lg:col-span-3">
          <AdminLocationTable locations={parkingLocations} />
        </div>
        <div className="lg:col-span-2">
          <OccupancyPredictionCard locations={parkingLocations} />
        </div>
        <div>
          <FeeRecommendationCard locations={parkingLocations} />
        </div>
      </div>
    </div>
  );
}
