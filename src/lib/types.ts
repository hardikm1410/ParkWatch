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
