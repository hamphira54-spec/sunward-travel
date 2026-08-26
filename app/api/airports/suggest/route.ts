import { type NextRequest, NextResponse } from 'next/server';
import { searchAirports } from '@/lib/data/airports';

export async function GET(request: NextRequest) {
  const q = request.nextUrl.searchParams.get('q') ?? '';
  const results = searchAirports(q, 8);
  return NextResponse.json(results);
}
