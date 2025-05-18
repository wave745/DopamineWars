import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { ContentUploader } from '@/components/content/ContentUploader';
import ContentGrid from '@/components/content/ContentGrid';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function Dashboard({ session }) {
  const [userUploads, setUserUploads] = useState([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchUserUploads();
  }, [session]);
  
  async function fetchUserUploads() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('posts')
        .select('*')
        .eq('user_id', session.user.id)
        .order('created_at', { ascending: false });
        
      if (error) {
        throw error;
      }
      
      setUserUploads(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load your uploads",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }
  
  async function handleSignOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while signing out",
        variant: "destructive",
      });
    }
  }
  
  return (
    <div className="container mx-auto px-4 pt-24 pb-16">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">
            Welcome, <span className="text-primary">{session.user.email.split('@')[0]}</span>
          </h1>
          <p className="text-muted-foreground">
            Upload content, vote, and track dopamine spikes
          </p>
        </div>
        
        <Button 
          variant="ghost" 
          className="flex items-center gap-2"
          onClick={handleSignOut}
        >
          <LogOut size={16} />
          Sign Out
        </Button>
      </div>
      
      <Card className="mb-8 bg-muted/30">
        <CardHeader>
          <CardTitle>Upload New Content</CardTitle>
        </CardHeader>
        <CardContent>
          <ContentUploader session={session} onSuccess={fetchUserUploads} />
        </CardContent>
      </Card>
      
      <div className="mb-12">
        <h2 className="text-xl md:text-2xl font-bold mb-4">
          Your <span className="text-[#EC4899]">Uploads</span>
        </h2>
        
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-muted/50 rounded-xl h-64 animate-pulse"></div>
            ))}
          </div>
        ) : userUploads.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {userUploads.map((content) => (
              <div key={content.id} className="bg-muted/50 rounded-xl overflow-hidden border border-muted/50">
                <img 
                  src={content.content_url} 
                  alt="Content" 
                  className="w-full h-40 object-cover"
                />
                <div className="p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">
                      {new Date(content.created_at).toLocaleDateString()}
                    </span>
                    <span className="px-2 py-1 bg-primary/20 rounded-full text-primary text-xs">
                      {content.category || 'image'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 bg-muted/20 rounded-xl">
            <p className="text-muted-foreground">You haven't uploaded any content yet.</p>
          </div>
        )}
      </div>
      
      <ContentGrid title="Trending" accentColor="#FBBF24" />
    </div>
  );
}