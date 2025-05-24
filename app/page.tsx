import Hero from "@/components/hero";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default async function Home() {
  return (
    <>
      <Hero />
      <main className="flex-1 flex flex-col items-center px-4 max-w-4xl mx-auto mb-16">
        <div className="flex flex-col items-center gap-8 w-full max-w-md">
          <Link href="/sign-up" className="w-full">
            <Button className="group w-full py-6 text-lg" size="lg">
              Get Started 
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </Link>

          <p className="text-center text-muted-foreground">
            Built for the Alibaba GenAI Hackathon 2023
          </p>
        </div>
      </main>
    </>
  );
}
