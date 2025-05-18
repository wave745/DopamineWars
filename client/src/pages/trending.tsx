import ContentGrid from "@/components/content/ContentGrid";
import { ContentUploader } from "@/components/content/ContentUploader";
import { Card, CardContent } from "@/components/ui/card";
import { Helmet } from "react-helmet";

export default function Trending() {
  return (
    <>
      <Helmet>
        <title>Trending Content | Dopameter</title>
        <meta name="description" content="Browse and vote on the most dopamine-inducing trending content on the internet. Upload your own content and see how it measures up." />
        <meta property="og:title" content="Trending Content | Dopameter" />
        <meta property="og:description" content="Browse and vote on the most dopamine-inducing trending content on the internet. Upload your own content and see how it measures up." />
        <meta property="og:type" content="website" />
      </Helmet>

      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="max-w-4xl mx-auto mb-12">
          <h1 className="text-3xl md:text-4xl font-bold font-sans mb-4">
            <span className="text-[#FBBF24]">Upload</span> & <span className="text-primary">Share</span>
          </h1>
          <p className="text-muted-foreground mb-6">
            Share your dopamine-inducing content with the world. Upload memes, images, tweets, or videos and watch how the internet reacts.
          </p>

          <Card className="bg-muted/30">
            <CardContent className="p-6">
              <ContentUploader className="mb-6" />
            </CardContent>
          </Card>
        </div>

        <ContentGrid title="Trending" accentColor="#FBBF24" />
      </div>
    </>
  );
}
