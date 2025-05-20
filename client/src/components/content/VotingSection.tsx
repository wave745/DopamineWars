import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Content, EmojiRating } from "@/types";
import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { useIsMobile } from "@/hooks/use-mobile";

interface VotingSectionProps {
  content?: Content;
}

export default function VotingSection({ content: initialContent }: VotingSectionProps) {
  const [selectedEmoji, setSelectedEmoji] = useState<EmojiRating | null>(null);
  const [currentContentIndex, setCurrentContentIndex] = useState(0);
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const isMobile = useIsMobile();
  
  // Fetch all content
  const { data: allContents = [] } = useQuery<Content[]>({
    queryKey: ['/api/content'],
    refetchInterval: 30000, // Refresh content every 30 seconds
  });
  
  const content = allContents.length > 0 ? allContents[currentContentIndex] : initialContent;
  
  // Handle carousel change
  const handleCarouselChange = (index: number) => {
    setCurrentContentIndex(index);
    setSelectedEmoji(null); // Reset selected emoji when content changes
  };
  
  // Change content every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      if (allContents.length > 0) {
        setCurrentContentIndex(prevIndex => 
          prevIndex >= allContents.length - 1 ? 0 : prevIndex + 1
        );
        
        toast({
          title: "Showing new content",
          description: "Content refreshes every 30 seconds",
          duration: 3000,
        });
      }
    }, 30000); // 30 seconds
    
    return () => clearInterval(interval);
  }, [allContents, toast]);

  const emojis: { emoji: EmojiRating; label: string }[] = [
    { emoji: "😐", label: "Mid" },
    { emoji: "😊", label: "Mild" },
    { emoji: "😄", label: "Solid" },
    { emoji: "🤯", label: "Brain melt" },
    { emoji: "🔥", label: "Liquidation" },
  ];

  const voteMutation = useMutation({
    mutationFn: async (emoji: EmojiRating) => {
      if (!content) return null;
      
      const response = await apiRequest('POST', `/api/content/${content.id}/vote`, { emoji });
      const data = await response.json();
      return data;
    },
    onSuccess: (data) => {
      if (!data) return;
      
      queryClient.invalidateQueries({
        queryKey: [`/api/content/${content?.id}`],
      });
      
      queryClient.invalidateQueries({
        queryKey: ['/api/content'],
      });
      
      toast({
        title: "Vote recorded!",
        description: `You rated this content as ${selectedEmoji}`,
      });
      
      setSelectedEmoji(null);
    },
  });

  const handleVote = (emoji: EmojiRating) => {
    setSelectedEmoji(emoji);
    voteMutation.mutate(emoji);
  };

  if (!content) {
    return (
      <div className="py-8 mb-12 bg-muted/20 rounded-xl">
        <div className="container mx-auto px-4 text-center py-12">
          <p className="text-muted-foreground">Select content to vote on</p>
        </div>
      </div>
    );
  }

  return (
    <section className="py-8 mb-12 bg-muted/20 rounded-xl">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-sans mb-6 text-center">
          Rate the <span className="text-[#EC4899]">Dopamine</span> Hit
        </h2>
        
        <p className="text-center text-muted-foreground mb-4">
          {isMobile ? "Swipe left or right" : "Use the arrows"} to see more content
        </p>
        
        <div className="max-w-4xl mx-auto">
          {allContents.length > 0 ? (
            <Carousel
              className="w-full"
              onSelect={handleCarouselChange}
              defaultIndex={currentContentIndex}
              opts={{
                loop: true,
                align: "center",
              }}
            >
              <CarouselContent>
                {allContents.map((item, index) => (
                  <CarouselItem key={item.id}>
                    <div className="p-1">
                      <Card className="bg-muted rounded-xl overflow-hidden mb-6">
                        <img 
                          src={item.url} 
                          alt={`Content ${item.id}`}
                          className="w-full object-cover max-h-96"
                        />
                      </Card>
                      
                      <Card className="bg-muted/50 rounded-xl">
                        <CardContent className="p-6 text-center">
                          <h3 className="text-xl font-medium mb-4">
                            How dopamine-inducing is this?
                          </h3>
                          
                          <div className="flex justify-center space-x-4 md:space-x-8 mb-6">
                            {emojis.map(({ emoji, label }) => (
                              <button 
                                key={emoji}
                                className={`emoji-btn flex flex-col items-center transition transform 
                                  hover:scale-110 active:scale-95 ${selectedEmoji === emoji ? 'scale-110 text-primary' : ''}`}
                                onClick={() => handleVote(emoji)}
                                disabled={voteMutation.isPending}
                              >
                                <span className="text-4xl mb-2">{emoji}</span>
                                <span className="text-xs text-muted-foreground">{label}</span>
                              </button>
                            ))}
                          </div>
                          
                          <p className="text-muted-foreground text-sm max-w-md mx-auto">
                            Your vote helps build the Dopamine Index. Content #{item.id} - {item.type}
                          </p>
                        </CardContent>
                      </Card>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              
              <div className="flex justify-center mt-6 space-x-4">
                <CarouselPrevious className="static transform-none" />
                <CarouselNext className="static transform-none" />
              </div>
            </Carousel>
          ) : (
            <>
              <Card className="bg-muted rounded-xl overflow-hidden mb-6">
                <img 
                  src={content?.url} 
                  alt="Content to rate" 
                  className="w-full object-cover max-h-96"
                />
              </Card>
              
              <Card className="bg-muted/50 rounded-xl">
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-medium mb-4">How dopamine-inducing is this content?</h3>
                  
                  <div className="flex justify-center space-x-4 md:space-x-8 mb-6">
                    {emojis.map(({ emoji, label }) => (
                      <button 
                        key={emoji}
                        className="emoji-btn flex flex-col items-center transition transform hover:scale-110 active:scale-95"
                        onClick={() => handleVote(emoji)}
                        disabled={voteMutation.isPending}
                      >
                        <span className="text-4xl mb-2">{emoji}</span>
                        <span className="text-xs text-muted-foreground">{label}</span>
                      </button>
                    ))}
                  </div>
                  
                  <p className="text-muted-foreground text-sm max-w-md mx-auto">
                    Your vote helps build the Dopamine Index. Rate content based on how it makes your brain feel!
                  </p>
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
