"use client";

import { useEffect, useRef } from 'react';

interface MathJaxRendererProps {
  math: string;
  onError?: () => void;
}

declare global {
  interface Window {
    MathJax: any;
  }
}

export default function MathJaxRenderer({ math, onError }: MathJaxRendererProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    const renderMath = async () => {
      try {
        if (typeof window.MathJax === 'undefined') {
          const script = document.createElement('script');
          script.src = 'https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-svg.js';
          script.async = true;
          document.head.appendChild(script);

          await new Promise((resolve) => {
            script.onload = resolve;
          });
        }

        if (containerRef.current) {
          containerRef.current.innerHTML = math;
          await window.MathJax.typesetPromise([containerRef.current]);
        }
      } catch (error) {
        console.error('MathJax rendering error:', error);
        onError?.();
      }
    };

    renderMath();
  }, [math, onError]);

  return <div ref={containerRef} className="mathjax-container" />;
} 