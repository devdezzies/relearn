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
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
  video_url?: string;
  message_id: string;
  conversation_id: string;
  is_generating_video?: boolean;
};

// Create a new conversation
export async function createConversation(title: string, initialMessage?: { role: "user" | "assistant", content: string, videoUrl?: string }) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // Start a transaction to create both conversation and initial message
  // This improves performance by reducing round trips to the database
  const { data, error } = await supabase
    .from("conversations")
    .insert({
      user_id: user.id,
      title: title,
      created_at: new Date().toISOString()
    })
    .select()
    .single();

  if (error) {
    console.error("Error creating conversation:", error);
    throw new Error(error.message);
  }

  // If an initial message is provided, add it to the conversation
  if (initialMessage && data) {
    const { error: messageError } = await supabase
      .from("messages")
      .insert({
        conversation_id: data.conversation_id,
        role: initialMessage.role,
        content: initialMessage.content,
        video_url: initialMessage.videoUrl
      });

    if (messageError) {
      console.error("Error adding initial message:", messageError);
      // If adding the message fails, we should still return the conversation
      // but log the error
    }
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

// Delete a conversation and its messages
export async function deleteConversation(conversationId: string) {
  const supabase = await createClient();

  // Get the current user
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  // First, delete all messages in the conversation
  const { error: messagesError } = await supabase
    .from("messages")
    .delete()
    .eq("conversation_id", conversationId);

  if (messagesError) {
    console.error("Error deleting messages:", messagesError);
    throw new Error(messagesError.message);
  }

  // Then, delete the conversation
  const { error: conversationError } = await supabase
    .from("conversations")
    .delete()
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id); // Ensure the user owns this conversation

  if (conversationError) {
    console.error("Error deleting conversation:", conversationError);
    throw new Error(conversationError.message);
  }

  revalidatePath("/");
  return { success: true };
}

// Get messages for a conversation without authentication (for public sharing)
export async function getPublicMessages(conversationId: string) {
  const supabase = await createClient();

  // Get all messages for the conversation, ordered by timestamp
  const { data, error } = await supabase
    .from("messages")
    .select()
    .eq("conversation_id", conversationId)
    .order("timestamp", { ascending: true });

  if (error) {
    console.error("Error getting public messages:", error);
    throw new Error(error.message);
  }

  return data;
}

// Get conversation details without authentication (for public sharing)
export async function getPublicConversation(conversationId: string) {
  const supabase = await createClient();

  // Get the conversation details
  const { data, error } = await supabase
    .from("conversations")
    .select()
    .eq("conversation_id", conversationId)
    .single();

  if (error) {
    console.error("Error getting public conversation:", error);
    throw new Error(error.message);
  }

  return data;
}

// Add video generation to a message
export async function addVideoToMessage(messageId: string, videoUrl: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ video_url: videoUrl })
    .eq("message_id", messageId);

  if (error) {
    console.error("Error adding video to message:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true };
}

// Update message with video generation status
export async function updateVideoGenerationStatus(messageId: string, isGenerating: boolean) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("messages")
    .update({ is_generating_video: isGenerating })
    .eq("message_id", messageId);

  if (error) {
    console.error("Error updating video generation status:", error);
    throw new Error(error.message);
  }

  revalidatePath("/");
  return { success: true };
}
