import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    recommendations: [],
    message: 'No recommendations available'
  });
}

export const dynamic = 'force-dynamic';