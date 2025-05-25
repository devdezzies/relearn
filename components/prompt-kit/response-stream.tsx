"use client";

import { ResponseStream } from "@/components/ui/response-stream";

export function ResponseStreamTypewriter({ text }: { text: string }) {
  return (
    <div className="w-full min-w-full">
      <ResponseStream
        textStream={text}
        mode="typewriter"
        speed={20}
        className="text-sm"
      />
    </div>
  );
}

export { ResponseStream };
