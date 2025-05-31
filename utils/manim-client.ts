import OpenAI from "openai";

// Function to generate educational video from prompt
export async function generateEducationalVideo(prompt: string) {
  try {
    console.log(`[Video Generation] Starting video generation for prompt: ${prompt}`);

    const response = await fetch("http://0.0.0.0:5050/video", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: `${Date.now()}`,
        prompt
      }),
    });

    if (!response.ok) {
      console.error('[Video Generation] Error: Video generation request failed');
      throw new Error("Failed to generate video");
    }

    const { status, video_url } = await response.json();

    if (status !== "success" || !video_url) {
      console.error('[Video Generation] Error: Video generation failed');
      throw new Error("Video generation failed");
    }

    // Remove the @ symbol if it exists at the start of the URL
    const cleanVideoUrl = video_url.startsWith('@') ? video_url.substring(1) : video_url;
    console.log('[Video Generation] Process completed successfully');

    return {
      videoUrl: cleanVideoUrl,
      status
    };
  } catch (error) {
    console.error("[Video Generation] Error in video generation:", error);
    throw error;
  }
}

export default generateEducationalVideo;