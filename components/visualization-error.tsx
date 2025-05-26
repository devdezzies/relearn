"use client";

interface VisualizationErrorProps {
  type: 'plot' | 'mermaid' | 'latex';
  message?: string;
}

export function VisualizationError({ type, message }: VisualizationErrorProps) {
  const defaultMessages = {
    plot: "Unable to render mathematical plot. Please check the function expression.",
    mermaid: "Unable to render diagram. Please check the diagram syntax.",
    latex: "Unable to render mathematical equation. Please check the LaTeX syntax."
  };

  return (
    <div className="my-4 p-4 border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 rounded-md">
      <p className="text-sm text-red-800 dark:text-red-300">
        {message || defaultMessages[type]}
      </p>
    </div>
  );
} 