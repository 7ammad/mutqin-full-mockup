import { NextResponse } from 'next/server';
import { resetDemo } from '@/context/demoStore';

export async function POST() {
  resetDemo();
  return NextResponse.json({ ok: true });
}
