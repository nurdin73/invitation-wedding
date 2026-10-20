import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const secret = searchParams.get('secret');
    const slug = searchParams.get('slug');

    const expectedSecret = process.env.INTERNAL_REVALIDATE_SECRET || 'local_secure_revalidate_shared_secret';

    if (secret !== expectedSecret) {
      return NextResponse.json({ message: 'Token revalidasi tidak valid.' }, { status: 401 });
    }

    if (!slug) {
      return NextResponse.json({ message: 'Parameter slug diperlukan.' }, { status: 400 });
    }

    // Revalidate ISR page untuk slug publik
    revalidatePath(`/${slug}`);

    return NextResponse.json({
      revalidated: true,
      slug,
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    return NextResponse.json(
      { message: 'Gagal melakukan revalidasi cache.', error: String(err) },
      { status: 500 }
    );
  }
}
