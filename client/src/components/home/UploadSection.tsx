import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { CloudUpload } from "lucide-react";
import { ContentUploader } from "../content/ContentUploader";

export default function UploadSection() {
  const [linkUrl, setLinkUrl] = useState('');
  const [contentType, setContentType] = useState<string>('meme');

  const handleImportLink = async () => {
    if (!linkUrl.trim()) return;
    
    // Import link logic would be here
    try {
      await fetch('/api/content/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkUrl, type: contentType }),
      });
      
      setLinkUrl('');
      // Show success notification or navigate to new content
    } catch (error) {
      console.error('Failed to import content:', error);
      // Show error notification
    }
  };

  return (
    <section className="py-8 mb-12">
      <div className="container mx-auto px-4">
        <h2 className="text-2xl md:text-3xl font-bold font-sans mb-6">
          Upload & Share <span className="text-[#EC4899]">Content</span>
        </h2>
        
        <Card className="bg-muted/50">
          <CardContent className="p-6">
            <ContentUploader className="mb-4" />
            
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <Label className="block text-sm font-medium text-muted-foreground mb-2">
                  Or paste a link
                </Label>
                <div className="flex">
                  <Input
                    type="text"
                    placeholder="https://"
                    className="rounded-r-none"
                    value={linkUrl}
                    onChange={(e) => setLinkUrl(e.target.value)}
                  />
                  <Button 
                    className="rounded-l-none"
                    onClick={handleImportLink}
                  >
                    Import
                  </Button>
                </div>
              </div>
              
              <div className="flex-1">
                <Label className="block text-sm font-medium text-muted-foreground mb-2">
                  Content type
                </Label>
                <Select value={contentType} onValueChange={setContentType}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="meme">Meme</SelectItem>
                    <SelectItem value="tweet">Tweet</SelectItem>
                    <SelectItem value="video">Short video</SelectItem>
                    <SelectItem value="image">Image</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
