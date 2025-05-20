import HeroSection from "@/components/home/HeroSection";
import LiveChart from "@/components/home/LiveChart";
import UploadSection from "@/components/home/UploadSection";
import ContentGrid from "@/components/content/ContentGrid";
import VotingSection from "@/components/content/VotingSection";
import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import FeaturesSection from "@/components/home/FeaturesSection";
import { Button } from "@/components/ui/button";
import { Brain } from "lucide-react";
import { Link } from "wouter";
import { useTrendingContent } from "@/hooks/use-content";
import { Helmet } from "react-helmet";

export default function Home() {
  const { data: trendingContent, isLoading } = useTrendingContent(1);
  const firstContent = trendingContent && trendingContent[0];

  return (
    <>
      <Helmet>
        <title>Dopameter — The Dopamine Index of the Internet</title>
        <meta name="description" content="Upload, vote, and watch the dopamine spike. Measure the emotional engagement of viral content on the internet's leading dopamine index." />
        <meta property="og:title" content="Dopameter — The Dopamine Index of the Internet" />
        <meta property="og:description" content="Upload, vote, and watch the dopamine spike. Measure the emotional engagement of viral content on the internet's leading dopamine index." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 pt-20 pb-16">
        {/* Hero Section */}
        <HeroSection />

        {/* Trending Content - Now at the top */}
        <ContentGrid title="Trending" accentColor="#FBBF24" />

        {/* Upload Section */}
        <UploadSection />

        {/* Voting Section - Now below upload section */}
        <VotingSection />

        {/* Live Dopameter Chart - Now where voting section was */}
        <LiveChart />

        {/* Leaderboard Section (Shortened version) */}
        <LeaderboardTable />

        {/* Features Section */}
        <FeaturesSection />

        {/* Call To Action */}
        <section className="py-12 mb-12">
          <div className="container mx-auto px-4">
            <div className="bg-gradient-to-r from-primary/20 to-[#EC4899]/20 rounded-2xl p-8 md:p-12 text-center relative overflow-hidden">
              <div className="absolute inset-0 opacity-30 -z-10">
                {/* Abstract brain pattern background */}
                <div className="h-full w-full bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-[#8B5CF6]/20 via-transparent to-transparent"></div>
              </div>
              
              <h2 className="text-2xl md:text-4xl font-bold font-sans mb-4">
                Participate in the Dopamine Meter
              </h2>
              
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto mb-8">
                Anonymously upload content, vote, and track the dopamine index in real-time.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Link href="/trending">
                  <Button 
                    size="lg"
                    className="bg-gradient-to-r from-primary to-[#EC4899] text-white shadow-lg hover:shadow-[#EC4899]/50 transition"
                  >
                    Start Rating
                  </Button>
                </Link>
                
                <Link href="/leaderboard">
                  <Button 
                    variant="secondary" 
                    size="lg"
                    className="shadow-lg hover:shadow-primary/30 transition"
                  >
                    View Leaderboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </section>
      </div>

      {/* Fixed floating upload button (mobile) */}
      <div className="fixed right-4 bottom-4 md:hidden z-40">
        <Link href="/trending">
          <Button 
            size="icon"
            className="bg-gradient-to-r from-primary to-[#EC4899] w-14 h-14 rounded-full shadow-lg flex items-center justify-center animate-pulse"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          </Button>
        </Link>
      </div>
    </>
  );
}
