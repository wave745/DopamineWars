import { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Brain } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Auth() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const { error } = await supabase.auth.signInWithOtp({ 
        email,
        options: {
          emailRedirectTo: window.location.origin,
        }
      });
      
      if (error) {
        throw error;
      }
      
      toast({
        title: "Check your email",
        description: "We've sent you a magic link to sign in!",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "An error occurred during login",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <Card className="w-full max-w-md bg-muted/30 backdrop-blur-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="text-primary">
              <Brain className="h-12 w-12" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold">
            Welcome to <span className="text-primary">Dopa</span>meter
          </CardTitle>
          <CardDescription className="mt-2">
            Sign in to upload, vote, and track dopamine spikes
          </CardDescription>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Email</label>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                className="bg-muted/50"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full bg-gradient-to-r from-primary to-[#EC4899] text-white"
              disabled={loading}
            >
              {loading ? 'Sending link...' : 'Send Magic Link'}
            </Button>
          </form>
        </CardContent>
        
        <CardFooter className="text-center text-xs text-muted-foreground">
          By signing in, you agree to the terms and privacy policy.
          <br />
          We'll send you a secure, one-time login link.
        </CardFooter>
      </Card>
    </div>
  );
}