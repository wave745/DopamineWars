import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { Link } from "wouter";

export default function HeroSection() {
  // Animation for emoji elements
  const [emojis] = useState<string[]>(["😐", "😊", "😄", "🤯", "🔥"]);
  
  return (
    <section className="py-12 md:py-20 text-center relative overflow-hidden">
      <div className="absolute inset-0 -z-10 opacity-30">
        {/* Abstract neural network background pattern */}
        <div className="h-full w-full bg-gradient-to-br from-[#8B5CF6]/10 to-primary/10"></div>
      </div>
      
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-6xl font-bold font-sans leading-tight mb-6">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-[#EC4899]">
            The dopamine wars are real
          </span>
          <br />
          <span className="text-white">and we're here to measure them.</span>
        </h1>
        
        <p className="text-muted-foreground text-xl md:text-2xl mb-8">
          Upload. Vote. Watch the dopamine spike.
        </p>
        
        <div className="flex flex-wrap justify-center gap-4">
          <Link href="/trending">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-primary to-[#EC4899] text-white px-8 py-3 
                         shadow-lg hover:shadow-[#EC4899]/50 transition transform hover:-translate-y-1"
            >
              Upload Content
            </Button>
          </Link>
          <Link href="/trending">
            <Button 
              variant="secondary" 
              size="lg"
              className="px-8 py-3 shadow-lg hover:shadow-primary/50 
                       transition transform hover:-translate-y-1"
            >
              Explore Trending
            </Button>
          </Link>
        </div>
        
        <div className="mt-12 flex justify-center">
          <div className="flex space-x-8 text-2xl md:text-3xl">
            {emojis.map((emoji, index) => (
              <div 
                key={emoji} 
                className="animate-pulse" 
                style={{ animationDelay: `${index * 0.2}s`, animationDuration: '2s' }}
              >
                {emoji}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
