import type { ParkingLocation, HistoricalDataPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

const downtownGarageImage = PlaceHolderImages.find(p => p.id === 'downtown-garage')!;
const cityCenterLotImage = PlaceHolderImages.find(p => p.id === 'city-center-lot')!;
const airportParkingImage = PlaceHolderImages.find(p => p.id === 'airport-parking')!;
const mallStructureImage = PlaceHolderImages.find(p => p.id === 'mall-structure')!;
const stadiumLotImage = PlaceHolderImages.find(p => p.id === 'stadium-lot')!;


export const parkingLocations: ParkingLocation[] = [
  {
    id: 'connaught-place-delhi',
    name: 'Connaught Place Parking',
    address: 'Inner Circle, New Delhi',
    totalSpots: 500,
    occupiedSpots: 450,
    currentFee: 150,
    imageUrl: downtownGarageImage.imageUrl,
    imageHint: downtownGarageImage.imageHint,
  },
  {
    id: 'indiranagar-bangalore',
    name: 'Indiranagar Metro Lot',
    address: 'CMH Road, Bangalore',
    totalSpots: 200,
    occupiedSpots: 150,
    currentFee: 100,
    imageUrl: cityCenterLotImage.imageUrl,
    imageHint: cityCenterLotImage.imageHint,
  },
  {
    id: 'mumbai-airport',
    name: 'Mumbai Airport Parking',
    address: 'Chhatrapati Shivaji Maharaj Int\'l',
    totalSpots: 1500,
    occupiedSpots: 1300,
    currentFee: 250,
    imageUrl: airportParkingImage.imageUrl,
    imageHint: airportParkingImage.imageHint,
  },
  {
    id: 'express-avenue-chennai',
    name: 'Express Avenue Mall',
    address: 'Whites Road, Royapettah, Chennai',
    totalSpots: 1000,
    occupiedSpots: 700,
    currentFee: 80,
    imageUrl: mallStructureImage.imageUrl,
    imageHint: mallStructureImage.imageHint,
  },
  {
    id: 'wankhede-stadium-mumbai',
    name: 'Wankhede Stadium Lot',
    address: 'D Road, Churchgate, Mumbai',
    totalSpots: 1800,
    occupiedSpots: 300,
    currentFee: 550,
    imageUrl: stadiumLotImage.imageUrl,
    imageHint: stadiumLotImage.imageHint,
  },
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

export function generateHistoricalDataForTime(time: string, locationId: string): HistoricalDataPoint[] {
  // Simple hash function to get a seed from locationId and time
  const seed = (locationId + time)
    .split('')
    .reduce((acc, char) => acc + char.charCodeAt(0), 0);

  return daysOfWeek.map((day, index) => {
    // Generate pseudo-random occupancy based on day and time
    const timeFactor = parseInt(time.split(':')[0], 10) / 24; // 0-1
    const dayFactor = (day === 'Sat' || day === 'Sun') ? 1.2 : 0.9;
    
    // Use seed for deterministic randomness
    const randomFactor = ((seed * (index + 1)) % 100) / 100;
    
    let occupancy = (timeFactor * 0.5 + dayFactor * 0.3 + randomFactor * 0.2) * 100;

    if (occupancy > 100) occupancy = 100;
    if (occupancy < 10) occupancy = 10;
    
    return {
      day,
      occupancy: Math.round(occupancy),
    };
  });
}
