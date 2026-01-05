
'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import type { BookingDetails } from '@/lib/types';
import { format } from 'date-fns';

type QrCodeModalProps = {
  isOpen: boolean;
  onClose: () => void;
  bookingDetails: BookingDetails;
};

export default function QrCodeModal({
  isOpen,
  onClose,
  bookingDetails,
}: QrCodeModalProps) {

  const qrCodeData = JSON.stringify({
    location: bookingDetails.locationName,
    vehicleNumber: bookingDetails.vehicleNumber,
    vehicleType: bookingDetails.vehicleType,
    bookedAt: bookingDetails.bookedAt,
    duration: bookingDetails.duration,
    finalFee: bookingDetails.finalFee,
  });
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=256x256&data=${encodeURIComponent(qrCodeData)}`;
  
  const vehicleTypeMap = {
    '2w': '2 Wheeler',
    '4w': '4 Wheeler',
    'auto': 'Auto'
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Your Booking Confirmation</DialogTitle>
          <DialogDescription>
            Show this confirmation at the entry gate. This reservation is valid for 15 minutes.
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-4 py-4">
          <div className="relative h-64 w-64 rounded-lg overflow-hidden border">
            <Image src={qrCodeUrl} alt="Booking QR Code" fill sizes="256px" />
          </div>
          <div className="text-center text-sm text-muted-foreground w-full space-y-1">
            <p><span className="font-semibold text-foreground">Location:</span> {bookingDetails.locationName}</p>
            <p><span className="font-semibold text-foreground">Vehicle:</span> {bookingDetails.vehicleNumber} ({vehicleTypeMap[bookingDetails.vehicleType]})</p>
            <p><span className="font-semibold text-foreground">Duration:</span> {bookingDetails.duration} hour(s)</p>
            <p><span className="font-semibold text-foreground">Amount Paid:</span> ${bookingDetails.finalFee.toFixed(2)}</p>
            <p><span className="font-semibold text-foreground">Booked At:</span> {format(bookingDetails.bookedAt, 'PPpp')}</p>
          </div>
        </div>
        <DialogFooter className="sm:justify-center">
          <Button type="button" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
