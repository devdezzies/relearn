"use client";

import { useState, useEffect, useRef } from "react";
import { useTextStream } from "./ui/response-stream";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MermaidDiagram } from "./mermaid-diagram";
import { extractMermaidDiagrams, ParallelMermaidDiagram } from "./parallel-mermaid-diagram";
import { Button } from "./ui/button";
import { Download } from "lucide-react";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);

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

  // Function to handle downloading the message as an image
  const handleDownloadImage = async () => {
    if (!contentRef.current) return;

    setIsDownloading(true);

    try {
      // Dynamically import html2canvas
      const html2canvasModule = await import('html2canvas');
      const html2canvas = html2canvasModule.default;

      const canvas = await html2canvas(contentRef.current, {
        scale: 2, // Higher scale for better quality
        useCORS: true, // Enable CORS for images
        logging: false,
        backgroundColor: document.documentElement.classList.contains('dark') ? '#000' : '#fff'
      });

      // Convert canvas to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob as Blob);
        }, 'image/png', 1.0);
      });

      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `message-${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error generating image:', error);
      alert('Failed to download image. Please try again.');
    } finally {
      setIsDownloading(false);
    }
  };

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
      <div ref={contentRef} className="markdown-content">
        {renderTextWithDiagrams()}
      </div>
      {isComplete && (
        <div className="flex justify-end mt-4">
          <Button
            size="sm"
            variant="outline"
            className="flex items-center gap-2"
            onClick={handleDownloadImage}
            disabled={isDownloading}
          >
            {isDownloading ? (
              <>
                <span className="animate-pulse">Downloading...</span>
              </>
            ) : (
              <>
                <Download className="h-4 w-4" />
                <span>Download as Image</span>
              </>
            )}
          </Button>
        </div>
      )}
    </div>
  );
}
