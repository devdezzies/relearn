"use client";

import { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Data, Layout, Config } from 'plotly.js';

// Dynamically import Plotly to avoid SSR issues
const Plot = dynamic(() => import('react-plotly.js'), { ssr: false });

export interface MathPlotProps {
  expression: string;
  title?: string;
  xRange?: [number, number];
  yRange?: [number, number];
  color?: string;
}

export function MathPlot({
  expression,
  title = '',
  xRange = [-10, 10],
  yRange = [-10, 10],
  color = 'rgb(55, 128, 191)'
}: MathPlotProps) {
  // Function to evaluate a mathematical expression
  const evaluateExpression = (expr: string, x: number): number => {
    // Replace mathematical expressions with JavaScript equivalents
    const jsExpr = expr
      .replace(/\^/g, '**')
      .replace(/sin/g, 'Math.sin')
      .replace(/cos/g, 'Math.cos')
      .replace(/tan/g, 'Math.tan')
      .replace(/sqrt/g, 'Math.sqrt')
      .replace(/pi/g, 'Math.PI')
      .replace(/e/g, 'Math.E');

    try {
      // Create a function from the expression
      return new Function('x', `return ${jsExpr}`)(x);
    } catch (error) {
      console.error('Error evaluating expression:', error);
      return NaN;
    }
  };

  // Generate plot data
  const generatePlotData = (): Data[] => {
    const samples = 200;
    const [min, max] = xRange;
    const step = (max - min) / (samples - 1);
    
    const x = Array.from({ length: samples }, (_, i) => min + i * step);
    const y = x.map(xVal => evaluateExpression(expression, xVal));

    return [{
      type: 'scatter',
      mode: 'lines',
      x,
      y,
      name: expression,
      line: { color }
    }];
  };

  const layout: Partial<Layout> = {
    title: {
      text: title,
      font: { size: 16 }
    },
    xaxis: {
      title: { text: 'x' },
      range: xRange,
      zeroline: true,
      gridcolor: 'rgba(128, 128, 128, 0.2)',
      zerolinecolor: 'rgba(128, 128, 128, 0.5)'
    },
    yaxis: {
      title: { text: 'y' },
      range: yRange,
      zeroline: true,
      gridcolor: 'rgba(128, 128, 128, 0.2)',
      zerolinecolor: 'rgba(128, 128, 128, 0.5)'
    },
    showlegend: false,
    plot_bgcolor: 'rgba(0,0,0,0)',
    paper_bgcolor: 'rgba(0,0,0,0)',
    margin: { l: 50, r: 50, t: 50, b: 50 },
    font: { color: 'currentColor' }
  };

  const config: Partial<Config> = {
    displayModeBar: true,
    responsive: true,
    displaylogo: false
  };

  return (
    <div className="w-full h-[400px] my-4">
      <Plot
        data={generatePlotData()}
        layout={layout}
        config={config}
        style={{ width: '100%', height: '100%' }}
      />
    </div>
  );
} 