import { useState } from "react";
import { Button } from "@/components/ui/button";
import { addVideoToMessage, updateVideoGenerationStatus } from "@/app/chat-actions";

interface VideoGeneratorProps {
  messageId: string;
  topic: string;
  complexity?: "beginner" | "intermediate" | "advanced";
}

export function VideoGenerator({ messageId, topic, complexity = "intermediate" }: VideoGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);

  const generateVideo = async () => {
    try {
      console.log(`[Video UI] Starting video generation for message: ${messageId}`);
      setIsGenerating(true);
      setError(null);
      setStatus(null);
      
      // Update status in database
      console.log('[Video UI] Updating database status...');
      await updateVideoGenerationStatus(messageId, true);

      // Request video generation
      console.log('[Video UI] Sending request to video generation API...');
      const response = await fetch("/api/video", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic,
          complexity,
        }),
      });

      if (!response.ok) {
        console.error('[Video UI] API request failed:', response.status);
        throw new Error("Failed to generate video");
      }

      const data = await response.json();
      console.log('[Video UI] Received API response:', data);

      if (!data || !data.videoUrl) {
        console.error('[Video UI] Invalid response data');
        throw new Error("Invalid response from video generation service");
      }

      const { status, videoUrl } = data;
      setStatus(status);

      if (status !== "success") {
        console.error('[Video UI] Video generation failed with status:', status);
        throw new Error(`Video generation failed: ${status}`);
      }

      // Update message with video URL
      console.log('[Video UI] Updating message with video URL...');
      await addVideoToMessage(messageId, videoUrl);
      console.log('[Video UI] Video generation process completed');

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred";
      console.error('[Video UI] Error:', errorMessage);
      setError(errorMessage);
    } finally {
      console.log('[Video UI] Cleaning up...');
      setIsGenerating(false);
      await updateVideoGenerationStatus(messageId, false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      <Button
        onClick={generateVideo}
        disabled={isGenerating}
        variant="outline"
        className="w-full"
      >
        {isGenerating ? "Generating Video..." : "Generate Video Explanation"}
      </Button>
      {status && status !== "success" && (
        <p className="text-sm text-yellow-500">Status: {status}</p>
      )}
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
} 