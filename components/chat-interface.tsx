"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "./ui/button";
import { TextArea } from "./ui/input";
import { User, Bot, Send, Menu, Plus, ExternalLink, MessageSquare, Video, Loader2, Trash2, Share2 } from "lucide-react";
import { signOutAction } from "@/app/actions";
import { ThemeSwitcher } from "./theme-switcher";
import { AlertDialog } from "./ui/alert-dialog";
import { 
  createConversation, 
  addMessage, 
  getConversations, 
  getMessages, 
  updateConversationTitle,
  deleteConversation,
  type Conversation as ConversationType,
  type Message as MessageType
} from "@/app/chat-actions";
import { createClient } from "@/utils/supabase/client";
import { generateChatCompletion } from "@/utils/openai-client";
import { ResponseStream } from "./prompt-kit/response-stream";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeKatex from "rehype-katex";
import rehypeRaw from "rehype-raw";
import { MarkdownResponseStream } from "./markdown-response-stream";
import { MermaidDiagram } from "./mermaid-diagram";
import { MessageSuggestions } from "./chat/message-suggestions";
import { ChatSidebar } from "./chat/sidebar";
import { RelatedQuestions } from "./chat/related-questions";
import { VideoPlayer } from "./ui/video-player";
import { VideoSkeleton } from "./ui/video-skeleton";

type Message = {
  role: "user" | "assistant";
  content: string;
  timestamp?: Date;
  videoUrl?: string; // URL for video content
  message_id?: string;
  conversation_id?: string;
  isNew?: boolean; // Flag to indicate if this is a new message that should use typewriter effect
  relatedQuestions?: string[]; // Add related questions field
};


