import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Brain, LogOut, User } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { toast } = useToast();
  const { user, isLoading, isAuthenticated } = useAuth();
  const displayName = user?.firstName || user?.email?.split('@')[0] || 'User';

  const isActive = (path: string) => location === path;

  const handleSignOut = async () => {
    try {
      // Use Replit Auth signout
      window.location.href = "/api/logout";
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 bg-background/90 backdrop-blur-md z-50 border-b border-primary/30">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <div className="flex items-center cursor-pointer">
              <div className="text-primary mr-2">
                <Brain className="h-6 w-6" />
              </div>
              <h1 className="text-2xl font-bold font-sans text-white">
                <span className="text-primary">Dopa</span>meter
              </h1>
            </div>
          </Link>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <span className={`${isActive("/") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer`}>
              Home
            </span>
          </Link>
          <Link href="/trending">
            <span className={`${isActive("/trending") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer`}>
              Trending
            </span>
          </Link>
          <Link href="/leaderboard">
            <span className={`${isActive("/leaderboard") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer`}>
              Leaderboard
            </span>
          </Link>
          {isAuthenticated && (
            <Link href="/dashboard">
              <span className={`${isActive("/dashboard") ? "text-primary" : "text-white hover:text-primary"} transition cursor-pointer`}>
                Dashboard
              </span>
            </Link>
          )}
        </div>
        
        <div className="flex items-center space-x-3">
          {isAuthenticated ? (
            <>
              <div className="hidden md:block text-white mr-2">
                <span className="text-sm text-muted-foreground">Signed in as </span>
                <span className="text-sm font-medium">{displayName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white bg-primary/20 hover:bg-primary/30 flex items-center gap-2"
                onClick={handleSignOut}
              >
                <LogOut size={16} />
                <span className="hidden md:inline">Sign Out</span>
              </Button>
            </>
          ) : (
            <>
              <Link href="/api/login">
                <Button variant="ghost" className="text-white bg-primary/20 hover:bg-primary/30 glow-effect">
                  Sign In
                </Button>
              </Link>
              <Link href="/api/login">
                <Button className="text-white bg-gradient-to-r from-primary to-[#EC4899] hover:from-primary/90 hover:to-[#EC4899]/90 glow-effect">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
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
          {isAuthenticated && (
            <Link href="/dashboard">
              <div 
                className={`block py-2 ${isActive("/dashboard") ? "text-primary" : "text-white"} cursor-pointer`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Dashboard
              </div>
            </Link>
          )}
          {isAuthenticated && (
            <div className="py-2 mt-2 border-t border-muted/30">
              <div className="text-sm text-muted-foreground mb-2">
                Signed in as <span className="font-medium text-white">{displayName}</span>
              </div>
              <Button 
                variant="ghost" 
                size="sm"
                className="text-white bg-primary/20 hover:bg-primary/30 w-full justify-start"
                onClick={() => {
                  handleSignOut();
                  setMobileMenuOpen(false);
                }}
              >
                <LogOut size={16} className="mr-2" />
                Sign Out
              </Button>
            </div>
          )}
        </div>
      )}
    </nav>
  );
}
