import { type NextRequest, NextResponse } from 'next/server';
import { searchFlights } from '@/lib/services/travelpayouts';
import type { FlightSearchParams } from '@/lib/types/flights';

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const origin      = searchParams.get('origin')?.toUpperCase();
  const destination = searchParams.get('destination')?.toUpperCase();
  const departDate  = searchParams.get('departDate');
  const returnDate  = searchParams.get('returnDate') ?? undefined;
  const adults      = parseInt(searchParams.get('adults') ?? '1', 10);
  const tripType    = (searchParams.get('tripType') ?? 'roundtrip') as 'roundtrip' | 'oneway';
  const currency    = searchParams.get('currency') ?? 'USD';

  // Validate required params
  if (!origin || !destination || !departDate) {
    return NextResponse.json(
      { error: 'Missing required parameters: origin, destination, departDate' },
      { status: 400 }
    );
  }

  // Basic IATA code validation
  if (!/^[A-Z]{3}$/.test(origin) || !/^[A-Z]{3}$/.test(destination)) {
    return NextResponse.json(
      { error: 'origin and destination must be 3-letter IATA codes' },
      { status: 400 }
    );
  }

  const params: FlightSearchParams = {
    origin,
    destination,
    departDate,
    returnDate: tripType === 'roundtrip' ? returnDate : undefined,
    adults,
    tripType,
    currency,
  };

  try {
    const data = await searchFlights(params);
    return NextResponse.json(data);
  } catch (error) {
    console.error('[/api/flights/search]', error);
    return NextResponse.json(
      { error: 'Failed to fetch flight data. Please try again.' },
      { status: 500 }
    );
  }
}
