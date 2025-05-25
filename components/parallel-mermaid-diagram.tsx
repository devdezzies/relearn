"use client";

import { useEffect, useState } from "react";
import { MermaidDiagram } from "./mermaid-diagram";

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
  
  useEffect(() => {
    // Use IntersectionObserver to only render the diagram when it's visible
    // This improves performance when there are multiple diagrams on the page
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        });
      },
      { threshold: 0.1 } // Start rendering when 10% of the element is visible
    );
    
    // Get the element by ID
    const element = document.getElementById(`diagram-container-${id}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [id]);
  
  return (
    <div id={`diagram-container-${id}`} className="my-4">
      {isVisible ? (
        <MermaidDiagram chart={chart} id={id} />
      ) : (
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-600">
          Loading diagram...
        </div>
      )}
    </div>
  );
}