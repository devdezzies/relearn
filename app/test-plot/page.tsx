"use client";

import { MathPlot } from "@/components/math-plot";

export default function TestPlot() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Simple Quadratic Function</h1>
      <MathPlot
        expression="x^2"
        title="Quadratic Function"
        xRange={[-5, 5]}
        yRange={[0, 25]}
      />
      <p className="mt-4">This plot shows a simple quadratic function y = x².</p>
    </div>
  );
} 