import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import ChatInterface from "@/components/chat-interface";
import { getMessages, getConversations } from "@/app/chat-actions";

export default async function ConversationPage({ params }: { params: { id: string } }) {
  const supabase = await createClient();
  const conversationId = params.id;

  // Check if user is authenticated
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Verify that the conversation exists and belongs to the user
  const { data: conversation, error } = await supabase
    .from("conversations")
    .select()
    .eq("conversation_id", conversationId)
    .eq("user_id", user.id)
    .single();

  if (error || !conversation) {
    // If conversation doesn't exist or doesn't belong to the user, redirect to protected page
    return redirect("/protected");
  }

  // Render the ChatInterface with the specific conversation ID
  return <ChatInterface initialConversationId={conversationId} />;
}