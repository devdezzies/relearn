"use client";

import { User, Bot, MessageSquare } from "lucide-react";
import { Button } from "../ui/button";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MarkdownResponseStream } from "../markdown-response-stream";
import { VideoPlayer } from "../ui/video-player";

export type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  videoUrl?: string;
  message_id?: string;
  conversation_id?: string;
  isNew?: boolean;
};

interface MessageProps {
  message: Message;
  onReply: (message: Message) => void;
  isResponseStreaming: boolean;
}

export function ChatMessage({ message, onReply, isResponseStreaming }: MessageProps) {
  return (
    <div className="flex w-full py-6">
      <div className="flex w-full max-w-4xl mx-auto px-4 items-center gap-4">
        {message.role === "assistant" ? (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-base mt-0.5">
            🤖
          </div>
        ) : (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center text-base mt-0.5">
            🧑
          </div>
        )}

        <div className="flex flex-col flex-1 min-w-0">
          <div className="prose prose-sm dark:prose-invert max-w-none">
            {message.role === "assistant" ? (
              <div className="w-full min-w-full">
                {message.isNew ? (
                  <MarkdownResponseStream 
                    textStream={message.content} 
                    mode="fade" 
                    speed={80}
                    onStreamStart={() => {}}
                    onStreamComplete={() => {}}
                    onReply={() => onReply(message)}
                  />
                ) : (
                  <MarkdownResponseStream 
                    textStream={message.content} 
                    mode="fade" 
                    speed={0}
                    onReply={() => onReply(message)}
                  />
                )}
              </div>
            ) : (
              <div className="w-full min-w-full">
                <ReactMarkdown 
                  remarkPlugins={[remarkGfm, remarkMath]}
                  rehypePlugins={[rehypeKatex, rehypeRaw]}
                  components={{
                    blockquote: ({ node, ...props }) => (
                      <div className="bg-gray-50 dark:bg-gray-900 border-l-4 border-gray-300 dark:border-gray-700 p-3 rounded-md my-3">
                        <blockquote {...props} />
                      </div>
                    ),
                    strong: ({ node, ...props }) => {
                      // Check if this is part of a reply header
                      const text = props.children?.toString() || "";
                      if (text.startsWith("Replying to ")) {
                        return <strong {...props} />;
                      }
                      return <strong {...props} />;
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
                <div className="flex justify-end mt-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    className="flex items-center gap-2"
                    onClick={() => onReply(message)}
                    disabled={isResponseStreaming}
                  >
                    <MessageSquare className="h-3 w-3" />
                    <span className="text-xs">Reply</span>
                  </Button>
                </div>
              </div>
            )}
          </div>
          {message.videoUrl && (
            <div className="mt-4">
              <VideoPlayer 
                src={message.videoUrl}
                className="w-full max-w-2xl"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}