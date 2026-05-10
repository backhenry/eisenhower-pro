import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { subDays } from 'date-fns';

export async function GET() {
  const { userId } = await auth();
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const tasks = await prisma.task.findMany({ where: { userId } });

  // 1. Quadrant Distribution (Active tasks only)
  const activeTasks = tasks.filter(t => !t.isCompleted);
  const distribution = [
    { name: 'Q1', value: activeTasks.filter(t => t.quadrantId === 'q1').length },
    { name: 'Q2', value: activeTasks.filter(t => t.quadrantId === 'q2').length },
    { name: 'Q3', value: activeTasks.filter(t => t.quadrantId === 'q3').length },
    { name: 'Q4', value: activeTasks.filter(t => t.quadrantId === 'q4').length },
  ];

  // 2. Weekly Completion Rate
  const oneWeekAgo = subDays(new Date(), 7);
  const tasksCreatedThisWeek = tasks.filter(t => t.createdAt >= oneWeekAgo).length;
  const tasksCompletedThisWeek = tasks.filter(t => t.isCompleted && t.completedAt && t.completedAt >= oneWeekAgo).length;
  
  const completionRate = tasksCreatedThisWeek === 0 
    ? 0 
    : Math.round((tasksCompletedThisWeek / tasksCreatedThisWeek) * 100);

  // 3. Q2 Task Lifetime
  const completedQ2Tasks = tasks.filter(t => t.isCompleted && t.quadrantId === 'q2' && t.completedAt);
  const avgLifetimeMs = completedQ2Tasks.length > 0
    ? completedQ2Tasks.reduce((acc, t) => acc + (t.completedAt!.getTime() - t.createdAt.getTime()), 0) / completedQ2Tasks.length
    : 0;
    
  const avgLifetimeDays = Math.round(avgLifetimeMs / (1000 * 60 * 60 * 24));

  return NextResponse.json({
    distribution,
    completionRate,
    avgLifetimeDays,
    totalActive: activeTasks.length,
    totalCompleted: tasks.filter(t => t.isCompleted).length
  });
}
