"use client";

import { Button } from "../ui/button";
import { Sparkles, Video, BookOpen, Lightbulb } from "lucide-react";

interface MessageSuggestionsProps {
  onSuggestionClick: (suggestion: string) => void;
}

const suggestions = [
  {
    title: "Learn with Videos",
    icon: Video,
    prompts: [
      "Generate a video explaining how neural networks work",
      "Create a video about the basics of data structures",
      "Show me a video explaining design patterns in programming"
    ]
  },
  {
    title: "Understand Concepts",
    icon: Lightbulb,
    prompts: [
      "Explain how garbage collection works in modern programming languages",
      "What are microservices and how do they work?",
      "Help me understand the concept of dependency injection"
    ]
  },
  {
    title: "Learning Paths",
    icon: BookOpen,
    prompts: [
      "Create a structured learning path for cloud computing",
      "What skills do I need to become a machine learning engineer?",
      "Design a 3-month study plan for learning web development"
    ]
  }
];

export function MessageSuggestions({ onSuggestionClick }: MessageSuggestionsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto px-4 text-center">
      {suggestions.map((category, index) => (
        <div 
          key={index}
          className="flex flex-col gap-3 p-4 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950"
        >
          <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-900 dark:text-gray-100">
            <category.icon className="w-4 h-4" />
            {category.title}
          </div>
          <div className="flex flex-col gap-2">
            {category.prompts.map((prompt, promptIndex) => (
              <Button
                key={promptIndex}
                variant="ghost"
                className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 text-left h-auto whitespace-normal py-2"
                onClick={() => onSuggestionClick(prompt)}
              >
                {prompt}
              </Button>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
} 