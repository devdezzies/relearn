"use client";

import { useState, useEffect } from "react";
import { Button } from "./button";

interface AlertDialogProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  message: string;
}

export function AlertDialog({ isOpen, onClose, title = "Notice", message }: AlertDialogProps) {
  const [isVisible, setIsVisible] = useState(isOpen);

  useEffect(() => {
    setIsVisible(isOpen);
  }, [isOpen]);

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 transition-opacity" 
        onClick={onClose}
      />

      {/* Dialog */}
      <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-lg w-full max-w-md p-6 overflow-hidden transform transition-all">
        <div className="mb-4">
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">
            {title}
          </h3>
          <div className="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {message.includes('http') ? (
              <div>
                <p>{message.split('http')[0]}</p>
                <div className="mt-2 p-2 bg-gray-100 dark:bg-gray-800 rounded border border-gray-200 dark:border-gray-700 font-mono text-xs break-all select-all">
                  {message.split('http')[0] ? 'http' : ''}{message.split('http')[1]}
                </div>
              </div>
            ) : (
              <p>{message}</p>
            )}
          </div>
        </div>
        <div className="mt-6 flex justify-end">
          <Button 
            onClick={onClose}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            OK
          </Button>
        </div>
      </div>
    </div>
  );
}
