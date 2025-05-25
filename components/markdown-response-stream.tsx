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

  // Extract diagrams and update the displayed text as it streams
  useEffect(() => {
    // Extract mermaid diagrams from the text
    const { cleanContent: contentWithoutDiagrams, diagrams: extractedDiagrams } = extractMermaidDiagrams(currentText);

    // Update diagrams state
    setDiagrams(extractedDiagrams);

    // Update displayed text
    setDisplayedText(contentWithoutDiagrams);
  }, [currentText]);

  // Function to render text with diagram placeholders replaced by actual diagrams
  const renderTextWithDiagrams = () => {
    // If no diagrams, just return the text
    if (diagrams.length === 0) {
      return (
        <ReactMarkdown 
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeKatex, rehypeRaw]}
          components={{
            code({ node, inline, className, children, ...props }) {
              const match = /language-(\w+)/.exec(className || '');

              // Default code rendering (no mermaid handling here)
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

    // Split content by diagram placeholders
    const parts = displayedText.split(/(\[DIAGRAM:[a-z0-9-]+\])/);

    return (
      <>
        {parts.map((part, index) => {
          // Check if this part is a diagram placeholder
          const match = part.match(/\[DIAGRAM:([a-z0-9-]+)\]/);
          if (match) {
            const diagramId = match[1];
            const diagram = diagrams.find(d => d.id === diagramId);
            if (diagram) {
              return <ParallelMermaidDiagram key={diagramId} id={diagramId} chart={diagram.chart} />;
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
                  // Default code rendering (no mermaid handling here)
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
        {renderTextWithDiagrams()}
      </div>
    </div>
  );
}
