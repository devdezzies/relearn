import { getPublicMessages, getPublicConversation } from "@/app/chat-actions";
import SharedConversationView from "@/components/shared-conversation-view";
import { notFound } from "next/navigation";

// This ensures the page doesn't use the root layout
export const dynamic = 'force-dynamic';

export default async function SharedConversationPage({ params }: { params: { id: string } }) {
  const conversationId = params.id;
  
  try {
    // Fetch conversation data without requiring authentication
    const conversation = await getPublicConversation(conversationId);
    const messages = await getPublicMessages(conversationId);
    
    // If no messages found, show 404 page
    if (!messages || messages.length === 0) {
      return notFound();
    }
    
    // Render the shared conversation view
    return (
      <SharedConversationView 
        messages={messages} 
        title={conversation.title} 
      />
    );
  } catch (error) {
    console.error("Error loading shared conversation:", error);
    return notFound();
  }
}

// Generate metadata for the page
export async function generateMetadata({ params }: { params: { id: string } }) {
  const conversationId = params.id;
  
  try {
    const conversation = await getPublicConversation(conversationId);
    return {
      title: `${conversation.title} | Shared Conversation`,
      description: "A shared conversation from Relearn AI",
    };
  } catch (error) {
    return {
      title: "Shared Conversation",
      description: "A shared conversation from Relearn AI",
    };
  }
}