import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import BrainLogo from "@/components/ui/brain-logo";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md z-50 border-b border-primary/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-primary mr-2">
                <BrainLogo size={24} />
              </div>
              <h1 className="text-2xl font-bold font-sans text-white">
                <span className="text-primary">Dopa</span>meter
              </h1>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className={`${isActive("/") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer nav-link`}>
              Home
            </span>
          </Link>
          <Link href="/trending">
            <span className={`${isActive("/trending") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer nav-link`}>
              Trending
            </span>
          </Link>
          <Link href="/leaderboard">
            <span className={`${isActive("/leaderboard") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer nav-link`}>
              Leaderboard
            </span>
          </Link>
          <Link href="/roadmap">
            <span className={`${isActive("/roadmap") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer nav-link`}>
              Roadmap
            </span>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button 
            variant="ghost" 
            className="bg-primary/20 hover:bg-primary/30 text-white"
          >
            <Link href="/trending">
              Explore Content
            </Link>
          </Button>
          <Button 
            variant="ghost" 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </Button>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-background/95 backdrop-blur-md p-4">
          <Link href="/">
            <div 
              className={`block py-2 ${isActive("/") ? "text-primary" : "text-white"} cursor-pointer`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </div>
          </Link>
          <Link href="/trending">
            <div 
              className={`block py-2 ${isActive("/trending") ? "text-primary" : "text-white"} cursor-pointer`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </div>
          </Link>
          <Link href="/leaderboard">
            <div 
              className={`block py-2 ${isActive("/leaderboard") ? "text-primary" : "text-white"} cursor-pointer`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </div>
          </Link>
          <Link href="/roadmap">
            <div 
              className={`block py-2 ${isActive("/roadmap") ? "text-primary" : "text-white"} cursor-pointer`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Roadmap
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
