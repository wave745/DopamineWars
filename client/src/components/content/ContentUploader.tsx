import { useState, useCallback, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CloudUpload, Camera, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentUploaderProps {
  className?: string;
  onSuccess?: () => void;
}

export function ContentUploader({ className = '', onSuccess }: ContentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [contentType, setContentType] = useState('image');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      
      // Use the API endpoint with Replit Auth
      const formData = new FormData();
      formData.append('file', file);
      formData.append('type', getContentType(file.type));
      
      const response = await fetch('/api/content/upload', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Upload failed');
      }
      
      return await response.json();
    },
    onSuccess: () => {
      setUploading(false);
      toast({
        title: 'Upload successful',
        description: 'Your content has been uploaded successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      setUploading(false);
      toast({
        title: 'Upload failed',
        description: error instanceof Error ? error.message : 'Failed to upload content',
        variant: 'destructive',
      });
    },
  });

  const linkMutation = useMutation({
    mutationFn: async () => {
      if (!linkUrl.trim()) {
        throw new Error('Please enter a valid URL');
      }
      
      // Use API endpoint with Replit Auth
      const response = await fetch('/api/content/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: linkUrl, type: contentType }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to import content');
      }
      
      return await response.json();
    },
    onMutate: () => {
      setUploading(true);
    },
    onSuccess: () => {
      setUploading(false);
      setLinkUrl('');
      toast({
        title: 'Content imported',
        description: 'Your link has been added successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
      if (onSuccess) onSuccess();
    },
    onError: (error) => {
      setUploading(false);
      toast({
        title: 'Import failed',
        description: error instanceof Error ? error.message : 'Failed to import content',
        variant: 'destructive',
      });
    },
  });

  const getContentType = (mimeType: string): string => {
    if (mimeType.startsWith('image/')) return 'image';
    if (mimeType.startsWith('video/')) return 'video';
    return 'other';
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;
    
    const file = acceptedFiles[0];
    uploadMutation.mutate(file);
  }, [uploadMutation]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
    },
    maxSize: 10485760, // 10MB
    disabled: uploading,
    noClick: true, // Disable click to open file dialog (we'll handle it manually)
  });
  
  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      uploadMutation.mutate(files[0]);
    }
  };

  const handleLinkUpload = (e: React.FormEvent) => {
    e.preventDefault();
    linkMutation.mutate();
  };

  return (
    <div className={className}>
      <Tabs defaultValue="upload" className="w-full">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="upload">Upload File</TabsTrigger>
          <TabsTrigger value="link">Paste Link</TabsTrigger>
        </TabsList>
        
        <TabsContent value="upload">
          <div 
            {...getRootProps()}
            className={`upload-area flex flex-col items-center justify-center p-8 rounded-xl text-center
                      border-2 border-dashed border-primary/50 hover:border-[#EC4899]/50 transition
                      ${isDragActive ? 'bg-primary/10' : 'bg-transparent'}`}
          >
            <input {...getInputProps()} />
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleFileInputChange}
              accept="image/*,video/*"
              className="hidden"
            />
            <CloudUpload className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {isDragActive ? 'Drop your content here' : 'Drag & drop content here'}
            </h3>
            <p className="text-muted-foreground mb-4">or use buttons below to share content</p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Button 
                className="bg-primary/20 hover:bg-primary/30 text-white flex items-center gap-2" 
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
              >
                <Upload size={18} />
                {uploading ? 'Uploading...' : 'Select from files'}
              </Button>
              
              <Button 
                className="bg-primary/20 hover:bg-primary/30 text-white flex items-center gap-2" 
                disabled={uploading}
                onClick={() => {
                  // For mobile devices - opens camera
                  if (fileInputRef.current) {
                    fileInputRef.current.accept = "image/*,video/*";
                    fileInputRef.current.capture = "environment";
                    fileInputRef.current.click();
                  }
                }}
              >
                <Camera size={18} />
                Take photo/video
              </Button>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="link">
          <form onSubmit={handleLinkUpload} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Content URL</label>
              <div className="flex items-center space-x-2">
                <Input
                  type="url"
                  placeholder="https://"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="flex-1"
                  required
                />
                <Button 
                  type="submit"
                  disabled={uploading || !linkUrl.trim()}
                >
                  {uploading ? 'Importing...' : 'Import'}
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-muted-foreground">Content Type</label>
              <div className="flex space-x-2">
                {['image', 'video'].map((type) => (
                  <Button
                    key={type}
                    type="button"
                    variant={contentType === type ? 'default' : 'outline'} 
                    size="sm"
                    onClick={() => setContentType(type)}
                    className="capitalize"
                  >
                    {type}
                  </Button>
                ))}
              </div>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </div>
  );
}
