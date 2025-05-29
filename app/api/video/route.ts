import { NextRequest, NextResponse } from "next/server";
import { generateEducationalVideo } from "@/utils/manim-client";

export async function POST(req: NextRequest) {
  try {
    console.log('[Video API] Received video generation request');
    const { topic, complexity } = await req.json();
    console.log(`[Video API] Topic: ${topic}, Complexity: ${complexity}`);

    if (!topic || !complexity) {
      console.error('[Video API] Missing required fields');
      return NextResponse.json(
        { error: "Missing required fields: topic and complexity" },
        { status: 400 }
      );
    }

    if (!["beginner", "intermediate", "advanced"].includes(complexity)) {
      console.error('[Video API] Invalid complexity level:', complexity);
      return NextResponse.json(
        { error: "Invalid complexity level. Must be one of: beginner, intermediate, advanced" },
        { status: 400 }
      );
    }

    console.log('[Video API] Starting video generation process...');
    const result = await generateEducationalVideo(topic, complexity);
    console.log('[Video API] Video generation completed successfully');

    return NextResponse.json(result);
  } catch (error) {
    console.error("[Video API] Error in video generation:", error);
    return NextResponse.json(
      { error: "Failed to generate video" },
      { status: 500 }
    );
  }
} 