"use client";

import { useEffect, useState } from "react";
import { MatplotlibVisualization } from "./matplotlib-visualization";

// Interface for extracted matplotlib code information
interface ExtractedMatplotlib {
  id: string;
  code: string;
  placeholder: string;
}

// Interface for the result of extractMatplotlibCode
interface ExtractMatplotlibCodeResult {
  cleanContent: string;
  matplotlibBlocks: ExtractedMatplotlib[];
}

/**
 * Extracts matplotlib code blocks from markdown content
 * @param content The markdown content to extract matplotlib code from
 * @returns An object containing the clean content without matplotlib code and the extracted code blocks
 */
export function extractMatplotlibCode(content: string): ExtractMatplotlibCodeResult {
  if (!content) {
    return { cleanContent: "", matplotlibBlocks: [] };
  }

  const matplotlibBlocks: ExtractedMatplotlib[] = [];
  
  // Regular expression to match Python code blocks that contain matplotlib
  // This matches ```python ... ``` blocks that include matplotlib or plt
  const matplotlibRegex = /```python\n([\s\S]*?(?:matplotlib|plt)[\s\S]*?)```/g;
  
  // Replace each matplotlib code block with a placeholder
  let cleanContent = content.replace(matplotlibRegex, (match, codeContent) => {
    // Only extract if it actually contains matplotlib code
    if (codeContent.includes('matplotlib') || codeContent.includes('plt')) {
      const id = `matplotlib-${Math.random().toString(36).substring(2, 11)}`;
      const placeholder = `[MATPLOTLIB:${id}]`;
      
      matplotlibBlocks.push({
        id,
        code: codeContent.trim(),
        placeholder
      });
      
      return placeholder;
    }
    
    // If it doesn't contain matplotlib, leave it as is
    return match;
  });
  
  return { cleanContent, matplotlibBlocks };
}

interface ParallelMatplotlibVisualizationProps {
  id: string;
  code: string;
}

/**
 * A component for rendering matplotlib visualizations in parallel
 * This component wraps the basic MatplotlibVisualization component with additional
 * functionality for optimized rendering
 */
export function ParallelMatplotlibVisualization({ id, code }: ParallelMatplotlibVisualizationProps) {
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
    const element = document.getElementById(`matplotlib-container-${id}`);
    if (element) {
      observer.observe(element);
    }
    
    return () => {
      observer.disconnect();
    };
  }, [id]);
  
  return (
    <div id={`matplotlib-container-${id}`} className="my-4">
      {isVisible ? (
        <MatplotlibVisualization code={code} id={id} />
      ) : (
        <div className="h-32 bg-gray-100 dark:bg-gray-800 rounded-lg animate-pulse flex items-center justify-center text-gray-400 dark:text-gray-600">
          Loading visualization...
        </div>
      )}
    </div>
  );
}