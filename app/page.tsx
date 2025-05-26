import { Button } from "@/components/ui/button";
import { Play } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { DemoSection } from "@/components/demo-section";
import { ChatPreview } from "@/components/chat-preview";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-6 py-4 border-b">
        <Link href="/" className="text-2xl font-serif">
          ReLearn
        </Link>
        <div className="flex gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-base">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="default" className="text-base bg-black hover:bg-gray-800">
              Get ReLearn Free
            </Button>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 grid lg:grid-cols-2 gap-8 px-6 py-12 max-w-7xl mx-auto w-full">
        {/* Left Column */}
        <div className="flex flex-col justify-center space-y-8">
          <h1 className="text-5xl sm:text-6xl font-serif leading-tight">
            Learn Better Through Visuals.
          </h1>
          
          <p className="text-xl text-gray-600 max-w-lg">
            Type a learning prompt. Watch it come to life with clean, beautiful animations.
          </p>

          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/auth/signup" className="flex-none">
              <Button className="w-full sm:w-auto text-lg px-8 py-6 bg-black hover:bg-gray-800">
                Start Visualizing
              </Button>
            </Link>
            <DemoSection />
          </div>
        </div>

        {/* Right Column */}
        <div className="relative flex items-center justify-center lg:justify-end">
          <div className="relative w-full max-w-lg aspect-square">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 rounded-full blur-3xl opacity-50" />
            <div className="relative z-10 h-full">
              <ChatPreview />
            </div>
          </div>
        </div>
      </main>

      {/* Demo Section */}
      <section id="demo" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <h2 className="text-3xl font-serif text-center mb-12">
            Transform Complex Topics into Clear Visuals
          </h2>
          {/* Add demo content here */}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2024 ReLearn. All rights reserved.
          </p>
          <div className="flex gap-6">
            <Link href="/terms" className="text-sm text-gray-500 hover:text-gray-900">
              Terms of use
            </Link>
            <Link href="/privacy" className="text-sm text-gray-500 hover:text-gray-900">
              Privacy policy
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
