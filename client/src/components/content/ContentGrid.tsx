import { useState } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Content, ContentType } from "@/types";
import ContentCard from "./ContentCard";
import { useQuery } from "@tanstack/react-query";

interface ContentGridProps {
  title: string;
  accentColor: string;
}

export default function ContentGrid({ title, accentColor }: ContentGridProps) {
  const [contentType, setContentType] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('popular');

  const { data: contents, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } = useQuery({
    queryKey: [`/api/content`, contentType, sortBy],
  });

  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-sans">
            <span className={`text-[${accentColor}]`}>{title}</span> Content
          </h2>
          
          <div className="flex space-x-3">
            <Select value={contentType} onValueChange={setContentType}>
              <SelectTrigger className="bg-muted text-white text-sm p-2 rounded-lg border border-muted/50 w-[140px] h-9">
                <SelectValue placeholder="All Content" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Content</SelectItem>
                <SelectItem value="meme">Memes</SelectItem>
                <SelectItem value="video">Videos</SelectItem>
                <SelectItem value="tweet">Tweets</SelectItem>
                <SelectItem value="image">Images</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-muted/50 w-9 h-9 p-0 rounded-lg">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 m-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
                </svg>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Most Popular</SelectItem>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="rating">Highest Rating</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="bg-muted/50 rounded-xl h-72 animate-pulse"></div>
            ))}
          </div>
        ) : contents && contents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {contents.map((content: Content) => (
              <ContentCard key={content.id} content={content} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No content available.</p>
          </div>
        )}
        
        <div className="mt-8 text-center">
          <Button 
            variant="outline"
            onClick={() => fetchNextPage()}
            disabled={!hasNextPage || isFetchingNextPage}
            className="px-6 py-2.5 bg-gradient-to-r from-primary/20 to-[#EC4899]/20 
                     text-white hover:from-primary/30 hover:to-[#EC4899]/30 transition"
          >
            {isFetchingNextPage
              ? "Loading more..."
              : hasNextPage
              ? "Load more content"
              : "No more content"}
          </Button>
        </div>
      </div>
    </section>
  );
}
