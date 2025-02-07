import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';
import { clientPromise } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

interface User {
  _id: ObjectId;
  email: string;
  name?: string;
}

interface DecodedToken {
  userId: string;
  email: string;
}

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    // Verify token
    const decoded = verify(
      token,
      process.env.JWT_SECRET || 'your-secret-key'
    ) as DecodedToken;

    const client = await clientPromise;
    const db = client.db();

    // Find user
    const user = await db
      .collection<User>('users')
      .findOne({ _id: new ObjectId(decoded.userId) });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      user: {
        id: user._id.toString(),
        email: user.email,
        name: user.name,
      },
    });
  } catch (error) {
    console.error('Token verification error:', error);
    return NextResponse.json(
      { error: 'Invalid token' },
      { status: 401 }
    );
  }
}