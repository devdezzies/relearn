"use client";

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { VisualizationError } from './visualization-error';
import { generatePlotPoints } from '@/utils/math-utils';

// Dynamically import visualization components
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });
const Mermaid = dynamic(() => import('./mermaid-renderer'), { ssr: false });
const MathJax = dynamic(() => import('./mathjax-renderer'), { ssr: false });

interface VisualizationRendererProps {
  type: 'plot' | 'mermaid' | 'latex';
  content: string;
  config?: any;
}

export function VisualizationRenderer({ type, content, config }: VisualizationRendererProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return <VisualizationError type={type} />;
  }

  try {
    switch (type) {
      case 'plot':
        const plotData = JSON.parse(content);
        const { x, y } = generatePlotPoints(
          plotData.expression,
          plotData.xRange || [-10, 10]
        );

        return (
          <div className="w-full h-[400px] my-4">
            <Plot
              data={[{
                type: 'scatter',
                mode: 'lines',
                x: x,
                y: y,
                line: { color: plotData.color || 'rgb(55, 128, 191)' },
                name: plotData.expression
              }]}
              layout={{
                title: plotData.title,
                xaxis: { 
                  range: plotData.xRange,
                  title: 'x',
                  zeroline: true,
                  showgrid: true,
                  gridcolor: 'rgba(128, 128, 128, 0.2)',
                  zerolinecolor: 'rgba(128, 128, 128, 0.5)'
                },
                yaxis: { 
                  range: plotData.yRange,
                  title: 'y',
                  zeroline: true,
                  showgrid: true,
                  gridcolor: 'rgba(128, 128, 128, 0.2)',
                  zerolinecolor: 'rgba(128, 128, 128, 0.5)'
                },
                showlegend: true,
                plot_bgcolor: 'rgba(0,0,0,0)',
                paper_bgcolor: 'rgba(0,0,0,0)',
                font: {
                  color: 'currentColor'
                },
                ...plotData.layout
              }}
              config={{
                responsive: true,
                displayModeBar: true,
                displaylogo: false,
                ...config
              }}
              onError={() => setHasError(true)}
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        );

      case 'mermaid':
        return (
          <div className="my-4">
            <Mermaid
              chart={content}
              onError={() => setHasError(true)}
            />
          </div>
        );

      case 'latex':
        return (
          <div className="my-4">
            <MathJax
              math={content}
              onError={() => setHasError(true)}
            />
          </div>
        );

      default:
        return <VisualizationError type="plot" message="Unsupported visualization type" />;
    }
  } catch (error) {
    console.error(`Error rendering ${type} visualization:`, error);
    return <VisualizationError type={type} />;
  }
} 