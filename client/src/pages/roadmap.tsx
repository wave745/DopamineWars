import { Card, CardContent } from "@/components/ui/card";
import { CheckCircle, CircleDot, Rocket } from "lucide-react";

export default function Roadmap() {
  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">
              <span className="text-primary">Dopameter</span> Roadmap
            </h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Our vision for building the ultimate dopamine measurement platform
            </p>
          </div>

          <div className="space-y-12">
            {/* Phase 1 */}
            <Card className="backdrop-blur-sm border border-primary/30 relative overflow-hidden">
              <div className="absolute -top-10 -left-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <CardContent className="p-8">
                <div className="mb-4 flex items-center">
                  <div className="flex-shrink-0 mr-3 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground">
                    <span className="text-lg font-bold">1</span>
                  </div>
                  <h2 className="text-2xl font-bold">Phase 1: Foundations of Feeling</h2>
                </div>

                <div className="space-y-4 pl-12">
                  <div className="flex">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Website Launch</h3>
                      <p className="text-muted-foreground">
                        Clean retro interface where users browse dopamine-triggering content
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CheckCircle className="w-6 h-6 text-primary flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Photo Rating System</h3>
                      <p className="text-muted-foreground">
                        Users can swipe or click to rate photos based on dopamine response
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Phase 2 */}
            <Card className="backdrop-blur-sm border border-primary/30 relative overflow-hidden">
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <CardContent className="p-8">
                <div className="mb-4 flex items-center">
                  <div className="flex-shrink-0 mr-3 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground">
                    <span className="text-lg font-bold">2</span>
                  </div>
                  <h2 className="text-2xl font-bold">Phase 2: Boost Economy</h2>
                </div>

                <div className="space-y-4 pl-12">
                  <div className="flex">
                    <Rocket className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Dopamine Boosts</h3>
                      <p className="text-muted-foreground">
                        Users can boost a photo using $DOPA tokens
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CircleDot className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Token Burning</h3>
                      <p className="text-muted-foreground">
                        Tokens used for boosts are burned, increasing scarcity
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CircleDot className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Wallet Connectivity</h3>
                      <p className="text-muted-foreground">
                        Users connect Solana/EVM wallets to verify identity and Dopameter token holdings
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CircleDot className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">Leaderboard of Feels</h3>
                      <p className="text-muted-foreground">
                        Top boosted photos ranked weekly/monthly<br />
                        Reward top creators with $DOPA<br />
                        Show trends in visual addiction
                      </p>
                    </div>
                  </div>

                  <div className="flex">
                    <CircleDot className="w-6 h-6 text-[#FBBF24] flex-shrink-0 mr-3" />
                    <div>
                      <h3 className="font-semibold mb-1">User Profiles</h3>
                      <p className="text-muted-foreground">
                        Users set up profiles showing:<br />
                        • How much $DOPA they hold<br />
                        • How much they've spent boosting<br />
                        • Their top boosted photos
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Future phases placeholder */}
            <Card className="backdrop-blur-sm border border-primary/30 relative overflow-hidden">
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/20 rounded-full blur-3xl"></div>
              <CardContent className="p-8">
                <div className="mb-4 flex items-center">
                  <div className="flex-shrink-0 mr-3 flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-primary/20 to-primary/40 text-primary-foreground">
                    <span className="text-lg font-bold">3+</span>
                  </div>
                  <h2 className="text-2xl font-bold">Future Phases</h2>
                </div>

                <div className="pl-12">
                  <p className="text-muted-foreground italic">
                    More exciting features coming soon! Stay tuned for updates as we continue to build the ultimate dopamine measurement platform.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}