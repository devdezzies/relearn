import React from 'react';

interface VideoSkeletonProps {
  className?: string;
}

export function VideoSkeleton({ className = "" }: VideoSkeletonProps) {
  return (
    <div className={`relative group ${className} animate-pulse`}>
      {/* Aspect ratio wrapper - matches VideoPlayer */}
      <div className="relative w-full rounded-lg overflow-hidden" style={{ paddingTop: '56.25%' }}>
        {/* Background for the video area */}
        <div className="absolute top-0 left-0 w-full h-full bg-gray-200 dark:bg-gray-800 rounded-lg">
          {/* Play button skeleton - centered within the aspect ratio wrapper */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="w-16 h-16 rounded-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
              <div className="w-8 h-8 rounded-sm bg-gray-400 dark:bg-gray-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Controls bar skeleton - matches VideoPlayer's control bar positioning */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/30 to-transparent p-4 rounded-b-lg">
        {/* Progress bar skeleton */}
        <div className="w-full h-1 bg-gray-400/50 dark:bg-gray-600/50 rounded-full mb-4" />
        
        {/* Controls skeleton */}
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Play button */}
            <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />
            {/* Volume button */}
            <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />
            {/* Time */}
            <div className="w-20 h-4 rounded bg-gray-400 dark:bg-gray-600" />
          </div>
          {/* Fullscreen button */}
          <div className="w-6 h-6 rounded-full bg-gray-400 dark:bg-gray-600" />
        </div>
      </div>
    </div>
  );
} 