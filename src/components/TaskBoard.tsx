"use client";

import { useState, useEffect } from "react";
import { DndContext, DragEndEvent, closestCorners } from "@dnd-kit/core";
import { Task, QuadrantId } from "@/types";
import { Quadrant } from "./Quadrant";
import { TaskForm } from "./TaskForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { useTasks } from "@/hooks/use-tasks";
import confetti from "canvas-confetti";
import { FocusTimer } from "./FocusTimer";
import { Button } from "./ui/button";
import { playPopSound, playSuccessSound } from "@/lib/sounds";

const QUADRANTS = [
  { id: 'q1', title: 'Faça Agora', description: 'Urgente & Importante', colorClass: 'bg-red-500/10 border-red-500/20 text-red-950 dark:text-red-100' },
  { id: 'q2', title: 'Agende', description: 'Não Urgente & Importante', colorClass: 'bg-blue-500/10 border-blue-500/20 text-blue-950 dark:text-blue-100' },
  { id: 'q3', title: 'Delegue', description: 'Urgente & Não Importante', colorClass: 'bg-amber-500/10 border-amber-500/20 text-amber-950 dark:text-amber-100' },
  { id: 'q4', title: 'Elimine', description: 'Não Urgente & Não Importante', colorClass: 'bg-zinc-500/10 border-zinc-500/20 text-zinc-950 dark:text-zinc-100' },
] as const;

export function TaskBoard() {
  const { tasks, isLoading, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [focusTask, setFocusTask] = useState<Task | null>(null);
  
  // States for Hotkeys and Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<QuadrantId | null>(null);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingTask(null);
        setIsFormOpen(true);
      }
      if (['1', '2', '3', '4'].includes(e.key)) {
        const idx = parseInt(e.key) - 1;
        setActiveFilter(QUADRANTS[idx].id as QuadrantId);
      }
      if (e.key === 'Escape') {
        setActiveFilter(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const getQuadrantId = (isUrgent: boolean, isImportant: boolean): QuadrantId => {
    if (isUrgent && isImportant) return 'q1';
    if (!isUrgent && isImportant) return 'q2';
    if (isUrgent && !isImportant) return 'q3';
    return 'q4';
  };

  const handleSaveTask = (data: Partial<Task>) => {
    if (editingTask) {
      updateTask.mutate({ 
        ...data,
        id: editingTask.id, 
        quadrantId: getQuadrantId(data.isUrgent!, data.isImportant!) 
      });
      setEditingTask(null);
    } else {
      addTask.mutate({ 
        ...data,
        quadrantId: getQuadrantId(data.isUrgent!, data.isImportant!),
        isCompleted: false
      });
      setIsFormOpen(false);
    }
  };

  const handleToggleComplete = (id: string, current: boolean) => {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    
    // Check if Q1 will be cleared (all completed)
    if (task.quadrantId === 'q1' && !current) {
      const q1Tasks = tasks.filter(t => t.quadrantId === 'q1');
      const uncompletedQ1 = q1Tasks.filter(t => !t.isCompleted && t.id !== id);
      if (uncompletedQ1.length === 0) {
        confetti({ particleCount: 150, spread: 70, origin: { y: 0.6 } });
        playSuccessSound();
      } else {
        playPopSound();
      }
    } else if (!current) {
      playPopSound();
    }
    
    updateTask.mutate({ id, isCompleted: !current });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    const taskId = active.id as string;
    const newQuadrantId = over.id as QuadrantId;
    const task = tasks.find(t => t.id === taskId);

    if (task && task.quadrantId !== newQuadrantId) {
      playPopSound();
      const isUrgent = newQuadrantId === 'q1' || newQuadrantId === 'q3';
      const isImportant = newQuadrantId === 'q1' || newQuadrantId === 'q2';
      updateTask.mutate({ id: taskId, quadrantId: newQuadrantId, isUrgent, isImportant });
    }
  };

  if (isLoading) return <div className="flex justify-center py-20 text-muted-foreground">Carregando tarefas...</div>;

  return (
    <div className="flex flex-col gap-6 h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span className="hidden sm:inline">Pressione <kbd className="border rounded px-1">N</kbd> para nova tarefa</span>
          <span className="hidden sm:inline">| <kbd className="border rounded px-1">1-4</kbd> para focar quadrante</span>
        </div>
        <Button onClick={() => { setEditingTask(null); setIsFormOpen(true); }}>
          + Nova Tarefa
        </Button>
      </div>

      <div className="flex-1 min-h-[600px]">
        <DndContext collisionDetection={closestCorners} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
            {QUADRANTS.map(q => (
              <Quadrant 
                key={q.id}
                id={q.id as QuadrantId}
                title={q.title}
                description={q.description}
                colorClass={q.colorClass}
                isDimmed={activeFilter !== null && activeFilter !== q.id}
                tasks={tasks.filter(t => t.quadrantId === q.id)}
                onToggleComplete={handleToggleComplete}
                onDelete={(id) => deleteTask.mutate(id)}
                onEdit={setEditingTask}
                onFocus={setFocusTask}
              />
            ))}
          </div>
        </DndContext>
      </div>

      <Dialog open={isFormOpen || !!editingTask} onOpenChange={(open) => {
        if (!open) { setIsFormOpen(false); setEditingTask(null); }
      }}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{editingTask ? "Editar Tarefa" : "Nova Tarefa"}</DialogTitle>
          </DialogHeader>
          <TaskForm 
            initialTask={editingTask} 
            onSave={handleSaveTask} 
            onCancel={() => { setIsFormOpen(false); setEditingTask(null); }}
          />
        </DialogContent>
      </Dialog>
      
      <FocusTimer task={focusTask} onClose={() => setFocusTask(null)} />
    </div>
  );
}
