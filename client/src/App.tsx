import React, { useEffect } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Trending from "@/pages/trending";
import Leaderboard from "@/pages/leaderboard";
import Navbar from "@/components/layouts/Navbar";
import Footer from "@/components/layouts/Footer";
import { useAuth } from "@/hooks/useAuth";

type ProtectedRouteProps = {
  component: React.ComponentType<any>;
  requiredAuth?: boolean;
};

// Custom route component that handles redirects based on auth state
const ProtectedRoute = ({ component: Component, requiredAuth = true }: ProtectedRouteProps) => {
  const [, setLocation] = useLocation();
  const { isAuthenticated, isLoading } = useAuth();
  
  useEffect(() => {
    if (isLoading) return;
    
    // If authentication is required and user is not logged in
    if (requiredAuth && !isAuthenticated) {
      // Redirect to Replit login
      window.location.href = "/api/login";
    }
    
    // If user is logged in but trying to access a page that doesn't require auth
    if (!requiredAuth && isAuthenticated) {
      setLocation('/dashboard');
    }
  }, [isAuthenticated, isLoading, setLocation, requiredAuth]);
  
  // Show loading state while checking authentication
  if (isLoading) {
    return <div className="flex items-center justify-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>;
  }
  
  // Render the component only if auth requirements are met
  if (requiredAuth && !isAuthenticated) return null;
  if (!requiredAuth && isAuthenticated) return null;
  
  return <Component />;
};

function App() {
  const { isLoading } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            {isLoading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/trending" component={Trending} />
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/dashboard">
                  {() => <ProtectedRoute component={Home} requiredAuth={true} />}
                </Route>
                <Route component={NotFound} />
              </Switch>
            )}
          </main>
          <Footer />
        </div>
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
