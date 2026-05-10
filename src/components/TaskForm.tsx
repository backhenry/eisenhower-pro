"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Task } from "@/types";

interface TaskFormProps {
  initialTask?: Task | null;
  onSave: (title: string, isUrgent: boolean, isImportant: boolean) => void;
  onCancel?: () => void;
}

export function TaskForm({ initialTask, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [isUrgent, setIsUrgent] = useState(initialTask?.isUrgent || false);
  const [isImportant, setIsImportant] = useState(initialTask?.isImportant || false);

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setIsUrgent(initialTask.isUrgent);
      setIsImportant(initialTask.isImportant);
    } else {
      setTitle("");
      setIsUrgent(false);
      setIsImportant(false);
    }
  }, [initialTask]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave(title.trim(), isUrgent, isImportant);
    if (!initialTask) {
      setTitle("");
      setIsUrgent(false);
      setIsImportant(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="title">Nome da Tarefa</Label>
        <Input 
          id="title" 
          placeholder="Ex: Pagar contas" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          autoFocus
        />
      </div>
      
      <div className="flex gap-4">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="urgent" 
            checked={isUrgent} 
            onCheckedChange={(checked) => setIsUrgent(checked as boolean)} 
          />
          <Label htmlFor="urgent" className="cursor-pointer">Urgente</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="important" 
            checked={isImportant} 
            onCheckedChange={(checked) => setIsImportant(checked as boolean)} 
          />
          <Label htmlFor="important" className="cursor-pointer">Importante</Label>
        </div>
      </div>

      <div className="flex gap-2 justify-end pt-2">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit" disabled={!title.trim()}>
          {initialTask ? "Salvar" : "Adicionar Tarefa"}
        </Button>
      </div>
    </form>
  );
}
