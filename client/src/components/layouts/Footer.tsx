import { Link } from "wouter";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { FaXTwitter } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="bg-muted border-t border-muted/50 pt-12 pb-6">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center mb-4">
              <div className="text-primary mr-2">
                <Brain className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold font-sans text-white">
                <span className="text-primary">Dopa</span>meter
              </h2>
            </div>
            
            <p className="text-muted-foreground mb-4">
              The dopamine index of the internet. Upload, vote, and watch the dopamine spike.
            </p>
            
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition">
                <FaXTwitter />
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/">
                  <span className="text-muted-foreground hover:text-primary transition cursor-pointer">Home</span>
                </Link>
              </li>
              <li>
                <Link href="/trending">
                  <span className="text-muted-foreground hover:text-primary transition cursor-pointer">Trending</span>
                </Link>
              </li>
              <li>
                <Link href="/leaderboard">
                  <span className="text-muted-foreground hover:text-primary transition cursor-pointer">Leaderboard</span>
                </Link>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition">About Us</a>
              </li>
              <li>
                <a href="#" className="text-muted-foreground hover:text-primary transition">FAQs</a>
              </li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">Newsletter</h3>
            <p className="text-muted-foreground mb-4">Get dopamine-inducing updates directly to your inbox.</p>
            
            <form className="mb-2">
              <div className="flex">
                <Input 
                  type="email" 
                  placeholder="Your email" 
                  className="rounded-r-none focus:ring-primary"
                />
                <Button className="rounded-l-none">Subscribe</Button>
              </div>
            </form>
            
            <p className="text-xs text-muted-foreground">
              By subscribing, you agree to our <a href="#" className="text-primary hover:underline">Privacy Policy</a>.
            </p>
          </div>
        </div>
        
        <div className="border-t border-muted/50 pt-6 text-center">
          <p className="text-muted-foreground text-sm">
            &copy; {new Date().getFullYear()} Dopameter. All rights reserved. The dopamine index of the internet.
          </p>
        </div>
      </div>
    </footer>
  );
}
