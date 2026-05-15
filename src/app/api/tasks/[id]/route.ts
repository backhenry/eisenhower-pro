import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const id = (await params).id;
  const body = await req.json();
  
  // Verify ownership
  const existingTask = await prisma.task.findUnique({
    where: { id }
  });
  if (!existingTask || existingTask.userId !== userId) {
    return NextResponse.json({ error: 'Not Found or Unauthorized' }, { status: 404 });
  }

  const { subtasks, dueDate, ...restBody } = body;

  if (restBody.isCompleted === true) {
    restBody.completedAt = new Date();
  } else if (restBody.isCompleted === false) {
    restBody.completedAt = null;
  }

  const updateData: any = {
    ...restBody,
  };

  if (dueDate !== undefined) {
    updateData.dueDate = dueDate ? new Date(dueDate) : null;
  }

  if (subtasks) {
    updateData.subtasks = {
      deleteMany: {}, // Clean up existing subtasks and recreate
      create: subtasks.map((st: any) => ({
        title: st.title,
        isCompleted: st.isCompleted || false
      }))
    };
  }

  const task = await prisma.task.update({
    where: { id },
    data: updateData,
    include: { subtasks: true }
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
