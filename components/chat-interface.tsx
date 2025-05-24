"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { User, Bot, Send, Menu, Plus, ExternalLink, MessageSquare, Video } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { ThemeSwitcher } from "./theme-switcher";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  videoUrl?: string; // URL for video content
};

export default function ChatInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hello! How can I help you today?",
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatTitle, setChatTitle] = useState("Relearn AI");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: input,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    if (messages.length === 1 && messages[0].role === "assistant") {
      const newTitle = userMessage.content.length > 30 
        ? userMessage.content.substring(0, 30) + "..." 
        : userMessage.content;
      setChatTitle(newTitle);
    }

    setTimeout(() => {
      const aiMessage: Message = {
        role: "assistant",
        content: `I understand you're asking about "${userMessage.content}". Let me help with that. What specific aspects would you like to learn about?`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsLoading(false);
      inputRef.current?.focus();
    }, 1000);
  };

  const handleVideoGeneration = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { 
      role: "user", 
      content: `Generate a video about: ${input}`,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsGeneratingVideo(true);

    setTimeout(() => {
      const videoUrl = "https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4";

      const aiMessage: Message = {
        role: "assistant",
        content: `Here's a video about "${input}" that might help explain the concept:`,
        timestamp: new Date(),
        videoUrl
      };
      setMessages(prev => [...prev, aiMessage]);
      setIsGeneratingVideo(false);
      inputRef.current?.focus();
    }, 3000);
  };

  const startNewChat = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! How can I help you today?",
        timestamp: new Date(),
      },
    ]);
    setChatTitle("Relearn AI"); // Reset the chat title
    inputRef.current?.focus();
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-black">
      {/* Sidebar - Minimalist style */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-950 text-black dark:text-white transition-all duration-300 flex flex-col h-full overflow-hidden border-r border-gray-100 dark:border-gray-900`}>
        <div className="p-4 flex items-center justify-between">
          <button 
            onClick={startNewChat}
            className="flex items-center gap-2 text-sm font-medium hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md py-2 px-3 w-full transition-colors"
          >
            <Plus size={16} />
            New chat
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-2 mb-1">Today</div>
          <button className="flex items-center gap-2 text-sm w-full hover:bg-gray-100 dark:hover:bg-gray-900 rounded-md py-2 px-3 transition-colors">
            <MessageSquare size={16} />
            <span className="truncate">Previous conversation</span>
          </button>
        </div>

        <div className="p-4 border-t border-gray-100 dark:border-gray-900">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-gray-500 dark:text-gray-400">Theme</span>
            <ThemeSwitcher />
          </div>
          <form action={signOutAction}>
            <Button 
              type="submit"
              variant="ghost" 
              className="flex items-center gap-2 text-sm w-full hover:bg-gray-100 dark:hover:bg-gray-900 justify-start px-3"
            >
              <ExternalLink size={16} />
              Sign out
            </Button>
          </form>
        </div>
      </div>

      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-white dark:bg-black sticky top-0 z-10 border-b border-gray-100 dark:border-gray-900">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
          >
            <Menu size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
          <h2 className="font-medium text-gray-800 dark:text-gray-200">{chatTitle}</h2>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isGeneratingVideo ? "Generating video..." : isLoading ? "Typing..." : ""}
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-black"
        >
          {messages.map((message, index) => (
            <div
              key={index}
              className={`flex w-full ${message.role === "assistant" ? "bg-gray-50 dark:bg-gray-950" : ""} py-8`}
            >
              <div className="flex w-full max-w-4xl mx-auto px-6 items-start gap-5">
                {message.role === "assistant" ? (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                ) : (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                )}

                <div className="flex flex-col flex-1">
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    {message.content}
                  </div>
                  {message.videoUrl && (
                    <div className="mt-4">
                      <video 
                        controls 
                        className="rounded-lg w-full max-w-2xl"
                        src={message.videoUrl}
                      >
                        Your browser does not support the video tag.
                      </video>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}

          {(isLoading || isGeneratingVideo) && (
            <div className="flex w-full bg-gray-50 dark:bg-gray-950 py-8">
              <div className="flex w-full max-w-4xl mx-auto px-6 items-start gap-5">
                <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                  <Bot className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="prose prose-sm dark:prose-invert">
                    {isGeneratingVideo ? (
                      <div>
                        <p>Generating video...</p>
                        <div className="flex space-x-2 mt-2">
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex space-x-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce"></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400 dark:bg-gray-500 animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input area */}
        <div className="sticky bottom-0 p-5 bg-white dark:bg-black border-t border-gray-100 dark:border-gray-900">
          <div className="max-w-4xl mx-auto">
            <form onSubmit={handleSubmit} className="w-full relative">
              <Input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={isGeneratingVideo ? "Generating video..." : `Message ${chatTitle}...`}
                disabled={isLoading || isGeneratingVideo}
                className="w-full py-5 px-4 pr-12 rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-800 dark:text-gray-200 focus:ring-1 focus:ring-gray-300 dark:focus:ring-gray-700"
              />
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex gap-2">
                <Button 
                  type="button" 
                  onClick={(e) => {
                    e.preventDefault();
                    handleVideoGeneration();
                  }}
                  disabled={isGeneratingVideo || isLoading || !input.trim()}
                  className="p-1.5 rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Video className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
                <Button 
                  type="submit" 
                  disabled={isLoading || isGeneratingVideo || !input.trim()}
                  className="p-1.5 rounded-lg"
                  size="icon"
                  variant="ghost"
                >
                  <Send className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                </Button>
              </div>
            </form>
            {/* <div className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              Disclaimer text here
            </div> */}
          </div>
        </div>
      </div>
    </div>
  );
}
