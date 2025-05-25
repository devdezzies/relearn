"use client";

import { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

interface D3VisualizationProps {
  code: string;
  id?: string;
}

export function D3Visualization({ 
  code, 
  id = `d3-${Math.random().toString(36).substring(2, 11)}` 
}: D3VisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isRendered, setIsRendered] = useState(false);

  useEffect(() => {
    if (!code || !containerRef.current) return;

    // Clear previous visualization
    const container = containerRef.current;
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }

    try {
      // Reset error state
      setError(null);
      setIsRendered(false);

      // Create a new script element
      const script = document.createElement('script');
      
      // Create a safe execution environment with D3 available
      const wrappedCode = `
        try {
          const d3Container = document.getElementById('${id}');
          ${code}
        } catch (error) {
          console.error('D3 visualization error:', error);
          document.getElementById('${id}-error').textContent = error.message;
        }
      `;
      
      script.textContent = wrappedCode;
      
      // Create an error container
      const errorContainer = document.createElement('div');
      errorContainer.id = `${id}-error`;
      errorContainer.style.display = 'none';
      errorContainer.className = 'd3-error text-red-500 text-sm mt-2';
      container.appendChild(errorContainer);
      
      // Append and execute the script
      container.appendChild(script);
      
      // Check if there was an error
      if (errorContainer.textContent) {
        setError(errorContainer.textContent);
      } else {
        setIsRendered(true);
      }
    } catch (err) {
      console.error("Error rendering D3 visualization:", err);
      setError(err instanceof Error ? err.message : "Failed to render visualization");
    }
  }, [code, id]);

  // Handle dark mode by adding a class to detect theme changes
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class" &&
          containerRef.current &&
          isRendered
        ) {
          // Force re-render when theme changes
          const container = containerRef.current;
          while (container.firstChild) {
            container.removeChild(container.firstChild);
          }
          
          // Re-run the code with the new theme
          try {
            const script = document.createElement('script');
            const isDarkMode = document.documentElement.classList.contains("dark");
            
            const wrappedCode = `
              try {
                const d3Container = document.getElementById('${id}');
                const isDarkMode = ${isDarkMode};
                ${code}
              } catch (error) {
                console.error('D3 visualization error:', error);
                document.getElementById('${id}-error').textContent = error.message;
              }
            `;
            
            script.textContent = wrappedCode;
            
            // Create an error container
            const errorContainer = document.createElement('div');
            errorContainer.id = `${id}-error`;
            errorContainer.style.display = 'none';
            errorContainer.className = 'd3-error text-red-500 text-sm mt-2';
            container.appendChild(errorContainer);
            
            // Append and execute the script
            container.appendChild(script);
            
            // Check if there was an error
            if (errorContainer.textContent) {
              setError(errorContainer.textContent);
            }
          } catch (err) {
            console.error("Error re-rendering D3 visualization:", err);
            setError(err instanceof Error ? err.message : "Failed to render visualization");
          }
        }
      });
    });

    observer.observe(document.documentElement, { attributes: true });

    return () => {
      observer.disconnect();
    };
  }, [code, id, isRendered]);

  if (error) {
    return (
      <div className="d3-error p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-300">
        {error}
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div 
      ref={containerRef}
      id={id}
      className="d3-container my-4 p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
    />
  );
}