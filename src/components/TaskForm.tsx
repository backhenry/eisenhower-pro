"use client";

import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Checkbox } from "./ui/checkbox";
import { Textarea } from "./ui/textarea";
import { Task, Subtask } from "@/types";
import { Plus, X } from "lucide-react";

interface TaskFormProps {
  initialTask?: Task | null;
  onSave: (data: Partial<Task>) => void;
  onCancel?: () => void;
}

export function TaskForm({ initialTask, onSave, onCancel }: TaskFormProps) {
  const [title, setTitle] = useState(initialTask?.title || "");
  const [description, setDescription] = useState(initialTask?.description || "");
  const [dueDate, setDueDate] = useState(initialTask?.dueDate ? new Date(initialTask.dueDate).toISOString().slice(0, 16) : "");
  const [isUrgent, setIsUrgent] = useState(initialTask?.isUrgent || false);
  const [isImportant, setIsImportant] = useState(initialTask?.isImportant || false);
  const [subtasks, setSubtasks] = useState<Subtask[]>(initialTask?.subtasks || []);
  const [newSubtask, setNewSubtask] = useState("");

  useEffect(() => {
    if (initialTask) {
      setTitle(initialTask.title);
      setDescription(initialTask.description || "");
      setDueDate(initialTask.dueDate ? new Date(initialTask.dueDate).toISOString().slice(0, 16) : "");
      setIsUrgent(initialTask.isUrgent);
      setIsImportant(initialTask.isImportant);
      setSubtasks(initialTask.subtasks || []);
    } else {
      resetForm();
    }
  }, [initialTask]);

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setDueDate("");
    setIsUrgent(false);
    setIsImportant(false);
    setSubtasks([]);
    setNewSubtask("");
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setTitle(val);
    
    // Auto-classification heuristic
    if (!initialTask) {
      const lower = val.toLowerCase();
      if (lower.includes("urgente") || lower.includes("hoje") || lower.includes("prazo") || lower.includes("asap")) {
        setIsUrgent(true);
      }
      if (lower.includes("importante") || lower.includes("chefe") || lower.includes("projeto")) {
        setIsImportant(true);
      }
    }
  };

  const handleAddSubtask = (e: React.KeyboardEvent | React.MouseEvent) => {
    if ((e.type === 'click' || (e as React.KeyboardEvent).key === 'Enter') && newSubtask.trim()) {
      e.preventDefault();
      setSubtasks([...subtasks, { title: newSubtask.trim(), isCompleted: false }]);
      setNewSubtask("");
    }
  };

  const removeSubtask = (index: number) => {
    setSubtasks(subtasks.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSave({
      title: title.trim(),
      description: description.trim() || null,
      dueDate: dueDate || null,
      isUrgent,
      isImportant,
      subtasks
    });
    if (!initialTask) resetForm();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-h-[80vh] overflow-y-auto p-1">
      <div className="space-y-2">
        <Label htmlFor="title">Nome da Tarefa</Label>
        <Input 
          id="title" 
          placeholder="Ex: Pagar contas urgentes" 
          value={title}
          onChange={handleTitleChange}
          autoFocus
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Descrição</Label>
        <Textarea 
          id="description" 
          placeholder="Detalhes ou anotações (opcional)" 
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="resize-none"
          rows={2}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="dueDate">Prazo (opcional)</Label>
        <Input 
          id="dueDate" 
          type="datetime-local"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Subtarefas</Label>
        <div className="flex gap-2">
          <Input 
            value={newSubtask}
            onChange={(e) => setNewSubtask(e.target.value)}
            onKeyDown={handleAddSubtask}
            placeholder="Nova subtarefa..."
          />
          <Button type="button" size="icon" variant="secondary" onClick={handleAddSubtask}>
            <Plus size={16} />
          </Button>
        </div>
        {subtasks.length > 0 && (
          <ul className="space-y-2 mt-2 bg-muted/30 p-2 rounded-md">
            {subtasks.map((st, i) => (
              <li key={i} className="flex justify-between items-center text-sm bg-background p-2 rounded border">
                <span className="truncate">{st.title}</span>
                <Button type="button" size="icon" variant="ghost" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => removeSubtask(i)}>
                  <X size={14} />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
      
      <div className="flex gap-4 p-2 bg-muted/50 rounded-lg">
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="urgent" 
            checked={isUrgent} 
            onCheckedChange={(checked) => setIsUrgent(checked as boolean)} 
          />
          <Label htmlFor="urgent" className="cursor-pointer font-medium">Urgente</Label>
        </div>
        
        <div className="flex items-center space-x-2">
          <Checkbox 
            id="important" 
            checked={isImportant} 
            onCheckedChange={(checked) => setIsImportant(checked as boolean)} 
          />
          <Label htmlFor="important" className="cursor-pointer font-medium">Importante</Label>
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
