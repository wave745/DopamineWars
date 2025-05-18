import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { TimeFrame, LeaderboardEntry } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

export default function LeaderboardTable() {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>("daily");

  const { data: leaderboardData, isLoading } = useQuery({
    queryKey: [`/api/leaderboard/${timeFrame}`],
  });

  const emojiColor = (emoji: string) => {
    switch (emoji) {
      case '😐': return 'text-gray-400';
      case '😊': return 'text-blue-400';
      case '😄': return 'text-[#FBBF24]';
      case '🤯': return 'text-[#8B5CF6]';
      case '🔥': return 'text-[#EF4444]';
      default: return 'text-white';
    }
  };

  const rankColor = (rank: number) => {
    if (rank === 1) return "text-[#EC4899]";
    if (rank === 2) return "text-[#FBBF24]";
    if (rank === 3) return "text-[#8B5CF6]";
    return "text-white";
  };

  const typeColor = (type: string) => {
    switch (type) {
      case 'meme': return 'bg-[#EC4899]/20 text-[#EC4899]';
      case 'video': return 'bg-primary/20 text-primary';
      case 'tweet': return 'bg-[#10B981]/20 text-[#10B981]';
      case 'image': return 'bg-[#8B5CF6]/20 text-[#8B5CF6]';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold font-sans">
            <span className="text-[#10B981]">Dopamine</span> Leaderboard
          </h2>
          
          <div className="flex space-x-3">
            <Button 
              variant={timeFrame === "daily" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setTimeFrame("daily")}
            >
              Daily
            </Button>
            <Button 
              variant={timeFrame === "weekly" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setTimeFrame("weekly")}
            >
              Weekly
            </Button>
            <Button 
              variant={timeFrame === "monthly" ? "default" : "secondary"} 
              size="sm" 
              className="rounded-full" 
              onClick={() => setTimeFrame("monthly")}
            >
              Monthly
            </Button>
          </div>
        </div>
        
        <div className="overflow-hidden rounded-xl bg-muted/30 backdrop-blur-sm border border-muted/50">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rank</TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Content</TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Type</TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Rating</TableHead>
                <TableHead className="text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Votes</TableHead>
                <TableHead className="text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody className="bg-background divide-y divide-muted/30">
              {isLoading ? (
                // Loading skeleton
                [...Array(5)].map((_, i) => (
                  <TableRow key={i} className="hover:bg-muted/20 transition">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-6 rounded bg-muted animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded bg-muted animate-pulse mr-3"></div>
                        <div className="h-4 w-32 bg-muted animate-pulse"></div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-16 rounded-full bg-muted animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="h-6 w-12 bg-muted animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="h-4 w-10 bg-muted animate-pulse"></div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="h-4 w-8 bg-muted animate-pulse ml-auto"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : leaderboardData && leaderboardData.length > 0 ? (
                leaderboardData.map((item: LeaderboardEntry) => (
                  <TableRow key={item.id} className="hover:bg-muted/20 transition">
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-lg font-sans font-bold ${rankColor(item.rank)}`}>
                        #{item.rank}
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 rounded overflow-hidden mr-3">
                          <img 
                            src={item.url} 
                            alt="Content thumbnail" 
                            className="h-full w-full object-cover"
                            loading="lazy"
                          />
                        </div>
                        <div className="text-sm text-white truncate max-w-xs">
                          Content #{item.id}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs rounded-full ${typeColor(item.type)}`}>
                        {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                      </span>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="text-lg mr-1">{item.topEmoji}</span>
                        <span className={`font-medium ${emojiColor(item.topEmoji)}`}>
                          {item.averageRating.toFixed(1)}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      {item.totalVotes.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <Link href={`/content/${item.id}`}>
                        <a className="text-primary hover:text-[#EC4899]">View</a>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="px-6 py-4 text-center text-muted-foreground">
                    No data available
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </section>
  );
}
