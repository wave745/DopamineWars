import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => location === path;

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md z-50 border-b border-primary/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <div className="text-primary mr-2">
            <Brain className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold font-sans text-white">
            <span className="text-primary">Dopa</span>meter
          </h1>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`${isActive("/") ? "text-primary" : "text-white hover:text-primary"} transition`}>
              Home
            </a>
          </Link>
          <Link href="/trending">
            <a className={`${isActive("/trending") ? "text-primary" : "text-white hover:text-primary"} transition`}>
              Trending
            </a>
          </Link>
          <Link href="/leaderboard">
            <a className={`${isActive("/leaderboard") ? "text-primary" : "text-white hover:text-primary"} transition`}>
              Leaderboard
            </a>
          </Link>
        </div>
        
        <div className="flex items-center space-x-3">
          <Button variant="ghost" className="text-white bg-primary/20 hover:bg-primary/30 glow-effect">
            Sign In
          </Button>
          <Button className="text-white bg-gradient-to-r from-primary to-[#EC4899] hover:from-primary/90 hover:to-[#EC4899]/90 glow-effect">
            Sign Up
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
            <a 
              className={`block py-2 ${isActive("/") ? "text-primary" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </a>
          </Link>
          <Link href="/trending">
            <a 
              className={`block py-2 ${isActive("/trending") ? "text-primary" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Trending
            </a>
          </Link>
          <Link href="/leaderboard">
            <a 
              className={`block py-2 ${isActive("/leaderboard") ? "text-primary" : "text-white"}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </a>
          </Link>
        </div>
      )}
    </nav>
  );
}
