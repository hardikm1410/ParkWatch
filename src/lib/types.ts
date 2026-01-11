export type ParkingLocation = {
  id: string;
  name: string;
  address: string;
  totalSpots: number;
  occupiedSpots: number;
  currentFee: number;
  imageUrl: string;
  imageHint: string;
  ownerId: string;
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

export type ParkedVehicle = {
  id: string;
  vehicleNumber: string;
  vehicleType: '2w' | '4w' | 'auto';
  checkInTime: Date;
  duration: number; // in hours
  chargesPaid: number;
  locationName: string;
  mobileNumber?: string;
};
