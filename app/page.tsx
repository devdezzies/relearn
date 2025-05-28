import { Button } from "@/components/ui/button";
import Link from "next/link";
import { DemoSection } from "@/components/demo-section";
import { ChatPreview } from "@/components/chat-preview";
import { FeaturesGrid } from "@/components/features-grid";
import { LinkedinIcon, TwitterIcon, YoutubeIcon, InstagramIcon } from "lucide-react";
import { PricingSection } from "@/components/pricing-section";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="flex items-center px-6 py-4">
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-2xl font-serif">ReLearn</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="#use-cases" className="text-gray-600 hover:text-gray-900">Use cases</Link>
            <Link href="#community" className="text-gray-600 hover:text-gray-900">Community</Link>
            <Link href="#benchmarks" className="text-gray-600 hover:text-gray-900">Benchmarks</Link>
            <Link href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</Link>
          </nav>
        </div>
        <div className="flex-1"></div>
        <div className="flex items-center gap-4">
          <Link href="/auth/login">
            <Button variant="ghost" className="text-base">
              Log in
            </Button>
          </Link>
          <Link href="/auth/signup">
            <Button variant="default" className="text-base bg-black hover:bg-gray-800">
              Get Started
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="text-center max-w-4xl mx-auto space-y-8">
          <h1 className="text-6xl sm:text-7xl font-serif leading-tight">
            Empower Your Learning Journey
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Your personal AI learning companion that adapts to your unique style. 
            Master any subject, boost your confidence, and achieve academic excellence 
            with personalized support available 24/7.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
            <Link href="/auth/signup">
              <Button className="text-lg px-8 py-6 bg-black hover:bg-gray-800 min-w-[200px]">
                Start Learning
              </Button>
            </Link>
            <DemoSection />
          </div>
        </div>

        {/* Preview Section */}
        <div className="mt-16 w-full max-w-5xl mx-auto">
          <div className="relative aspect-video rounded-lg overflow-hidden shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-50 to-blue-50 opacity-50" />
            <div className="relative z-10 h-full">
              <ChatPreview />
            </div>
          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">
              Your AI-Powered Learning Companion
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Experience personalized learning with our advanced AI features: smart tutoring, video lessons, adaptive quizzes, and long-term memory that grows with you.
            </p>
          </div>
          
          <FeaturesGrid />
        </div>
      </section>

      {/* Use Cases Section */}
      <section id="use-cases" className="py-24">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-serif mb-4">
              Built for every learning style
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Whether you're a visual learner, prefer hands-on practice, or learn through discussion,
              ReLearn adapts to your needs.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                title: "Visual Learning",
                description: "Transform complex concepts into clear, intuitive visualizations.",
                icon: "🎨"
              },
              {
                title: "Interactive Practice",
                description: "Learn by doing with hands-on exercises and real-time feedback.",
                icon: "🔨"
              },
              {
                title: "Collaborative Learning",
                description: "Share knowledge and learn together with built-in collaboration tools.",
                icon: "👥"
              }
            ].map((item, index) => (
              <div key={index} className="p-6 rounded-2xl bg-white shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="text-3xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-medium mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <PricingSection />

      {/* Footer */}
      <footer className="border-t py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
            {/* Logo and Description */}
            <div className="space-y-4">
              <Link href="/" className="flex items-center gap-2">
                <span className="text-2xl font-serif">ReLearn</span>
              </Link>
              <p className="text-sm text-gray-600 mt-4">
                ReLearn, derived from the Latin word for "learn",
                is a general AI agent that turns your thoughts into actions.
              </p>
              <p className="text-sm text-gray-500">© {new Date().getFullYear()} ReLearn AI</p>
            </div>

            {/* Community Links */}
            <div>
              <h3 className="font-medium mb-4">Community</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/events" className="text-sm text-gray-600 hover:text-gray-900">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="/campus" className="text-sm text-gray-600 hover:text-gray-900">
                    Campus
                  </Link>
                </li>
                <li>
                  <Link href="/fellows" className="text-sm text-gray-600 hover:text-gray-900">
                    Fellows
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Links */}
            <div>
              <h3 className="font-medium mb-4">Company</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/feedback" className="text-sm text-gray-600 hover:text-gray-900">
                    Feedback
                  </Link>
                </li>
                <li>
                  <Link href="/media" className="text-sm text-gray-600 hover:text-gray-900">
                    Media inquiries
                  </Link>
                </li>
                <li>
                  <Link href="/contact" className="text-sm text-gray-600 hover:text-gray-900">
                    Contact us
                  </Link>
                </li>
              </ul>
            </div>

            {/* Resources Links */}
            <div>
              <h3 className="font-medium mb-4">Resources</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/privacy" className="text-sm text-gray-600 hover:text-gray-900">
                    Privacy policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-sm text-gray-600 hover:text-gray-900">
                    Terms of service
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Social Links */}
          <div className="flex gap-6 items-center">
            <Link href="https://linkedin.com" className="text-gray-600 hover:text-gray-900">
              <LinkedinIcon size={20} />
            </Link>
            <Link href="https://twitter.com" className="text-gray-600 hover:text-gray-900">
              <TwitterIcon size={20} />
            </Link>
            <Link href="https://youtube.com" className="text-gray-600 hover:text-gray-900">
              <YoutubeIcon size={20} />
            </Link>
            <Link href="https://instagram.com" className="text-gray-600 hover:text-gray-900">
              <InstagramIcon size={20} />
            </Link>
          </div>

          {/* Motto */}
          <div className="mt-12 text-center">
            <p className="text-gray-500 italic">"Less structure, more intelligence."</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
