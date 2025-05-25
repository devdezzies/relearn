"use client";

import { useState, useEffect } from "react";
import { User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MermaidDiagram } from "./mermaid-diagram";
import { type Message as MessageType } from "@/app/chat-actions";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  videoUrl?: string;
};

export default function SharedConversationView({ 
  messages, 
  title 
}: { 
  messages: MessageType[],
  title: string
}) {
  const [formattedMessages, setFormattedMessages] = useState<Message[]>([]);

  useEffect(() => {
    // Convert database messages to component message format
    const formatted = messages.map(msg => ({
      role: msg.role,
      content: msg.content,
      timestamp: new Date(msg.timestamp),
      videoUrl: msg.video_url,
    }));

    setFormattedMessages(formatted);
  }, [messages]);

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white dark:bg-black border-b border-gray-100 dark:border-gray-900 p-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-medium text-gray-800 dark:text-gray-200">{title}</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Shared conversation
          </div>
        </div>
      </header>

      {/* Messages */}
      <main className="flex-1 overflow-y-auto bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto py-8">
          {formattedMessages.length > 0 ? (
            formattedMessages.map((message, index) => (
              <div
                key={index}
                className="flex w-full py-6 first:pt-0"
              >
                <div className="flex w-full items-start gap-5 px-6">
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
                      <ReactMarkdown 
                        remarkPlugins={[remarkGfm, remarkMath]}
                        rehypePlugins={[rehypeKatex, rehypeRaw]}
                        components={{
                          code({ node, inline, className, children, ...props }) {
                            const match = /language-(\w+)/.exec(className || '');
                            if (!inline && match && match[1] === 'mermaid') {
                              return <MermaidDiagram chart={String(children).replace(/\n$/, '')} />;
                            }
                            return inline ? (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            ) : (
                              <pre className={className} {...props}>
                                <code>{children}</code>
                              </pre>
                            );
                          },
                          blockquote: ({ node, ...props }) => (
                            <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-300 dark:border-gray-700 p-3 rounded-md my-3">
                              <blockquote {...props} />
                            </div>
                          ),
                        }}
                      >
                        {message.content}
                      </ReactMarkdown>
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
                    <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                      {formatTime(message.timestamp)}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-center p-8">
              <p className="text-gray-500 dark:text-gray-400">No messages to display</p>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-100 dark:border-gray-900 p-4 bg-white dark:bg-black">
        <div className="max-w-4xl mx-auto text-center text-sm text-gray-500 dark:text-gray-400">
          Powered by Relearn AI
        </div>
      </footer>
    </>
  );
}
