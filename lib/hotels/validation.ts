import { z } from 'zod';
import { HotelSearchInput } from './types';

export const HotelSearchInputSchema = z.object({
  destination: z.string().min(1, 'Destination is required'),
  destinationId: z.string().optional(),
  checkIn: z.date().optional(),
  checkOut: z.date().optional(),
  adults: z.number().int().min(1, 'At least 1 adult is required'),
  children: z.number().int().min(0).optional(),
  rooms: z.number().int().min(1, 'At least 1 room is required'),
  currency: z.string().optional(),
  locale: z.string().optional(),
}).refine(data => {
  if (data.checkIn && data.checkOut) {
    return data.checkOut > data.checkIn;
  }
  return true;
}, {
  message: 'Check-out date must be after check-in date',
  path: ['checkOut'],
});

export function validateHotelSearchInput(input: unknown): HotelSearchInput {
  return HotelSearchInputSchema.parse(input) as HotelSearchInput;
}

export function validateUrlSafety(url: string | null | undefined): string | undefined {
  if (!url) return undefined;
  try {
    const parsed = new URL(url);
    if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
      return undefined; // reject unsafe protocols
    }
    return url;
  } catch {
    return undefined; // invalid url
  }
}
