"use client";

import { Send, Video } from "lucide-react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { useRef } from "react";
import { Message } from "./message";

interface ChatInputProps {
  input: string;
  setInput: (input: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleVideoGeneration: () => void;
  isLoading: boolean;
  isGeneratingVideo: boolean;
  isResponseStreaming: boolean;
  currentConversationId: string | null;
  conversations: any[];
  chatTitle: string;
  replyingTo: Message | null;
  setReplyingTo: (message: Message | null) => void;
}

export function ChatInput({
  input,
  setInput,
  handleSubmit,
  handleVideoGeneration,
  isLoading,
  isGeneratingVideo,
  isResponseStreaming,
  currentConversationId,
  conversations,
  chatTitle,
  replyingTo,
  setReplyingTo
}: ChatInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="sticky bottom-0 p-5 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
      <div className="max-w-4xl mx-auto">
        {replyingTo && (
          <div className="mb-2 p-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50 dark:bg-gray-900 flex justify-between items-start">
            <div className="flex flex-col">
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
                Replying to {replyingTo.role === "assistant" ? "AI" : "yourself"}
              </div>
              <div className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
                {replyingTo.content.length > 100 
                  ? replyingTo.content.substring(0, 100) + "..." 
                  : replyingTo.content}
              </div>
            </div>
            <button 
              onClick={() => setReplyingTo(null)} 
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <form onSubmit={handleSubmit} className="w-full relative">
          <Input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={
              isResponseStreaming
                ? "Wait for response to complete..."
              : !currentConversationId && conversations.length > 0
                ? "Select a conversation or start a new one..."
                : `Message ${chatTitle}...`
            }
            disabled={isLoading || isGeneratingVideo || isResponseStreaming || (!currentConversationId && conversations.length > 0)}
            className="w-full py-5 px-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700"
          />
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
            <Button 
              type="button" 
              onClick={(e) => {
                e.preventDefault();
                handleVideoGeneration();
              }}
              disabled={isGeneratingVideo || isLoading || isResponseStreaming || !input.trim() || (!currentConversationId && conversations.length > 0)}
              className="p-1.5 rounded-lg"
              size="icon"
              variant="ghost"
            >
              <Video className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || isGeneratingVideo || isResponseStreaming || !input.trim() || (!currentConversationId && conversations.length > 0)}
              className="p-1.5 rounded-lg"
              size="icon"
              variant="ghost"
            >
              <Send className="h-4 w-4 text-gray-500 dark:text-gray-400" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}