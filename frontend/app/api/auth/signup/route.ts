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

function validateSignupInput(data: any) {
  const errors: string[] = [];

  if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Valid email is required');
  }

  if (!data.password || data.password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }

  if (!data.name || data.name.trim().length === 0) {
    errors.push('Name is required');
  }

  return errors;
}

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const { email, password, name, farm, location } = await request.json();
    
    // Validate input
    const validationErrors = validateSignupInput({ email, password, name });
    if (validationErrors.length > 0) {
      return NextResponse.json({ error: validationErrors.join(', ') }, { status: 400 });
    }

    // Connect to MongoDB
    const client = await clientPromise;
    const db = client.db();

    // Check if user already exists
    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { error: 'An account with this email already exists' },
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

    // Generate JWT token
    const token = sign(
      { 
        userId: result.insertedId.toString(),
        email 
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    // Return success response
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
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('MongoDB')) {
        return NextResponse.json(
          { error: 'Database connection failed. Please try again later.' },
          { status: 503 }
        );
      }
      return NextResponse.json({ error: error.message }, { status: 400 });
    }

    // Generic error response
    return NextResponse.json(
      { error: 'Failed to create account. Please try again.' },
      { status: 500 }
    );
  }
}