"use client";

import { useQuery } from "@tanstack/react-query";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Button } from "./ui/button";
import { BarChart2, CheckCircle2, Clock } from "lucide-react";

export function AnalyticsDashboard() {
  const { data, isLoading } = useQuery({
    queryKey: ['analytics'],
    queryFn: async () => {
      const res = await fetch('/api/analytics');
      if (!res.ok) throw new Error('Failed to fetch metrics');
      return res.json();
    }
  });

  const COLORS = ['#ef4444', '#3b82f6', '#f59e0b', '#71717a'];

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="relative" />}>
        <BarChart2 className="w-5 h-5" />
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Métricas de Produtividade</DialogTitle>
        </DialogHeader>

        {isLoading || !data ? (
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Carregando...
          </div>
        ) : (
          <div className="space-y-6 pt-4">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
                <CheckCircle2 className="w-8 h-8 text-green-500 mb-2" />
                <span className="text-2xl font-bold">{data.completionRate}%</span>
                <span className="text-xs text-muted-foreground">Conclusão (7 dias)</span>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center">
                <Clock className="w-8 h-8 text-blue-500 mb-2" />
                <span className="text-2xl font-bold">{data.avgLifetimeDays}d</span>
                <span className="text-xs text-muted-foreground">Tempo Médio Q2</span>
              </div>
              <div className="p-4 border rounded-lg bg-muted/50 flex flex-col items-center justify-center text-center col-span-2 md:col-span-1">
                <BarChart2 className="w-8 h-8 text-primary mb-2" />
                <span className="text-2xl font-bold">{data.totalCompleted}</span>
                <span className="text-xs text-muted-foreground">Total Concluídas</span>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-4">Distribuição de Tarefas Ativas</h3>
              <div className="h-48 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={data.distribution} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                    <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                    <YAxis fontSize={12} tickLine={false} axisLine={false} />
                    <Tooltip cursor={{fill: 'transparent'}} />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.distribution.map((entry: any, index: number) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
