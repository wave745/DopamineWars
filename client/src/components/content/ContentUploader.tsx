import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { CloudUpload, LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/lib/supabaseClient';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ContentUploaderProps {
  className?: string;
  session?: any;
  onSuccess?: () => void;
}

export function ContentUploader({ className = '', session, onSuccess }: ContentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [contentType, setContentType] = useState('image');
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
      setUploading(true);
      
      // If we have a Supabase session, upload to Supabase Storage
      if (session?.user) {
        const fileExt = file.name.split('.').pop();
        const filePath = `${session.user.id}/${Date.now()}.${fileExt}`;
        
        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('content')
          .upload(filePath, file);
        
        if (uploadError) {
          throw new Error(uploadError.message);
        }
        
        // Get the public URL
        const { data: { publicUrl } } = supabase.storage
          .from('content')
          .getPublicUrl(filePath);
          
        // Create a record in the posts table
        const { error: insertError } = await supabase
          .from('posts')
          .insert([{ 
            user_id: session.user.id, 
            content_url: publicUrl,
            category: getContentType(file.type)
          }]);
          
        if (insertError) {
          throw new Error(insertError.message);
        }
        
        return { url: publicUrl };
      } else {
        // Fallback to original API endpoint if not authenticated with Supabase
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
      }
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
      
      if (session?.user) {
        // Create a record in the posts table
        const { error } = await supabase
          .from('posts')
          .insert([{ 
            user_id: session.user.id, 
            content_url: linkUrl,
            category: contentType
          }]);
          
        if (error) {
          throw new Error(error.message);
        }
        
        return { url: linkUrl };
      } else {
        // Fallback to original API
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
      }
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

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': [],
      'video/*': [],
    },
    maxSize: 10485760, // 10MB
    disabled: uploading,
  });

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
            className={`upload-area flex flex-col items-center justify-center p-8 rounded-xl text-center cursor-pointer 
                      border-2 border-dashed border-primary/50 hover:border-[#EC4899]/50 transition
                      ${isDragActive ? 'bg-primary/10' : 'bg-transparent'}`}
          >
            <input {...getInputProps()} />
            <CloudUpload className="text-primary text-4xl mb-4" />
            <h3 className="text-xl font-medium mb-2">
              {isDragActive ? 'Drop your content here' : 'Drag & drop content here'}
            </h3>
            <p className="text-muted-foreground mb-4">or click to browse your files</p>
            <Button 
              className="bg-primary/20 hover:bg-primary/30 text-white" 
              disabled={uploading}
            >
              {uploading ? 'Uploading...' : 'Select File'}
            </Button>
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
                {['image', 'meme', 'tweet', 'video', 'other'].map((type) => (
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
