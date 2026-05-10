import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, isUrgent, isImportant, quadrantId } = body;

  const task = await prisma.task.create({
    data: {
      title,
      isUrgent,
      isImportant,
      quadrantId,
      userId
    }
  });

  return NextResponse.json(task);
}
