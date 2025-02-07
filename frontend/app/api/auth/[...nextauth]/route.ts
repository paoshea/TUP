import { NextResponse } from 'next/server';
import { hash, compare } from 'bcryptjs';
import { sign, verify } from 'jsonwebtoken';
import { clientPromise } from '../../../../lib/mongodb';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: Request) {
  try {
    const { action, email, password } = await request.json();

    const client = await clientPromise;
    const db = client.db();

    switch (action) {
      case 'signIn': {
        const user = await db.collection('users').findOne({ email });
        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const isValid = await compare(password, user.password);
        if (!isValid) {
          return NextResponse.json({ error: 'Invalid password' }, { status: 401 });
        }

        const token = sign(
          { userId: user._id.toString(), email: user.email },
          JWT_SECRET,
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
      }

      case 'signUp': {
        const existingUser = await db.collection('users').findOne({ email });
        if (existingUser) {
          return NextResponse.json({ error: 'User already exists' }, { status: 400 });
        }

        const hashedPassword = await hash(password, 12);
        const result = await db.collection('users').insertOne({
          email,
          password: hashedPassword,
          createdAt: new Date(),
        });

        const token = sign(
          { userId: result.insertedId.toString(), email },
          JWT_SECRET,
          { expiresIn: '7d' }
        );

        return NextResponse.json({
          user: {
            id: result.insertedId.toString(),
            email,
          },
          token,
        });
      }

      case 'verify': {
        const { token } = await request.json();
        const decoded = verify(token, JWT_SECRET) as { userId: string; email: string };
        const user = await db.collection('users').findOne({ email: decoded.email });

        if (!user) {
          return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        return NextResponse.json({
          user: {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
          },
        });
      }

      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }
  } catch (error) {
    console.error('Auth error:', error);
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 500 }
    );
  }
}