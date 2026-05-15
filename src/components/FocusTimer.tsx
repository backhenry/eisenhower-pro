"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogPortal, DialogOverlay } from "./ui/dialog";
import { Button } from "./ui/button";
import { Task } from "@/types";
import { useTasks } from "@/hooks/use-tasks";
import { Maximize2, Minimize2, X } from "lucide-react";

export function FocusTimer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [timeSpentSession, setTimeSpentSession] = useState(0);
  const { updateTask } = useTasks();

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((t) => t - 1);
        setTimeSpentSession((t) => t + 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
    }
    return () => clearInterval(interval);
  }, [isActive, timeLeft]);

  // Reset timer when a new task is selected
  useEffect(() => {
    if (task) {
      setTimeLeft(25 * 60);
      setIsActive(false);
      setTimeSpentSession(0);
    }
  }, [task]);

  const handleClose = () => {
    if (task && timeSpentSession > 0) {
      updateTask.mutate({ id: task.id, timeSpent: (task.timeSpent || 0) + timeSpentSession });
    }
    onClose();
  };

  if (!task) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && handleClose()}>
      <DialogPortal>
        <DialogOverlay className="bg-background/95 backdrop-blur-md z-50" />
        <DialogContent className="max-w-none w-screen h-screen flex flex-col items-center justify-center m-0 p-0 rounded-none border-none shadow-none z-50 bg-transparent">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute top-6 right-6 h-12 w-12 rounded-full bg-muted/50 hover:bg-muted text-muted-foreground"
            onClick={handleClose}
          >
            <X size={24} />
          </Button>

          <div className="flex flex-col items-center max-w-2xl text-center space-y-12 animate-in fade-in zoom-in duration-500">
            <div className="space-y-4">
              <span className="text-xl font-medium text-muted-foreground uppercase tracking-widest">Modo Foco</span>
              <DialogTitle className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                {task.title}
              </DialogTitle>
            </div>
            
            <div className="text-[8rem] md:text-[12rem] font-bold font-mono tracking-tighter text-primary drop-shadow-sm transition-all duration-300">
              {minutes}:{seconds}
            </div>
            
            <div className="flex justify-center gap-6">
              <Button 
                onClick={() => setIsActive(!isActive)} 
                size="lg" 
                className="h-16 px-12 text-xl rounded-full shadow-lg hover:scale-105 transition-transform"
                variant={isActive ? "secondary" : "default"}
              >
                {isActive ? 'Pausar Foco' : 'Iniciar Foco'}
              </Button>
              <Button 
                onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }} 
                size="lg" 
                variant="outline"
                className="h-16 px-8 rounded-full"
              >
                Resetar
              </Button>
            </div>
            
            <div className="pt-12 text-muted-foreground animate-pulse">
              Tempo investido nesta sessão: {Math.floor(timeSpentSession / 60)}m {timeSpentSession % 60}s
            </div>
          </div>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  );
}
