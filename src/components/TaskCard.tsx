import { Task } from "@/types";
import { useDraggable } from "@dnd-kit/core";
import { Card } from "./ui/card";
import { Button } from "./ui/button";
import { Check, Edit, Trash2, GripVertical, AlertCircle, Play, Calendar, AlignLeft, ListChecks, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { format, isPast, isToday } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TaskCardProps {
  task: Task;
  onToggleComplete: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onFocus?: (task: Task) => void;
}

export function TaskCard({ task, onToggleComplete, onDelete, onEdit, onFocus }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: task.id,
    data: task,
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  // Lógica de Estagnação no Q2 (> 3 dias)
  const isStagnant = 
    task.quadrantId === 'q2' && 
    !task.isCompleted && 
    (Date.now() - new Date(task.createdAt).getTime() > 3 * 24 * 60 * 60 * 1000);

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9 }}
      layout
    >
      <Card 
        ref={setNodeRef} 
        style={style} 
        className={cn(
          "group relative flex items-center gap-2 p-3 mb-2 shadow-sm transition-all",
          isDragging ? "opacity-50 z-50 ring-2 ring-primary" : "",
          task.isCompleted ? "opacity-60 bg-muted" : "bg-card",
          isStagnant ? "ring-2 ring-amber-500/50 animate-pulse-slow bg-amber-500/5" : ""
        )}
      >
        <div 
          {...attributes} 
          {...listeners} 
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground touch-none"
        >
          <GripVertical size={18} />
        </div>

        <div className="flex-1 min-w-0 flex flex-col">
          <p className={cn(
            "text-sm font-medium truncate",
            task.isCompleted && "line-through text-muted-foreground"
          )}>
            {task.title}
          </p>
          
          <div className="flex flex-wrap items-center gap-2 mt-1">
            {task.dueDate && (
              <span className={cn(
                "text-[10px] flex items-center gap-1",
                !task.isCompleted && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate))
                  ? "text-red-500 font-semibold"
                  : "text-muted-foreground"
              )}>
                <Calendar size={10} />
                {format(new Date(task.dueDate), "dd MMM, HH:mm", { locale: ptBR })}
              </span>
            )}
            {task.description && (
              <span className="text-muted-foreground" title="Possui descrição">
                <AlignLeft size={10} />
              </span>
            )}
            {task.subtasks && task.subtasks.length > 0 && (
              <span className="text-[10px] text-muted-foreground flex items-center gap-1">
                <ListChecks size={10} />
                {task.subtasks.filter(st => st.isCompleted).length}/{task.subtasks.length}
              </span>
            )}
          </div>
          {isStagnant && (
            <span className="text-[10px] text-amber-600 dark:text-amber-400 flex items-center gap-1 mt-0.5">
              <AlertCircle size={10} /> Parada há muito tempo
            </span>
          )}
        </div>

        <div className="flex items-center gap-1 md:opacity-0 group-hover:opacity-100 transition-opacity">
          {task.quadrantId === 'q3' && !task.isCompleted && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-amber-500 hover:text-amber-600" onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: 'Por favor, assuma esta tarefa',
                  text: `Você pode me ajudar com esta tarefa?\n\nTarefa: ${task.title}\n${task.description || ''}`,
                }).catch(console.error);
              } else {
                window.open(`mailto:?subject=Tarefa delegada: ${task.title}&body=Você pode me ajudar com a tarefa: ${task.title}?`);
              }
            }}>
              <Share2 size={14} />
            </Button>
          )}
          {task.quadrantId === 'q2' && !task.isCompleted && onFocus && (
            <Button variant="ghost" size="icon" className="h-7 w-7 text-primary hover:text-primary" onClick={() => onFocus(task)}>
              <Play size={14} />
            </Button>
          )}
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onToggleComplete(task.id, task.isCompleted)}>
            <Check size={14} className={task.isCompleted ? "text-green-500" : ""} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => onEdit(task)}>
            <Edit size={14} />
          </Button>
          <Button variant="ghost" size="icon" className="h-7 w-7 text-destructive hover:text-destructive" onClick={() => onDelete(task.id)}>
            <Trash2 size={14} />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
