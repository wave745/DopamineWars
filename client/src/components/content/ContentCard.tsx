import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Content } from "@/types";
import { Bookmark, Share2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface ContentCardProps {
  content: Content;
}

export default function ContentCard({ content }: ContentCardProps) {
  const [saved, setSaved] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const getTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    
    if (diffInSeconds < 60) return `${diffInSeconds} seconds ago`;
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return `${Math.floor(diffInSeconds / 86400)} days ago`;
  };

  const getEmojiColor = (emoji: string) => {
    switch (emoji) {
      case '😐': return 'text-gray-400';
      case '😊': return 'text-blue-400';
      case '😄': return 'text-[#FBBF24]';
      case '🤯': return 'text-[#8B5CF6]';
      case '🔥': return 'text-[#EF4444]';
      default: return 'text-white';
    }
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const action = saved ? 'unsave' : 'save';
      await apiRequest('POST', `/api/content/${content.id}/${action}`, {});
      return { success: true, saved: !saved };
    },
    onSuccess: (data) => {
      setSaved(data.saved);
      toast({
        title: data.saved ? "Content saved" : "Content unsaved",
        description: data.saved 
          ? "This content has been added to your favorites" 
          : "This content has been removed from your favorites",
      });
    },
  });

  const shareMutation = useMutation({
    mutationFn: async () => {
      await apiRequest('POST', `/api/content/${content.id}/share`, {});
      return { success: true };
    },
    onSuccess: () => {
      // Copy to clipboard
      navigator.clipboard.writeText(window.location.origin + `/content/${content.id}`);
      toast({
        title: "Link copied!",
        description: "Share link has been copied to clipboard",
      });
    },
  });

  const handleSave = () => {
    saveMutation.mutate();
  };

  const handleShare = () => {
    shareMutation.mutate();
  };

  return (
    <Card className="content-card bg-muted/50 rounded-xl overflow-hidden border border-muted/50 hover:border-primary/50 transition-all">
      <div className="relative">
        <img 
          src={content.url} 
          alt={`${content.type} content`} 
          className="w-full h-48 object-cover"
          loading="lazy"
        />
        <div className="absolute top-2 right-2 bg-background/80 text-white text-xs py-1 px-2 rounded-full">
          {content.type.charAt(0).toUpperCase() + content.type.slice(1)}
        </div>
      </div>
      
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex space-x-1 items-center">
            <span className="text-2xl">{content.topEmoji}</span>
            <span className={`font-sans font-bold text-lg ${getEmojiColor(content.topEmoji)}`}>
              {content.averageRating.toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {content.totalVotes.toLocaleString()} votes
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <div className="flex space-x-2">
            <button 
              className={`text-${saved ? 'primary' : 'white/70'} hover:text-${saved ? 'primary/80' : 'white'}`}
              onClick={handleSave}
              disabled={saveMutation.isPending}
            >
              <Bookmark className={saved ? "fill-primary" : ""} size={18} />
            </button>
            <button 
              className="text-white/70 hover:text-white"
              onClick={handleShare}
              disabled={shareMutation.isPending}
            >
              <Share2 size={18} />
            </button>
          </div>
          <span className="text-xs text-muted-foreground">
            {getTimeAgo(content.createdAt)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
