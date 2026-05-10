import { QuadrantId, Task } from "@/types";
import { useDroppable } from "@dnd-kit/core";
import { TaskCard } from "./TaskCard";
import { cn } from "@/lib/utils";
import { AnimatePresence } from "framer-motion";

interface QuadrantProps {
  id: QuadrantId;
  title: string;
  description: string;
  tasks: Task[];
  colorClass: string;
  onToggleComplete: (id: string, current: boolean) => void;
  onDelete: (id: string) => void;
  onEdit: (task: Task) => void;
  onFocus?: (task: Task) => void;
  isDimmed?: boolean;
}

export function Quadrant({ id, title, description, tasks, colorClass, onToggleComplete, onDelete, onEdit, onFocus, isDimmed }: QuadrantProps) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div 
      ref={setNodeRef}
      className={cn(
        "flex flex-col h-full min-h-[300px] rounded-xl p-4 border transition-all duration-300",
        colorClass,
        isOver ? "ring-2 ring-primary ring-inset shadow-md" : "",
        isDimmed ? "opacity-30 grayscale" : "opacity-100"
      )}
    >
      <div className="mb-4">
        <h2 className="font-bold text-lg">{title}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 flex flex-col">
        <AnimatePresence>
          {tasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={task} 
              onToggleComplete={onToggleComplete}
              onDelete={onDelete}
              onEdit={onEdit}
              onFocus={onFocus}
            />
          ))}
        </AnimatePresence>
        {tasks.length === 0 && (
          <div className="flex-1 min-h-[100px] flex items-center justify-center text-sm font-medium text-muted-foreground/50 border-2 border-dashed border-current/20 rounded-lg">
            Solte tarefas aqui
          </div>
        )}
      </div>
    </div>
  );
}
