import { useState, useEffect } from "react";
import { Switch, Route, useLocation, useRouter } from "wouter";
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
import Auth from "@/components/auth/Auth";
import Dashboard from "@/components/dashboard/Dashboard";
import { supabase } from "@/lib/supabaseClient";

// Custom route component that handles redirects based on auth state
const ProtectedRoute = ({ component: Component, session, requiredAuth = true }) => {
  const [, navigate] = useRouter();
  
  useEffect(() => {
    // If authentication is required and user is not logged in
    if (requiredAuth && !session) {
      navigate('/login');
    }
    
    // If user is logged in but trying to access login page
    if (!requiredAuth && session) {
      navigate('/dashboard');
    }
  }, [session, navigate, requiredAuth]);
  
  // Render the component only if auth requirements are met
  if (requiredAuth && !session) return null;
  if (!requiredAuth && session) return null;
  
  return <Component session={session} />;
};

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session check
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <div className="flex flex-col min-h-screen">
          <Navbar session={session} />
          <main className="flex-grow">
            {loading ? (
              <div className="flex items-center justify-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            ) : (
              <Switch>
                <Route path="/" component={Home} />
                <Route path="/trending" component={Trending} />
                <Route path="/leaderboard" component={Leaderboard} />
                <Route path="/login">
                  {() => <ProtectedRoute component={Auth} session={session} requiredAuth={false} />}
                </Route>
                <Route path="/dashboard">
                  {() => <ProtectedRoute component={Dashboard} session={session} requiredAuth={true} />}
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
