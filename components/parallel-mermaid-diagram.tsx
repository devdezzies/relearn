"use client";

import { useEffect, useState, useRef } from "react";
import { MermaidDiagram } from "./mermaid-diagram";
import { FileCode2 } from "lucide-react";

// Interface for extracted diagram information
interface ExtractedDiagram {
  id: string;
  chart: string;
  placeholder: string;
}

// Interface for the result of extractMermaidDiagrams
interface ExtractMermaidDiagramsResult {
  cleanContent: string;
  diagrams: ExtractedDiagram[];
}

/**
 * Extracts Mermaid diagrams from markdown content
 * @param content The markdown content to extract diagrams from
 * @returns An object containing the clean content without diagrams and the extracted diagrams
 */
export function extractMermaidDiagrams(content: string): ExtractMermaidDiagramsResult {
  if (!content) {
    return { cleanContent: "", diagrams: [] };
  }

  const diagrams: ExtractedDiagram[] = [];
  
  // Regular expression to match Mermaid code blocks
  // This matches ```mermaid ... ``` blocks
  const mermaidRegex = /```mermaid\n([\s\S]*?)```/g;
  
  // Replace each Mermaid code block with a placeholder
  let cleanContent = content.replace(mermaidRegex, (match, chartContent) => {
    const id = `diagram-${Math.random().toString(36).substring(2, 11)}`;
    const placeholder = `[DIAGRAM:${id}]`;
    
    diagrams.push({
      id,
      chart: chartContent.trim(),
      placeholder
    });
    
    return placeholder;
  });
  
  return { cleanContent, diagrams };
}

interface ParallelMermaidDiagramProps {
  id: string;
  chart: string;
}

/**
 * A component for rendering Mermaid diagrams in parallel
 * This component wraps the basic MermaidDiagram component with additional
 * functionality for optimized rendering
 */
export function ParallelMermaidDiagram({ id, chart }: ParallelMermaidDiagramProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [height, setHeight] = useState<number>(0);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const isMounted = useRef<boolean>(true);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    isMounted.current = true;

    // Cleanup function
    return () => {
      isMounted.current = false;
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);
  
  useEffect(() => {
    // Only set up observer if component is mounted and we have a valid chart
    if (!isMounted.current || !chart) return;

    // Clean up previous observer
    if (observerRef.current) {
      observerRef.current.disconnect();
    }
    
    // Set up new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && isMounted.current) {
            // Add a small delay to ensure smooth transition
            setTimeout(() => {
              if (isMounted.current) {
                setIsVisible(true);
              }
            }, 100);
            observerRef.current?.disconnect();
          }
        });
      },
      { threshold: 0.1 } // Start rendering when 10% of the element is visible
    );
    
    // Get the element by ID
    const element = document.getElementById(`diagram-container-${id}`);
    if (element) {
      observerRef.current.observe(element);
    }
  }, [chart, id]);

  const handleError = () => {
    if (isMounted.current) {
      setHasError(true);
    }
  };

  // Handle height updates from the Mermaid diagram
  const handleHeightChange = (newHeight: number) => {
    if (isMounted.current && newHeight > 0) {
      setHeight(newHeight);
    }
  };

  const containerStyle = height ? { minHeight: `${height}px` } : { minHeight: '8rem' };
  
  if (hasError) {
    return (
      <div className="my-4">
        <div 
          style={containerStyle}
          className="flex flex-col items-center justify-center p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-center space-y-3"
        >
          <FileCode2 className="w-8 h-8 text-gray-400 dark:text-gray-600" />
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Unable to render diagram
          </div>
        </div>
      </div>
    );
  }
  
  return (
    <div 
      id={`diagram-container-${id}`} 
      ref={containerRef}
      className="my-4 relative"
      style={containerStyle}
    >
      {/* Loading placeholder - shown until diagram is ready */}
      <div 
        className={`absolute inset-0 bg-gray-50 dark:bg-gray-900 rounded-lg flex items-center justify-center text-gray-400 dark:text-gray-600 transition-opacity duration-300 ${
          isVisible ? 'opacity-0 pointer-events-none' : 'opacity-100'
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div className="w-6 h-6 border-2 border-current border-t-transparent rounded-full animate-spin" />
          <span className="text-sm">Drawing diagram...</span>
        </div>
      </div>
      
      {/* Actual diagram - pre-rendered but initially hidden */}
      <div 
        className={`transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
      >
        <MermaidDiagram 
          chart={chart} 
          id={id} 
          onError={handleError}
        />
      </div>
    </div>
  );
}