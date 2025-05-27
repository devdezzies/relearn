"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";
import { FileCode2 } from "lucide-react";

// Initialize mermaid with optimized configuration
mermaid.initialize({
  startOnLoad: false, // Prevent auto-initialization
  theme: "default",
  securityLevel: "loose",
  fontFamily: "sans-serif",
  themeVariables: {
    'transition-duration': '0.3s'
  },
  logLevel: 5, // Silent mode
});

interface MermaidDiagramProps {
  chart: string;
  id?: string;
  onError?: () => void;
}

export function MermaidDiagram({ chart, id = `mermaid-${Math.random().toString(36).substring(2, 11)}`, onError }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [height, setHeight] = useState<number>(0);
  const renderAttemptRef = useRef<number>(0);
  const isMounted = useRef<boolean>(true);

  // Safe render function that doesn't throw
  const safeRender = async (darkMode = false) => {
    try {
      // Initialize with current theme
      mermaid.initialize({
        theme: darkMode ? "dark" : "default",
        logLevel: 5,
        startOnLoad: false,
        securityLevel: "loose",
        fontFamily: "sans-serif",
        themeVariables: {
          'transition-duration': '0.3s'
        }
      });

      // Basic syntax validation
      const lines = chart.trim().split('\n');
      if (!lines[0]?.trim().startsWith('graph') && 
          !lines[0]?.trim().startsWith('sequenceDiagram') && 
          !lines[0]?.trim().startsWith('classDiagram') &&
          !lines[0]?.trim().startsWith('stateDiagram') &&
          !lines[0]?.trim().startsWith('erDiagram') &&
          !lines[0]?.trim().startsWith('journey') &&
          !lines[0]?.trim().startsWith('gantt') &&
          !lines[0]?.trim().startsWith('pie')) {
        setError(true);
        onError?.();
        return;
      }

      // Use render with promise for better error handling
      const { svg: renderedSvg } = await mermaid.render(id, chart);
      
      if (isMounted.current) {
        // Set SVG first
        setSvg(renderedSvg);
        setError(false);

        // After SVG is set, measure and set the height
        setTimeout(() => {
          if (containerRef.current) {
            const newHeight = containerRef.current.offsetHeight;
            if (newHeight > 0) {
              setHeight(newHeight);
            }
          }
        }, 50);
      }
    } catch {
      // If still mounted and haven't exceeded retry limit
      if (isMounted.current && renderAttemptRef.current < 2) {
        renderAttemptRef.current += 1;
        setTimeout(() => safeRender(darkMode), 100);
      } else if (isMounted.current) {
        setError(true);
        onError?.();
      }
    }
  };

  // Initial render
  useEffect(() => {
    isMounted.current = true;
    renderAttemptRef.current = 0;
    
    if (chart) {
      const isDark = document.documentElement.classList.contains("dark");
      safeRender(isDark);
    }

    return () => {
      isMounted.current = false;
    };
  }, [chart, id]);

  // Handle theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          isMounted.current
        ) {
          const isDark = document.documentElement.classList.contains("dark");
          renderAttemptRef.current = 0;
          safeRender(isDark);
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [chart, id]);

  const containerStyle = height ? { minHeight: `${height}px` } : undefined;

  if (error) {
    return (
      <div 
        style={containerStyle}
        className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center space-y-3"
      >
        <FileCode2 className="w-8 h-8 text-gray-400 dark:text-gray-600" />
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Unable to render diagram
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      style={containerStyle}
      className="mermaid transition-opacity duration-300 relative"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  );
}