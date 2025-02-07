import { NextRequest, NextResponse } from 'next/server';
import { GridFSBucket } from 'mongodb';
import { clientPromise } from '@/lib/mongodb';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const path = formData.get('path') as string;

    if (!file || !path) {
      return NextResponse.json(
        { error: 'File and path are required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, {
      bucketName: 'photos'
    });

    // Convert File to Buffer
    const buffer = Buffer.from(await file.arrayBuffer());

    // Create upload stream
    const uploadStream = bucket.openUploadStream(path, {
      metadata: {
        contentType: file.type,
        originalName: file.name,
      }
    });

    // Write buffer to stream
    await new Promise<void>((resolve, reject) => {
      uploadStream.write(buffer, (error) => {
        if (error) reject(error);
        uploadStream.end(() => resolve());
      });
    });

    return NextResponse.json({
      path,
      fileId: uploadStream.id.toString()
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, {
      bucketName: 'photos'
    });

    // Find the file by filename (path)
    const files = await bucket.find({ filename: path }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    // Delete the file
    await bucket.delete(files[0]._id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete error:', error);
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');

    if (!path) {
      return NextResponse.json(
        { error: 'Path is required' },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db();
    const bucket = new GridFSBucket(db, {
      bucketName: 'photos'
    });

    // Find the file by filename (path)
    const files = await bucket.find({ filename: path }).toArray();
    
    if (files.length === 0) {
      return NextResponse.json(
        { error: 'File not found' },
        { status: 404 }
      );
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(file._id);

    // Convert stream to buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Create response with appropriate headers
    return new NextResponse(buffer, {
      headers: {
        'Content-Type': file.metadata?.contentType || 'application/octet-stream',
        'Content-Length': file.length.toString(),
      },
    });
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to download file' },
      { status: 500 }
    );
  }
}