export default function ChatInterface({ initialConversationId }: { initialConversationId?: string }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<ConversationType[]>([]);
  const [currentConversationId, setCurrentConversationId] = useState<string | null>(initialConversationId || null);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isGeneratingVideo, setIsGeneratingVideo] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [chatTitle, setChatTitle] = useState("Relearn AI");
  const [isLoadingConversations, setIsLoadingConversations] = useState(false);
  const [isTitleUpdated, setIsTitleUpdated] = useState(false);
  const [isResponseStreaming, setIsResponseStreaming] = useState(false);
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertTitle, setAlertTitle] = useState("Notice");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Add a warning message if the user tries to navigate away while a response is streaming
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isResponseStreaming) {
        // Standard way to show a confirmation dialog
        e.preventDefault();
        // Chrome requires returnValue to be set
        e.returnValue = '';
        // Message (may not be displayed in modern browsers, but required)
        return 'A response is still being generated. Are you sure you want to leave?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [isResponseStreaming]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Effect to update the title based on conversation content
  useEffect(() => {
    const updateTitle = async () => {
      // Only update title if we have a conversation ID and enough messages
      if (currentConversationId && messages.length >= 2 && !isTitleUpdated) {
        // Need at least one user message to generate a meaningful title
        const userMessages = messages.filter(msg => msg.role === "user");
        if (userMessages.length > 0) {
          const newTitle = generateTitle(messages);

          // Only update if the title is different from the current one
          if (newTitle !== chatTitle && newTitle !== "Relearn AI") {
            setChatTitle(newTitle);

            try {
              // Update the title in the database
              await updateConversationTitle(currentConversationId, newTitle);
              setIsTitleUpdated(true);
            } catch (error) {
              console.error("Error updating conversation title:", error);
            }
          }
        }
      }
    };

    updateTitle();
  }, [messages, currentConversationId, chatTitle, isTitleUpdated]);

  // Load conversations when component mounts
  useEffect(() => {
    const loadConversations = async () => {
      try {
        setIsLoadingConversations(true);
        const conversationsData = await getConversations();
        setConversations(conversationsData);

        // If initialConversationId is provided, load that conversation
        if (initialConversationId) {
          // Find the conversation in the loaded conversations
          const conversation = conversationsData.find(
            (conv) => conv.conversation_id === initialConversationId
          );

          if (conversation) {
            setChatTitle(conversation.title);
            await loadMessages(initialConversationId);
          } else {
            // If the conversation is not found, select the most recent one
            if (conversationsData.length > 0) {
              setCurrentConversationId(conversationsData[0].conversation_id);
              setChatTitle(conversationsData[0].title);
              await loadMessages(conversationsData[0].conversation_id);
            }
          }
        } 
        // If no initialConversationId is provided and there are conversations, select the most recent one
        else if (conversationsData.length > 0) {
          setCurrentConversationId(conversationsData[0].conversation_id);
          setChatTitle(conversationsData[0].title);
          await loadMessages(conversationsData[0].conversation_id);
        }
      } catch (error) {
        console.error("Error loading conversations:", error);
      } finally {
        setIsLoadingConversations(false);
      }
    };

    // Check if user is authenticated using Supabase client
    const checkAuth = async () => {
      const supabase = createClient();
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        loadConversations();
      }
    };

    checkAuth();
  }, [initialConversationId]);

  // Load messages for a conversation
  const loadMessages = async (conversationId: string) => {
    // Don't load messages if a response is currently streaming
    if (isResponseStreaming || isGeneratingVideo) return;

    // Clear any active reply
    setReplyingTo(null);

    try {
      setIsLoading(true);
      const messagesData = await getMessages(conversationId);

      // Convert database messages to component message format
      const formattedMessages = messagesData.map(msg => ({
        role: msg.role,
        content: msg.content,
        timestamp: new Date(msg.timestamp),
        videoUrl: msg.video_url,
        message_id: msg.message_id,
        conversation_id: msg.conversation_id,
        isNew: false // These are existing messages, so they should not use the typewriter effect
      }));

      setMessages(formattedMessages);
      setCurrentConversationId(conversationId);
    } catch (error) {
      console.error("Error loading messages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!input.trim() || isResponseStreaming || isLoading || isGeneratingVideo) return;

    // Prepare the message content, including reply information if applicable
    let messageContent = input;
    if (replyingTo) {
      // Format the reply with proper markdown for better visual distinction
      const replyPreview = replyingTo.content.length > 100 
        ? replyingTo.content.substring(0, 100) + "..." 
        : replyingTo.content;

      // Use a more visually distinct format for replies
      messageContent = `> **Replying to ${replyingTo.role === "assistant" ? "AI" : "yourself"}:**\n> ${replyPreview.replace(/\n/g, '\n> ')}\n\n${input}`;
    }

    const userMessage: Message = { 
      role: "user", 
      content: messageContent,
      timestamp: new Date(),
      isNew: true // This is a new message
    };

    // Add message to local state immediately for UI responsiveness
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setReplyingTo(null); // Clear the reply when a message is sent
    setIsLoading(true);

    try {
      // If this is a new conversation, create it with the initial message
      if (!currentConversationId) {
        const newTitle = input.length > 30 
          ? input.substring(0, 30) + "..." 
          : input;

        // Create a new conversation with the initial user message
        // This is more efficient than creating a conversation and then adding a message separately
        const newConversation = await createConversation(newTitle, {
          role: "user",
          content: messageContent // Use the message content that includes reply information
        });

        setCurrentConversationId(newConversation.conversation_id);
        setChatTitle(newTitle);
        setIsTitleUpdated(false); // Reset flag when creating a new conversation

        // Refresh conversations list
        const conversationsData = await getConversations();
        setConversations(conversationsData);
      } else {
        // Add the user message to the existing conversation
        await addMessage(
          currentConversationId,
          "user",
          messageContent // Use the message content that includes reply information
        );
      }

      // Call the AI service to generate a response
      try {
        // Convert the current messages to the format expected by the OpenAI API
        const apiMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Add the current user message
        apiMessages.push({
          role: "user",
          content: messageContent // Use the message content that includes reply information
        });

        // Generate AI response using the OpenAI client
        const aiResponse = await generateChatCompletion(apiMessages);

        // Add AI message to database
        if (currentConversationId) {
          await addMessage(
            currentConversationId,
            "assistant",
            aiResponse || ""
          );
        }

        // Add AI message to local state
        const aiMessage: Message = {
          role: "assistant",
          content: aiResponse || "",
          timestamp: new Date(),
          isNew: true,
          relatedQuestions: await generateRelatedQuestions(aiResponse || "")
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);
        inputRef.current?.focus();
      } catch (error) {
        console.error("Error generating AI response:", error);

        // Fallback response in case of error
        const errorMessage: Message = {
          role: "assistant",
          content: "I'm sorry, I encountered an error while processing your request. Please try again later.",
          timestamp: new Date(),
          isNew: true // This is a new message that should use typewriter effect
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error in chat submission:", error);
      setIsLoading(false);
    }
  };

  const handleVideoGeneration = async () => {
    if (!input.trim() || isResponseStreaming || isLoading || isGeneratingVideo) return;

    const userMessage: Message = { 
      role: "user", 
      content: `Generate a video about: ${input}`,
      timestamp: new Date(),
      isNew: true // This is a new message
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setReplyingTo(null); // Clear the reply when generating a video
    setIsGeneratingVideo(true);

    try {
      // If this is a new conversation, create it with the initial message
      if (!currentConversationId) {
        const newTitle = `Video: ${input.length > 25 
          ? input.substring(0, 25) + "..." 
          : input}`;

        // Create a new conversation with the initial user message
        // This is more efficient than creating a conversation and then adding a message separately
        const newConversation = await createConversation(newTitle, {
          role: "user",
          content: userMessage.content
        });

        setCurrentConversationId(newConversation.conversation_id);
        setChatTitle(newTitle);
        setIsTitleUpdated(false); // Reset flag when creating a new video conversation

        // Refresh conversations list
        const conversationsData = await getConversations();
        setConversations(conversationsData);
      } else {
        // Add the user message to the existing conversation
        await addMessage(
          currentConversationId,
          "user",
          userMessage.content
        );
      }

      // Generate video explanation using AI
      try {
        // Get video URL from environment variable or use a default for development
        const videoUrl = process.env.NEXT_PUBLIC_SAMPLE_VIDEO_URL || 
          "https://tlxtnbjmkuwlafilbgfn.supabase.co/storage/v1/object/public/video//hello_world_PlotExceedsYRangeProblem_1748101319.mp4";

        // TODO: In a production app, integrate with a proper video generation service

        // Convert the current messages to the format expected by the OpenAI API
        const apiMessages = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));

        // Add a specific prompt for video explanation
        apiMessages.push({
          role: "user",
          content: `Generate a detailed explanation about "${input}" that would be suitable for a video explanation. Focus on visual descriptions and step-by-step explanations.`
        });

        // Generate AI response using the OpenAI client
        const aiResponse = await generateChatCompletion(apiMessages);

        // Prepare the final response with video reference
        const finalResponse = `Here's a video about "${input}" that might help explain the concept:\n\n${aiResponse}`;

        // Add AI message with video to database
        if (currentConversationId) {
          await addMessage(
            currentConversationId,
            "assistant",
            finalResponse,
            videoUrl
          );
        }

        // Add AI message to local state
        const aiMessage: Message = {
          role: "assistant",
          content: finalResponse,
          timestamp: new Date(),
          videoUrl,
          isNew: true,
          relatedQuestions: await generateRelatedQuestions(finalResponse)
        };
        setMessages(prev => [...prev, aiMessage]);
        setIsGeneratingVideo(false);
        inputRef.current?.focus();
      } catch (error) {
        console.error("Error generating video explanation:", error);

        // Fallback response in case of error
        const errorMessage: Message = {
          role: "assistant",
          content: "I'm sorry, I encountered an error while generating the video explanation. Please try again later.",
          timestamp: new Date(),
          isNew: true // This is a new message that should use typewriter effect
        };
        setMessages(prev => [...prev, errorMessage]);
        setIsGeneratingVideo(false);
      }
    } catch (error) {
      console.error("Error in video generation:", error);
      setIsGeneratingVideo(false);
    }
  };

  // Handle deleting a conversation
  const handleDeleteConversation = async (conversationId: string) => {
    // Don't delete a conversation if a response is currently streaming
    if (isResponseStreaming || isLoading || isGeneratingVideo) return;

    try {
      // If we're deleting the current conversation, clear the UI first
      if (conversationId === currentConversationId) {
        setMessages([]);
        setCurrentConversationId(null);
        setChatTitle("Relearn AI");
      }

      // Delete the conversation from the database
      await deleteConversation(conversationId);

      // Refresh the conversations list
      const conversationsData = await getConversations();
      setConversations(conversationsData);

      // If we deleted the current conversation and there are other conversations,
      // select the first one
      if (conversationId === currentConversationId && conversationsData.length > 0) {
        loadMessages(conversationsData[0].conversation_id);
        setChatTitle(conversationsData[0].title);
      }
    } catch (error) {
      console.error("Error deleting conversation:", error);
    }
  };

  const startNewChat = async () => {
    // Don't start a new chat if a response is currently streaming
    if (isResponseStreaming || isLoading || isGeneratingVideo) return;

    // Clear any active reply
    setReplyingTo(null);

    try {
      // Create a new empty conversation without any initial message
      const newConversation = await createConversation("Relearn AI", undefined);

      setCurrentConversationId(newConversation.conversation_id);

      // Update local state with empty messages array
      setMessages([]);

      setChatTitle("Relearn AI");
      setIsTitleUpdated(false); // Reset flag when starting a new chat

      // Refresh conversations list
      const conversationsData = await getConversations();
      setConversations(conversationsData);

      inputRef.current?.focus();
    } catch (error) {
      console.error("Error starting new chat:", error);
    }
  };

  const formatTime = (date?: Date) => {
    if (!date) return "";
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  // Function to handle sharing a conversation
  const handleShareConversation = async () => {
    if (!currentConversationId) return;

    // Generate the shareable URL using the public sharing route
    const shareUrl = `${window.location.origin}/share/${currentConversationId}`;

    try {
      // Check if the Clipboard API is available
      if (navigator && navigator.clipboard && navigator.clipboard.writeText) {
        // Copy the URL to clipboard using the Clipboard API
        await navigator.clipboard.writeText(shareUrl);

        // Show a success message
        setAlertTitle("Link Copied");
        setAlertMessage("Public conversation link has been copied to clipboard. You can now share it with others. Anyone with this link can view the conversation without logging in.");
      } else {
        // Fallback for environments where Clipboard API is not available
        setAlertTitle("Share Conversation");
        setAlertMessage(`Your browser doesn't support automatic copying. Please manually select and copy this link: ${shareUrl}`);
      }
      setIsAlertOpen(true);
    } catch (error) {
      console.error("Error copying to clipboard:", error);

      // Show an error message with the URL so users can still copy it manually
      setAlertTitle("Share Conversation");
      setAlertMessage(`There was an error copying to clipboard. Please manually select and copy this link: ${shareUrl}`);
      setIsAlertOpen(true);
    }
  };

  // Generate a meaningful title based on conversation content
  const generateTitle = (messages: Message[]) => {
    // Need at least a user message to generate a title
    const userMessages = messages.filter(msg => msg.role === "user");
    if (userMessages.length === 0) return "Relearn AI";

    // Use the first user message as a base for the title
    let firstUserMessage = userMessages[0].content;

    // If there are multiple messages, try to create a more contextual title
    if (userMessages.length > 1) {
      // Extract key topics from user messages
      const topics = userMessages
        .map(msg => msg.content)
        .join(" ")
        .split(" ")
        .filter(word => word.length > 3) // Filter out short words
        .slice(0, 10) // Take first 10 words
        .join(" ");

      if (topics.length > 5) {
        // If we have meaningful topics, use them
        firstUserMessage = topics;
      }
    }

    // Truncate and clean up the title
    let title = firstUserMessage.trim();

    // Check if it's a video-related conversation
    const isVideoRelated = messages.some(msg => 
      msg.videoUrl || msg.content.toLowerCase().includes("video")
    );

    if (isVideoRelated) {
      title = "Video: " + title;
    }

    // Limit title length
    if (title.length > 40) {
      title = title.substring(0, 40) + "...";
    }

    return title;
  };

  const handleSuggestionClick = (suggestion: string) => {
    setInput(suggestion);
    inputRef.current?.focus();
  };

  const generateRelatedQuestions = async (message: string): Promise<string[]> => {
    try {
      // Create a prompt for generating related questions
      const prompt = [
        {
          role: "system",
          content: "You are a helpful AI that generates 3 concise, relevant follow-up questions based on the previous response. The questions should be clear, specific, and encourage deeper exploration of the topic. Each question should be no longer than 10 words."
        },
        {
          role: "user",
          content: `Generate 3 concise follow-up questions based on this response: "${message}"`
        }
      ];

      // Get questions from OpenAI
      const response = await generateChatCompletion(prompt);
      
      // Split the response into individual questions and clean them up
      const questions = response
        ?.split(/\d\.|\n/)
        .map(q => q.trim())
        .filter(q => q.length > 0 && q.endsWith('?'))
        .slice(0, 3) || [];

      return questions;
    } catch (error) {
      console.error("Error generating related questions:", error);
      return [];
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter') {
      if (e.ctrlKey && e.shiftKey) {
        // Ctrl+Shift+Enter for video generation
        e.preventDefault();
        if (!isGeneratingVideo && !isLoading && !isResponseStreaming && input.trim() && (currentConversationId || conversations.length === 0)) {
          handleVideoGeneration();
        }
      } else if (e.ctrlKey) {
        // Ctrl+Enter for text submission
        e.preventDefault();
        if (!isLoading && !isGeneratingVideo && !isResponseStreaming && input.trim() && (currentConversationId || conversations.length === 0)) {
          handleSubmit(e as any);
        }
      }
      // Regular Enter will be handled by the textarea for new lines
    }
  };

  return (
    <div className="flex h-full w-full bg-white dark:bg-black">
      {/* Sidebar with date categorization */}
      <ChatSidebar
        conversations={conversations}
        currentConversationId={currentConversationId}
        isLoadingConversations={isLoadingConversations}
        isResponseStreaming={isResponseStreaming}
        onStartNewChat={startNewChat}
        onSelectConversation={(id) => {
          loadMessages(id);
          const conversation = conversations.find(c => c.conversation_id === id);
          if (conversation) {
            setChatTitle(conversation.title);
            setIsTitleUpdated(false);
          }
        }}
        onDeleteConversation={handleDeleteConversation}
        isSidebarOpen={isSidebarOpen}
        messages={messages}
      />

      {/* Main chat area */}
      <div className="flex flex-col flex-1 h-full">
        {/* Header */}
        <div className="p-4 flex items-center justify-between bg-white dark:bg-black sticky top-0 z-10 border-b border-gray-100 dark:border-gray-900">
          <button 
            onClick={() => {
              if (isResponseStreaming) {
                alert("Cannot toggle sidebar while a response is being generated. Please wait for the current response to complete.");
              } else {
                setIsSidebarOpen(!isSidebarOpen);
              }
            }}
            className={`p-2 rounded-md ${!isResponseStreaming ? 'hover:bg-gray-100 dark:hover:bg-gray-900' : 'opacity-50 cursor-not-allowed'} transition-colors`}
            disabled={isResponseStreaming}
          >
            <Menu size={18} className="text-gray-500 dark:text-gray-400" />
          </button>
          <div className="flex items-center gap-2">
            <h2 className="font-medium text-gray-800 dark:text-gray-200">{chatTitle}</h2>
            {currentConversationId && (
              <button
                onClick={() => {
                  if (isResponseStreaming) {
                    alert("Cannot share conversation while a response is being generated. Please wait for the current response to complete.");
                  } else {
                    handleShareConversation();
                  }
                }}
                className={`p-1.5 rounded-md ${!isResponseStreaming ? 'hover:bg-gray-100 dark:hover:bg-gray-900' : 'opacity-50 cursor-not-allowed'} transition-colors`}
                disabled={isResponseStreaming}
                title="Share conversation"
              >
                <Share2 size={16} className="text-gray-500 dark:text-gray-400" />
              </button>
            )}
          </div>
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {isGeneratingVideo ? "🎥 Generating video...   " : isLoading ? "Typing...   " : isResponseStreaming ? "🧠 Responding...   " : ""}
          </div>
        </div>

        {/* Messages */}
        <div 
          ref={chatContainerRef}
          className="flex-1 overflow-y-auto flex flex-col bg-white dark:bg-black"
        >
          {messages.length > 0 ? (
            messages.map((message, index) => (
              <div
                key={index}
                className="flex w-full pt-6"
              >
                <div className="flex w-full max-w-4xl mx-auto px-4 items-start gap-4">
                  {message.role === "assistant" ? (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full dark:bg-gray-100 flex items-center justify-center text-2xl mt-3.5">
                      
                    </div>
                  ) : (
                    <div className="flex-shrink-0 w-8 h-8 rounded-full dark:bg-gray-800 flex items-center justify-center text-2xl">
                      🤔
                    </div>
                  )}

                  <div className={`flex flex-col flex-1 min-w-0 ${message.role === "user" ? "bg-gray-50 dark:bg-gray-900/50 p-4 rounded-lg" : ""}`}>
                    {message.videoUrl && (
                      <div className="mb-4">
                        <VideoPlayer 
                          src={message.videoUrl}
                          className="w-full max-w-2xl"
                        />
                      </div>
                    )}
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      {message.role === "assistant" ? (
                        <div className="w-full min-w-full">
                          {message.isNew ? (
                            <MarkdownResponseStream 
                              textStream={message.content} 
                              mode="fade" 
                              speed={80}
                              onStreamStart={() => setIsResponseStreaming(true)}
                              onStreamComplete={() => setIsResponseStreaming(false)}
                              onReply={() => {
                                setReplyingTo(message);
                                inputRef.current?.focus();
                              }}
                            />
                          ) : (
                            // For existing messages, use MarkdownResponseStream with the full content
                            // This ensures consistent rendering between new and existing messages
                            <MarkdownResponseStream 
                              textStream={message.content} 
                              mode="fade" 
                              speed={0} // Speed 0 means instant rendering for existing messages
                              onReply={() => {
                                setReplyingTo(message);
                                inputRef.current?.focus();
                              }}
                            />
                          )}
                          {message.relatedQuestions && (
                            <RelatedQuestions
                              questions={message.relatedQuestions}
                              onQuestionClick={(question) => {
                                setInput(question);
                                inputRef.current?.focus();
                              }}
                              isResponseComplete={!isResponseStreaming}
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
                              onClick={() => {
                                setReplyingTo(message);
                                inputRef.current?.focus();
                              }}
                            >
                              <MessageSquare className="h-3 w-3" />
                              <span className="text-xs">Reply</span>
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : !isLoading && !isGeneratingVideo ? (
            <div className="flex flex-col items-center justify-start h-full text-center p-8">
              <MessageSuggestions onSuggestionClick={handleSuggestionClick} />

              {!currentConversationId && (
                <div className="mt-8">
                  <Button 
                    onClick={() => {
                      if (isResponseStreaming) {
                        alert("Cannot start a new conversation while a response is being generated. Please wait for the current response to complete.");
                      } else {
                        startNewChat();
                      }
                    }} 
                    className={`flex items-center gap-2 ${isResponseStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={isResponseStreaming}
                  >
                    <Plus size={16} />
                    New conversation
                  </Button>
                </div>
              )}
            </div>
          ) : null}

          {(isLoading || isGeneratingVideo) && (
            <div className="flex w-full py-8">
              <div className="flex w-full max-w-4xl mx-auto px-6 items-start gap-5">
                {!isGeneratingVideo && (
                  <div className="flex-shrink-0 w-7 h-7 rounded-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <Bot className="h-4 w-4 text-gray-700 dark:text-gray-300" />
                  </div>
                )}
                <div className="flex flex-col flex-1">
                  <div className="prose prose-sm dark:prose-invert">
                    {isGeneratingVideo ? (
                      <div>
                        <VideoSkeleton className="w-full max-w-2xl ml-10" />
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
        <div className="sticky bottom-0 bg-gradient-to-t from-white via-white to-white/80 dark:from-black dark:via-black dark:to-black/80 pt-4 pb-4">
          <div className="max-w-4xl mx-auto px-4">
            {replyingTo && (
              <div className="mb-2 p-2 border border-gray-200 dark:border-gray-800 rounded-lg bg-gray-50/50 dark:bg-gray-900/50 backdrop-blur-sm flex justify-between items-start">
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
            <div className="relative">
              <form onSubmit={(e) => e.preventDefault()} className="relative">
                <TextArea
                  ref={inputRef as any}
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={
                    isGeneratingVideo 
                      ? "Generating video..." 
                      : isResponseStreaming
                        ? "Wait for response to complete..."
                        : !currentConversationId && conversations.length > 0
                        ? "Select a conversation or start a new one..."
                        : `Message ${chatTitle}... (Ctrl+Enter to send, Enter for new line)`
                  }
                  disabled={isLoading || isGeneratingVideo || isResponseStreaming || (!currentConversationId && conversations.length > 0)}
                  className="pr-24 pl-4"
                  maxLength={2000}
                  showCharCount={true}
                  onHeightChange={(height) => {
                    // Adjust the position of the buttons based on the textarea height
                    const buttonsContainer = document.querySelector('.input-buttons');
                    if (buttonsContainer) {
                      const top = height / 2 - 8; // Adjust for better vertical alignment
                      (buttonsContainer as HTMLElement).style.top = `${top}px`;
                    }
                  }}
                />
                <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2 input-buttons">
                  <Button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleVideoGeneration();
                    }}
                    disabled={isGeneratingVideo || isLoading || isResponseStreaming || !input.trim() || (!currentConversationId && conversations.length > 0)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    size="icon"
                    variant="ghost"
                    title="Generate Video (Ctrl+Shift+Enter)"
                  >
                    <Video className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                  <Button 
                    type="button" 
                    onClick={(e) => {
                      e.preventDefault();
                      handleSubmit(e);
                    }}
                    disabled={isLoading || isGeneratingVideo || isResponseStreaming || !input.trim() || (!currentConversationId && conversations.length > 0)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-900 transition-colors"
                    size="icon"
                    variant="ghost"
                    title="Send Message (Ctrl+Enter)"
                  >
                    <Send className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Alert Dialog for empty conversation warning */}
      <AlertDialog
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        title={alertTitle}
        message={alertMessage}
      />
    </div>
  );
}
