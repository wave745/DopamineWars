import LeaderboardTable from "@/components/leaderboard/LeaderboardTable";
import { Helmet } from "react-helmet";

export default function Leaderboard() {
  return (
    <>
      <Helmet>
        <title>Dopamine Leaderboard | Dopameter</title>
        <meta name="description" content="See the most dopamine-inducing content ranked by emotional engagement. Daily, weekly, and monthly rankings of content that makes the internet's brain light up." />
        <meta property="og:title" content="Dopamine Leaderboard | Dopameter" />
        <meta property="og:description" content="See the most dopamine-inducing content ranked by emotional engagement. Daily, weekly, and monthly rankings of content that makes the internet's brain light up." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            <span className="text-[#10B981]">Dopamine</span> Leaderboard
          </h1>
          <p className="text-muted-foreground mb-6">
            Discover the content that's creating the biggest dopamine spikes across the internet. 
            See daily, weekly, and monthly rankings of the most potent brain-melting content.
          </p>
        </div>

        <LeaderboardTable />
      </div>
    </>
  );
}
