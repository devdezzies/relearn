interface VideoPlayerProps {
  videoUrl: string;
  className?: string;
}

export function VideoPlayer({ videoUrl, className = "" }: VideoPlayerProps) {
  if (!videoUrl) return null;

  // Remove @ symbol if it exists at the start of the URL
  const cleanVideoUrl = videoUrl.startsWith('@') ? videoUrl.substring(1) : videoUrl;

  return (
    <div className={`relative aspect-video w-full overflow-hidden rounded-lg ${className}`}>
      <video
        src={cleanVideoUrl}
        controls
        className="h-full w-full"
        preload="metadata"
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
} 