import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    comparisons: [],
    message: 'No historical comparisons available'
  });
}

export const dynamic = 'force-dynamic';