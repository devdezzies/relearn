"use client";

import { Button } from "../ui/button";

interface MessageSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    text: "Explain neural networks with a simple animation",
    emoji: "🧠"
  },
  {
    text: "Show me how a quantum computer works",
    emoji: "💫"
  },
  {
    text: "Create a visual guide to blockchain technology",
    emoji: "⛓️"
  },
  {
    text: "Visualize how machine learning makes predictions",
    emoji: "🤖"
  }
];

export function MessageSuggestions({ onSuggestionClick }: MessageSuggestionsProps) {
  return (
    <div className="flex-1 flex items-center justify-center py-8">
      <div className="w-full max-w-lg mx-auto px-4">
        <h1 className="text-3xl font-serif mb-6 text-center">Transform Complex Ideas Into Clear Visuals</h1>
        <div className="w-full grid grid-cols-1 gap-2">
          {suggestions.map((suggestion, index) => (
            <Button
              key={index}
              variant="ghost"
              className="w-full flex items-center gap-3 py-3 px-4 hover:bg-gray-50 dark:hover:bg-gray-900 rounded-lg text-left"
              onClick={() => onSuggestionClick(suggestion.text)}
            >
              <span className="text-xl flex-shrink-0" role="img" aria-label="icon">
                {suggestion.emoji}
              </span>
              <span className="text-base font-medium">
                {suggestion.text}
              </span>
            </Button>
          ))}
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">Press Ctrl+Shift+Enter for video generation</p>
      </div>
    </div>
  );
} 