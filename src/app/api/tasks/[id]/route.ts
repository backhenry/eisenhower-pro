import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = (await params).id;
  const body = await req.json();
  
  if (body.isCompleted === true) {
    body.completedAt = new Date();
  } else if (body.isCompleted === false) {
    body.completedAt = null;
  }

  const task = await prisma.task.updateMany({
    where: { id, userId },
    data: body
  });

  return NextResponse.json(task);
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = (await params).id;
  await prisma.task.deleteMany({
    where: { id, userId }
  });

  return NextResponse.json({ success: true });
}
