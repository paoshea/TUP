import { NextRequest, NextResponse } from 'next/server';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
  email: string;
  password: string;
  name?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    const user = await db.collection<User>('users').findOne({ email });
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    const isValid = await compare(password, user.password);
    if (!isValid) {
      return NextResponse.json(
        { error: 'Invalid password' },
        { status: 401 }
      );
    }

    const token = sign(
      { userId: user._id.toString(), email: user.email },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '7d' }
    );

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
      token,
    });
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Failed to sign in' },
      { status: 500 }
    );
  }
}