import { BookOpen, Brain, Sparkles } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col gap-6 items-center max-w-4xl mx-auto px-4 py-16">
      <div className="flex items-center justify-center mb-6">
        <Brain className="h-12 w-12 text-primary mr-3" />
        <h1 className="text-5xl font-bold tracking-tight">Relearn</h1>
      </div>

      <h2 className="text-6xl font-bold tracking-tight text-center mb-6">
        Learn faster with AI
      </h2>

      <p className="text-2xl text-muted-foreground text-center max-w-2xl">
        Your AI-powered study companion for the digital age
      </p>
    </div>
  );
}
