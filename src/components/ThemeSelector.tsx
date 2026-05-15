"use client";

import { useEffect } from "react";
import { Button } from "./ui/button";
import { useLocalStorage } from "@/hooks/use-local-storage";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

const THEMES = [
  { id: 'default', name: 'Neutro', color: 'bg-zinc-800 dark:bg-zinc-200' },
  { id: 'theme-blue', name: 'Azul', color: 'bg-blue-500' },
  { id: 'theme-purple', name: 'Roxo', color: 'bg-purple-500' },
  { id: 'theme-green', name: 'Verde', color: 'bg-green-500' },
  { id: 'theme-orange', name: 'Laranja', color: 'bg-orange-500' },
];

export function ThemeSelector() {
  const [theme, setTheme] = useLocalStorage("app-accent-theme", "default");

  useEffect(() => {
    const root = document.documentElement;
    THEMES.forEach(t => {
      if (t.id !== 'default') root.classList.remove(t.id);
    });
    if (theme !== 'default') {
      root.classList.add(theme);
    }
  }, [theme]);

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon">
          <Palette className="h-[1.2rem] w-[1.2rem] text-primary" />
          <span className="sr-only">Escolher tema</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48 p-2" align="end">
        <div className="grid grid-cols-5 gap-2">
          {THEMES.map((t) => (
            <button
              key={t.id}
              onClick={() => setTheme(t.id)}
              className={cn(
                "h-6 w-6 rounded-full border-2 transition-all hover:scale-110",
                t.color,
                theme === t.id ? "border-foreground ring-2 ring-primary ring-offset-1" : "border-transparent"
              )}
              title={t.name}
            />
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
