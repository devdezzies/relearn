"use client";

import { MessageSquare, Plus, Trash2, Loader2, ExternalLink } from "lucide-react";
import { Button } from "../ui/button";
import { ThemeSwitcher } from "../theme-switcher";
import { signOutAction } from "@/app/actions";
import { type Conversation } from "@/app/chat-actions";

interface SidebarProps {
  conversations: Conversation[];
  currentConversationId: string | null;
  isLoadingConversations: boolean;
  isResponseStreaming: boolean;
  onStartNewChat: () => void;
  onSelectConversation: (conversationId: string) => void;
  onDeleteConversation: (conversationId: string) => void;
  isSidebarOpen: boolean;
}

export function ChatSidebar({
  conversations,
  currentConversationId,
  isLoadingConversations,
  isResponseStreaming,
  onStartNewChat,
  onSelectConversation,
  onDeleteConversation,
  isSidebarOpen
}: SidebarProps) {
  return (
    <div className={`${isSidebarOpen ? 'w-64' : 'w-0'} bg-white dark:bg-gray-950 text-black dark:text-white transition-all duration-300 flex flex-col h-full overflow-hidden border-r border-gray-100 dark:border-gray-900`}>
      <div className="p-4 flex items-center justify-between">
        <button 
          onClick={() => {
            if (isResponseStreaming) {
              alert("Cannot start a new chat while a response is being generated. Please wait for the current response to complete.");
            } else {
              onStartNewChat();
            }
          }}
          className={`flex items-center gap-2 text-sm font-medium ${!isResponseStreaming ? 'hover:bg-gray-100 dark:hover:bg-gray-900' : 'opacity-50 cursor-not-allowed'} rounded-md py-2 px-3 w-full transition-colors`}
          disabled={isResponseStreaming}
        >
          <Plus size={16} />
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {isLoadingConversations ? (
          <div className="flex justify-center items-center py-4">
            <Loader2 className="h-4 w-4 animate-spin text-gray-500 dark:text-gray-400" />
          </div>
        ) : conversations.length > 0 ? (
          <>
            <div className="text-xs text-gray-500 dark:text-gray-400 font-medium px-2 py-2 mb-1">
              Your conversations
            </div>
            {conversations.map((conversation) => (
              <div 
                key={conversation.conversation_id}
                className={`flex items-center justify-between text-sm w-full rounded-md py-2 px-3 transition-colors ${
                  conversation.conversation_id === currentConversationId 
                    ? 'bg-gray-100 dark:bg-gray-800' 
                    : 'hover:bg-gray-100 dark:hover:bg-gray-900'
                }`}
              >
                <button 
                  onClick={() => {
                    if (isResponseStreaming) {
                      alert("Cannot switch conversations while a response is being generated. Please wait for the current response to complete.");
                    } else if (conversation.conversation_id !== currentConversationId) {
                      onSelectConversation(conversation.conversation_id);
                    }
                  }}
                  className={`flex items-center gap-2 flex-1 text-left ${isResponseStreaming ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={isResponseStreaming}
                >
                  <MessageSquare size={16} />
                  <span className="truncate">{conversation.title.length > 15 ? conversation.title.substring(0, 15) + '...' : conversation.title}</span>
                </button>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if (isResponseStreaming) {
                      alert("Cannot delete conversation while a response is being generated. Please wait for the current response to complete.");
                    } else {
                      onDeleteConversation(conversation.conversation_id);
                    }
                  }}
                  className={`p-1 rounded-md ${!isResponseStreaming ? 'hover:bg-gray-200 dark:hover:bg-gray-700' : 'opacity-50 cursor-not-allowed'} transition-colors`}
                  aria-label="Delete conversation"
                  disabled={isResponseStreaming}
                >
                  <Trash2 size={14} className="text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            ))}
          </>
        ) : (
          <div className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
            No conversations yet
          </div>
        )}
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
  );
}