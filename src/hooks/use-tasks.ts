import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types";

export function useTasks() {
  const queryClient = useQueryClient();

  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ['tasks'],
    queryFn: async () => {
      const res = await fetch('/api/tasks');
      if (!res.ok) {
        if (res.status === 401) return []; // Not logged in
        throw new Error('Failed to fetch tasks');
      }
      return res.json();
    }
  });

  const addTask = useMutation({
    mutationFn: async (newTask: Partial<Task>) => {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const updateTask = useMutation({
    mutationFn: async (updated: Partial<Task> & { id: string }) => {
      const res = await fetch(`/api/tasks/${updated.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      return res.json();
    },
    onMutate: async (updatedTask) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      
      if (previousTasks) {
        queryClient.setQueryData<Task[]>(['tasks'], prev => 
          prev?.map(t => t.id === updatedTask.id ? { ...t, ...updatedTask } : t)
        );
      }
      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  const deleteTask = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ['tasks'] });
      const previousTasks = queryClient.getQueryData<Task[]>(['tasks']);
      queryClient.setQueryData<Task[]>(['tasks'], prev => prev?.filter(t => t.id !== id));
      return { previousTasks };
    },
    onError: (err, newTodo, context) => {
      queryClient.setQueryData(['tasks'], context?.previousTasks);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      queryClient.invalidateQueries({ queryKey: ['analytics'] });
    }
  });

  return { tasks, isLoading, addTask, updateTask, deleteTask };
}
