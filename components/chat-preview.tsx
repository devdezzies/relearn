"use client";

import { VideoPlayer } from "./ui/video-player";

interface Message {
  type: 'question' | 'answer';
  content: string;
  avatar: string;
}

export function ChatPreview() {
  const messages: Message[] = [
    {
      type: 'question',
      content: 'How does moving a charge produce light?',
      avatar: '🤔'
    },
    {
      type: 'answer',
      content: 'Moving charges disturb electric and magnetic fields — the disturbance travels as light.',
      avatar: '🎓'
    }
  ];

  return (
    <div className="flex flex-col gap-4 p-6 bg-white rounded-2xl shadow-xl">
      {/* Chat header with dots */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
        <div className="w-3 h-3 rounded-full bg-gray-300" />
      </div>

      {/* Messages */}
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => (
          <div 
            key={index} 
            className={`flex gap-2 items-start ${
              message.type === 'question' ? '' : 'flex-row-reverse'
            }`}
          >
            {/* Avatar */}
            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <span className="text-sm">{message.avatar}</span>
            </div>

            {/* Message bubble */}
            <div 
              className={`flex-1 max-w-[80%] p-4 rounded-2xl ${
                message.type === 'question' 
                  ? 'bg-gray-50' 
                  : 'bg-gray-50'
              }`}
            >
              <p className="text-sm text-gray-800">{message.content}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Demo Video */}
      <div className="relative">
        <VideoPlayer 
          src="https://tlxtnbjmkuwlafilbgfn.supabase.co/storage/v1/object/public/video//hello_world_PlotExceedsYRangeProblem_1748101319.mp4"
          className="w-full h-full"
        />
        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
      </div>
    </div>
  );
} 