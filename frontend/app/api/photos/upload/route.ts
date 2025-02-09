import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { nanoid } from 'nanoid';

interface ImageMetadata {
  width: number;
  height: number;
}

async function ensureDirectory(dir: string) {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as { code?: string }).code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const blurDataUrl = formData.get('blurDataUrl') as string | null;
    const metadataStr = formData.get('metadata') as string | null;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith('image/')) {
      return NextResponse.json(
        { error: 'File must be an image' },
        { status: 400 }
      );
    }

    // Parse metadata
    let metadata: ImageMetadata | null = null;
    if (metadataStr) {
      try {
        metadata = JSON.parse(metadataStr);
      } catch {
        // Ignore parsing errors
      }
    }

    // Get file extension
    const ext = file.type.split('/')[1];
    const fileName = `${nanoid()}.${ext}`;

    // Create uploads directory structure
    const baseDir = join(process.cwd(), 'public');
    const uploadDir = join(baseDir, 'uploads');
    const blurDir = join(baseDir, 'uploads', 'blur');
    
    await Promise.all([
      ensureDirectory(uploadDir),
      blurDataUrl ? ensureDirectory(blurDir) : Promise.resolve(),
    ]);

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Save main image
    const filePath = join(uploadDir, fileName);
    await writeFile(filePath, buffer);

    // Save blur placeholder if provided
    let blurPath: string | undefined;
    if (blurDataUrl) {
      const blurFileName = `${fileName}.blur`;
      blurPath = join(blurDir, blurFileName);
      
      // Convert base64 to buffer and save
      const base64Data = blurDataUrl.split(',')[1];
      const blurBuffer = Buffer.from(base64Data, 'base64');
      await writeFile(blurPath, blurBuffer);
    }

    // Return the URLs and metadata
    const response = {
      url: `/uploads/${fileName}`,
      ...(blurPath && { blurDataUrl: `/uploads/blur/${fileName}.blur` }),
      ...(metadata && {
        width: metadata.width,
        height: metadata.height,
      }),
    };

    // Cache headers for better performance
    const headers = new Headers({
      'Cache-Control': 'public, max-age=31536000, immutable',
      'Content-Type': 'application/json',
    });

    return NextResponse.json(response, { headers });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}