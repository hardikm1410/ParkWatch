import type { ParkingLocation, HistoricalDataPoint } from './types';
import { PlaceHolderImages } from './placeholder-images';

const downtownGarageImage = PlaceHolderImages.find(p => p.id === 'downtown-garage')!;
const cityCenterLotImage = PlaceHolderImages.find(p => p.id === 'city-center-lot')!;
const airportParkingImage = PlaceHolderImages.find(p => p.id === 'airport-parking')!;
const mallStructureImage = PlaceHolderImages.find(p => p.id === 'mall-structure')!;
const stadiumLotImage = PlaceHolderImages.find(p => p.id === 'stadium-lot')!;


export const parkingLocations: ParkingLocation[] = [
  {
    id: 'downtown-garage',
    name: 'Downtown Garage',
    address: '123 Main St, Metropolis',
    totalSpots: 350,
    occupiedSpots: 280,
    currentFee: 5.5,
    imageUrl: downtownGarageImage.imageUrl,
    imageHint: downtownGarageImage.imageHint,
  },
  {
    id: 'city-center-lot',
    name: 'City Center Lot',
    address: '456 Market Ave, Metropolis',
    totalSpots: 120,
    occupiedSpots: 65,
    currentFee: 3.0,
    imageUrl: cityCenterLotImage.imageUrl,
    imageHint: cityCenterLotImage.imageHint,
  },
  {
    id: 'airport-parking',
    name: 'Airport Economy Park',
    address: '789 Airport Rd, Metropolis',
    totalSpots: 1200,
    occupiedSpots: 1050,
    currentFee: 2.0,
    imageUrl: airportParkingImage.imageUrl,
    imageHint: airportParkingImage.imageHint,
  },
  {
    id: 'mall-structure',
    name: 'Galleria Mall Parking',
    address: '101 Shopping Blvd, Suburbia',
    totalSpots: 800,
    occupiedSpots: 420,
    currentFee: 1.5,
    imageUrl: mallStructureImage.imageUrl,
    imageHint: mallStructureImage.imageHint,
  },
  {
    id: 'stadium-lot',
    name: 'Knights Stadium Lot G',
    address: '200 Victory Lane, Metropolis',
    totalSpots: 2500,
    occupiedSpots: 150,
    currentFee: 15.0,
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
