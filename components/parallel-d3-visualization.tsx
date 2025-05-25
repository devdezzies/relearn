"use client";

import { useEffect, useState } from "react";
import { D3Visualization } from "./d3-visualization";

// Interface for extracted visualization information
interface ExtractedD3Visualization {
  id: string;
  code: string;
  placeholder: string;
}

// Interface for the result of extractD3Visualizations
interface ExtractD3VisualizationsResult {
  cleanContent: string;
  visualizations: ExtractedD3Visualization[];
}

/**
 * Extracts D3 visualizations from markdown content
 * @param content The markdown content to extract visualizations from
 * @returns An object containing the clean content without visualizations and the extracted visualizations
 */
export function extractD3Visualizations(content: string): ExtractD3VisualizationsResult {
  if (!content) {
    return { cleanContent: "", visualizations: [] };
  }

  const visualizations: ExtractedD3Visualization[] = [];
  
  // Regular expression to match D3 code blocks
  // This matches ```d3 ... ``` blocks
  const d3Regex = /```d3\n([\s\S]*?)```/g;
  
  // Replace each D3 code block with a placeholder
  let cleanContent = content.replace(d3Regex, (match, codeContent) => {
    const id = `d3-viz-${Math.random().toString(36).substring(2, 11)}`;
    const placeholder = `[D3VIZ:${id}]`;
    
    visualizations.push({
      id,
      code: codeContent.trim(),
      placeholder
    });
    
    return placeholder;
  });
  
  return { cleanContent, visualizations };
}

interface ParallelD3VisualizationProps {
  id: string;
  code: string;
}

/**
 * A component for rendering D3 visualizations in parallel
 * This component wraps the basic D3Visualization component with additional
 * functionality for optimized rendering
 */
export function ParallelD3Visualization({ id, code }: ParallelD3VisualizationProps) {
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Use IntersectionObserver to only render the visualization when it's visible
    // This improves performance when there are multiple visualizations on the page
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
    const element = document.getElementById(`d3-container-${id}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [id]);
  
  return (
    <div id={`d3-container-${id}`} className="my-4">
      {isVisible ? (
        <D3Visualization code={code} id={id} />
      ) : (
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-600">
          Loading visualization...
        </div>
      )}
    </div>
  );
}