export type ParkingLocation = {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  occupiedSpots: number;
  currentFee: number;
  imageUrl: string;
  imageHint: string;
};

export type HistoricalDataPoint = {
  day: string;
  occupancy: number;
};

export type BookingDetails = {
  locationName: string;
  vehicleNumber: string;
  vehicleType: '2w' | '4w' | 'auto';
  bookedAt: Date;
  duration: number; // in hours
  finalFee: number;
};
