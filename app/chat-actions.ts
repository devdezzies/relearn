"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

// Types matching the database schema
export type Conversation = {
  conversation_id: string;
  user_id: string;
  created_at: string;
  title: string;
};

export type Message = {
  message_id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: string;
  video_url?: string;
};

// Create a new conversation
export async function createConversation(title: string) {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Insert a new conversation
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title: title
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error creating conversation:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/");
  return data;
}

// Add a message to a conversation
export async function addMessage(conversationId: string, role: "user" | "assistant", content: string, videoUrl?: string) {
  const supabase = await createClient();
  
  // Insert a new message
  const { data, error } = await supabase
    .from("messages")
    .insert({
      conversation_id: conversationId,
      role: role,
      content: content,
      video_url: videoUrl
    })
    .select()
    .single();
  
  if (error) {
    console.error("Error adding message:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/");
  return data;
}

// Get all conversations for the current user
export async function getConversations() {
  const supabase = await createClient();
  
  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error("User not authenticated");
  }
  
  // Get all conversations for the user, ordered by most recent
  const { data, error } = await supabase
    .from("conversations")
    .select()
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  
  if (error) {
    console.error("Error getting conversations:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Get all messages for a conversation
export async function getMessages(conversationId: string) {
  const supabase = await createClient();
  
  // Get all messages for the conversation, ordered by timestamp
  const { data, error } = await supabase
    .from("messages")
    .select()
    .eq("conversation_id", conversationId)
    .order("timestamp", { ascending: true });
  
  if (error) {
    console.error("Error getting messages:", error);
    throw new Error(error.message);
  }
  
  return data;
}

// Update conversation title
export async function updateConversationTitle(conversationId: string, title: string) {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("conversations")
    .update({ title })
    .eq("conversation_id", conversationId);
  
  if (error) {
    console.error("Error updating conversation title:", error);
    throw new Error(error.message);
  }
  
  revalidatePath("/");
  return { success: true };
}