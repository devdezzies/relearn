"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

// Initialize mermaid with default configuration
mermaid.initialize({
  startOnLoad: true,
  theme: "default",
  securityLevel: "loose",
  fontFamily: "sans-serif",
});

interface MermaidDiagramProps {
  chart: string;
  id?: string;
}

export function MermaidDiagram({ chart, id = `mermaid-${Math.random().toString(36).substring(2, 11)}` }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const renderDiagram = async () => {
      if (!chart) return;
      
      try {
        // Reset error state
        setError(null);
        
        // Render the diagram
        const { svg } = await mermaid.render(id, chart);
        setSvg(svg);
      } catch (err) {
        console.error("Error rendering Mermaid diagram:", err);
        setError("Failed to render diagram. Please check your syntax.");
      }
    };

    renderDiagram();
  }, [chart, id]);

  // Handle dark mode by adding a class to detect theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          document.documentElement.classList.contains("dark")
        ) {
          // Re-render diagram when theme changes
          mermaid.initialize({
            theme: document.documentElement.classList.contains("dark") ? "dark" : "default",
          });
          
          // Force re-render by updating the state
          setSvg("");
          setTimeout(() => {
            mermaid.render(id, chart).then(({ svg }) => {
              setSvg(svg);
            }).catch(err => {
              console.error("Error re-rendering diagram:", err);
              setError("Failed to render diagram. Please check your syntax.");
            });
          }, 0);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [chart, id]);

  if (error) {
    return (
      <div className="mermaid-error p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-300">
        {error}
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
          {chart}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      className="mermaid"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}