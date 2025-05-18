import { Card, CardContent } from "@/components/ui/card";
import { CloudUpload, VoteIcon, BarChart3 } from "lucide-react";

export default function FeaturesSection() {
  return (
    <section className="py-12 bg-gradient-to-b from-muted/20 to-background rounded-xl mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-sans mb-12 text-center">
          How <span className="text-primary">Dopameter</span> Works
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="bg-muted/30 hover:transform hover:scale-105 transition duration-300">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/20 text-primary mb-4">
                <CloudUpload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Upload Content</h3>
              <p className="text-muted-foreground">
                Share memes, images, tweets, or videos that trigger dopamine responses.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30 hover:transform hover:scale-105 transition duration-300">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#EC4899]/20 text-[#EC4899] mb-4">
                <VoteIcon className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Vote With Emojis</h3>
              <p className="text-muted-foreground">
                Rate content from 😐 (Mid) to 🔥 (Full serotonin liquidation).
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-muted/30 hover:transform hover:scale-105 transition duration-300">
            <CardContent className="p-6 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#10B981]/20 text-[#10B981] mb-4">
                <BarChart3 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3">Track The Index</h3>
              <p className="text-muted-foreground">
                Watch real-time dopamine spikes and see what content makes the Internet react.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
