import { NextRequest, NextResponse } from 'next/server';
import { hash } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { clientPromise } from '@/lib/mongodb';

interface User {
  email: string;
  password: string;
  name?: string;
  farm?: string;
  location?: string;
  createdAt: Date;
}

export async function POST(request: NextRequest) {
  try {
    let client;
    try {
      client = await clientPromise;
    } catch (error) {
      console.error('MongoDB connection error:', error);
      return NextResponse.json({ error: 'Database connection failed' }, { status: 503 });
    }

    const { email, password, name, farm, location } = await request.json();
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hash(password, 12);

    // Create new user
    const result = await db.collection<User>('users').insertOne({
      email,
      password: hashedPassword,
      name,
      farm,
      location,
      createdAt: new Date(),
    });

    // Generate token
    const token = sign(
      { userId: result.insertedId.toString(), email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: result.insertedId.toString(),
        email,
        name,
        farm,
        location,
      },
      token,
    });
  } catch (error) {
    console.error('Sign up error:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: 'Failed to sign up' },
      { status: 500 }
    );
  }
}