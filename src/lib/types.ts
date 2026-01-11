import type { Timestamp } from 'firebase/firestore';

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
  createdAt?: Timestamp;
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
  checkInTime: Date | Timestamp;
  duration: number; // in hours
  chargesPaid: number;
  locationName: string;
  mobileNumber?: string;
  ownerId?: string;
};
