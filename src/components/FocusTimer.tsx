"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Button } from "./ui/button";
import { Task } from "@/types";

export function FocusTimer({ task, onClose }: { task: Task | null; onClose: () => void }) {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    let interval: any = null;
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
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
    }
  }, [task]);

  if (!task) return null;

  const minutes = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const seconds = (timeLeft % 60).toString().padStart(2, '0');

  return (
    <Dialog open={!!task} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[400px] text-center">
        <DialogHeader>
          <DialogTitle className="text-center">Focando em: {task.title}</DialogTitle>
        </DialogHeader>
        <div className="py-12">
          <div className="text-7xl font-bold font-mono tracking-tighter mb-8 text-primary">
            {minutes}:{seconds}
          </div>
          <div className="flex justify-center gap-4">
            <Button onClick={() => setIsActive(!isActive)} size="lg" variant={isActive ? "outline" : "default"}>
              {isActive ? 'Pausar' : 'Iniciar'}
            </Button>
            <Button onClick={() => { setTimeLeft(25 * 60); setIsActive(false); }} size="lg" variant="secondary">
              Resetar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
