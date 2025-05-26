"use client";

import { Button } from "@/components/ui/button";

export function DemoSection() {
  return (
    <Button 
      variant="outline" 
      className="w-full sm:w-auto text-lg px-8 py-6 border-2"
      onClick={() => {
        const demoSection = document.getElementById('demo');
        demoSection?.scrollIntoView({ behavior: 'smooth' });
      }}
    >
      See Examples
    </Button>
  );
} 