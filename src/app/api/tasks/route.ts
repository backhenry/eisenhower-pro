import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.task.findMany({
    where: { userId },
    include: { subtasks: true },
    orderBy: { createdAt: 'desc' }
  });

  return NextResponse.json(tasks);
}

export async function POST(req: Request) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const { title, isUrgent, isImportant, quadrantId, description, dueDate, subtasks } = body;

  const task = await prisma.task.create({
    data: {
      title,
      isUrgent,
      isImportant,
      quadrantId,
      userId,
      description,
      dueDate: dueDate ? new Date(dueDate) : null,
      subtasks: subtasks && subtasks.length > 0 ? {
        create: subtasks.map((st: any) => ({
          title: st.title,
          isCompleted: st.isCompleted || false
        }))
      } : undefined
    },
    include: { subtasks: true }
  });

  return NextResponse.json(task);
}
