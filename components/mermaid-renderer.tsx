"use client";

import { useEffect, useRef } from 'react';
import mermaid from 'mermaid';

interface MermaidRendererProps {
  chart: string;
  onError?: () => void;
}

export default function MermaidRenderer({ chart, onError }: MermaidRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderChart = async () => {
      try {
        mermaid.initialize({
          startOnLoad: true,
          theme: 'default',
          securityLevel: 'loose',
        });
        
        const { svg } = await mermaid.render('mermaid-chart', chart);
        if (containerRef.current) {
          containerRef.current.innerHTML = svg;
        }
      } catch (error) {
        console.error('Mermaid rendering error:', error);
        onError?.();
      }
    };

    renderChart();
  }, [chart, onError]);

  return <div ref={containerRef} className="mermaid-container" />;
} 