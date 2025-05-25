"use client";

import { useState, useEffect } from "react";
import { useTextStream } from "./ui/response-stream";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MermaidDiagram } from "./mermaid-diagram";
import { extractMermaidDiagrams, ParallelMermaidDiagram } from "./parallel-mermaid-diagram";
import { extractMatplotlibCode, ParallelMatplotlibVisualization } from "./parallel-matplotlib-visualization";

interface MarkdownResponseStreamProps {
  textStream: string;
  mode?: "typewriter" | "fade";
  speed?: number;
  onStreamStart?: () => void;
  onStreamComplete?: () => void;
}

export function MarkdownResponseStream({
  textStream,
  mode = "fade",
  speed = 80,
  onStreamStart,
  onStreamComplete,
}: MarkdownResponseStreamProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [diagrams, setDiagrams] = useState<{ id: string; chart: string; placeholder: string }[]>([]);
  const [matplotlibBlocks, setMatplotlibBlocks] = useState<{ id: string; code: string; placeholder: string }[]>([]);

  // Use the useTextStream hook to get the current text as it streams
  const { displayedText: currentText, isComplete } = useTextStream({
    textStream,
    speed,
    mode,
    // We'll handle onComplete ourselves to ensure features are enabled immediately
    // when the text is fully displayed
  });

  // Call onStreamStart when the component mounts
  useEffect(() => {
    if (onStreamStart && speed > 0) {
      onStreamStart();
    }
  }, [onStreamStart, speed]);

  // Call onStreamComplete when isComplete becomes true
  useEffect(() => {
    if (isComplete && onStreamComplete) {
      onStreamComplete();
    }
  }, [isComplete, onStreamComplete]);

  // Extract diagrams and matplotlib code blocks and update the displayed text as it streams
  useEffect(() => {
    // First, extract matplotlib code blocks
    const { cleanContent: contentWithoutMatplotlib, matplotlibBlocks: extractedMatplotlib } = extractMatplotlibCode(currentText);

    // Then, extract mermaid diagrams from the remaining text
    const { cleanContent: finalCleanContent, diagrams: extractedDiagrams } = extractMermaidDiagrams(contentWithoutMatplotlib);

    // Update states
    setMatplotlibBlocks(extractedMatplotlib);
    setDiagrams(extractedDiagrams);

    // Update displayed text with all visualizations removed
    setDisplayedText(finalCleanContent);
  }, [currentText]);

  // Function to render text with diagram and matplotlib placeholders replaced by actual visualizations
  const renderTextWithVisualizations = () => {
    // If no diagrams or matplotlib blocks, just return the text
    if (diagrams.length === 0 && matplotlibBlocks.length === 0) {
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');

              // Default code rendering (no special handling here)
              return (
                <code className={className} {...props}>
                  {children}
                </code>
              );
            }
          }}
        >
          {displayedText}
        </ReactMarkdown>
      );
    }

    // Create a combined regex pattern to match both diagram and matplotlib placeholders
    const placeholderPattern = /(\[DIAGRAM:[a-z0-9-]+\]|\[MATPLOTLIB:[a-z0-9-]+\])/;

    // Split content by all placeholders
    const parts = displayedText.split(placeholderPattern);

    return (
      <>
        {parts.map((part, index) => {
          // Check if this part is a diagram placeholder
          const diagramMatch = part.match(/\[DIAGRAM:([a-z0-9-]+)\]/);
          if (diagramMatch) {
            const diagramId = diagramMatch[1];
            const diagram = diagrams.find(d => d.id === diagramId);
            if (diagram) {
              return <ParallelMermaidDiagram key={diagramId} id={diagramId} chart={diagram.chart} />;
            }
          }

          // Check if this part is a matplotlib placeholder
          const matplotlibMatch = part.match(/\[MATPLOTLIB:([a-z0-9-]+)\]/);
          if (matplotlibMatch) {
            const matplotlibId = matplotlibMatch[1];
            const matplotlib = matplotlibBlocks.find(m => m.id === matplotlibId);
            if (matplotlib) {
              return <ParallelMatplotlibVisualization key={matplotlibId} id={matplotlibId} code={matplotlib.code} />;
            }
          }

          // Regular text part - render with ReactMarkdown
          return (
            <ReactMarkdown 
              key={index}
              remarkPlugins={[remarkGfm, remarkMath]}
              rehypePlugins={[rehypeKatex, rehypeRaw]}
              components={{
                code({ node, inline, className, children, ...props }) {
                  // Default code rendering (no special handling here)
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                }
              }}
            >
              {part}
            </ReactMarkdown>
          );
        })}
      </>
    );
  };

  return (
    <div className="w-full min-w-full">
      <div className="markdown-content">
        {renderTextWithVisualizations()}
      </div>
    </div>
  );
}
