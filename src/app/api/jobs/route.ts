import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Get jobs' });
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ message: 'Create job' });
}