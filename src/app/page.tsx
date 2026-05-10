import { TaskBoard } from "@/components/TaskBoard";
import { ModeToggle } from "@/components/ModeToggle";
import { SignInButton, Show, UserButton } from "@clerk/nextjs";
import { Button } from "@/components/ui/button";
import { AnalyticsDashboard } from "@/components/AnalyticsDashboard";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <header className="sticky top-0 z-10 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary flex items-center justify-center text-primary-foreground font-bold text-sm">
              EM
            </div>
            <h1 className="text-xl font-bold tracking-tight hidden sm:block">Matriz de Eisenhower</h1>
          </div>
          <div className="flex items-center gap-4">
            <Show when="signed-out">
              <SignInButton mode="modal">
                <Button variant="outline">Entrar</Button>
              </SignInButton>
            </Show>
            <Show when="signed-in">
              <AnalyticsDashboard />
              <UserButton />
            </Show>
            <ModeToggle />
          </div>
        </div>
      </header>

      <main className="flex-1 container mx-auto px-4 py-8">
        <Show when="signed-out">
          <div className="flex flex-col items-center justify-center h-[60vh] text-center space-y-4">
            <h2 className="text-2xl font-bold">Bem-vindo ao Eisenhower Pro</h2>
            <p className="text-muted-foreground max-w-md">
              Faça login para gerenciar suas tarefas com alta produtividade, sincronização em nuvem e métricas avançadas.
            </p>
            <SignInButton mode="modal">
              <Button size="lg">Começar Agora</Button>
            </SignInButton>
          </div>
        </Show>
        
        <Show when="signed-in">
          <TaskBoard />
        </Show>
      </main>
    </div>
  );
}
