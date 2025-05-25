"use client";

import { useEffect, useRef, useState } from "react";

interface MatplotlibVisualizationProps {
  code: string;
  id?: string;
}

export function MatplotlibVisualization({ 
  code, 
  id = `matplotlib-${Math.random().toString(36).substring(2, 11)}` 
}: MatplotlibVisualizationProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageUrl, setImageUrl] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const renderVisualization = async () => {
      if (!code) return;

      try {
        setIsLoading(true);
        setError(null);

        // In a production environment, you would send the code to a backend service
        // that executes the Python code and returns an image URL.
        // For this example, we'll use a mock API endpoint.

        // Mock API call - in a real implementation, this would be a fetch to your backend
        // that executes the matplotlib code and returns an image
        const response = await fetch('/api/matplotlib', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error(`Failed to generate visualization: ${response.statusText}`);
        }

        const data = await response.json();
        setImageUrl(data.imageUrl);
        setIsLoading(false);
      } catch (err) {
        console.error("Error rendering matplotlib visualization:", err);
        setError("Failed to render visualization. Please check your code.");
        setIsLoading(false);
      }
    };

    // Call the API to render the visualization
    renderVisualization();
  }, [code]);

  if (isLoading) {
    return (
      <div className="matplotlib-loading p-4 border border-gray-300 bg-gray-50 dark:bg-gray-800/50 dark:border-gray-700 rounded-md text-sm text-gray-600 dark:text-gray-300 my-4">
        <div className="flex items-center space-x-2">
          <div className="w-5 h-5 border-2 border-t-blue-500 border-r-transparent border-b-transparent border-l-transparent rounded-full animate-spin"></div>
          <span>Generating visualization...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="matplotlib-error p-3 border border-red-300 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-md text-sm text-red-800 dark:text-red-300 my-4">
        {error}
        <pre className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded overflow-x-auto">
          {code}
        </pre>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="matplotlib-visualization my-4">
      <div className="border border-gray-200 dark:border-gray-800 rounded-md overflow-hidden">
        <img 
          src={imageUrl} 
          alt="Matplotlib visualization" 
          className="w-full max-w-full h-auto"
          onError={() => setError("Failed to load visualization image.")}
        />
      </div>
      <details className="mt-2">
        <summary className="text-sm text-gray-500 dark:text-gray-400 cursor-pointer hover:text-gray-700 dark:hover:text-gray-300">
          View Code
        </summary>
        <pre className="mt-2 p-3 bg-gray-100 dark:bg-gray-800 rounded-md overflow-x-auto text-sm">
          <code>{code}</code>
        </pre>
      </details>
    </div>
  );
}
