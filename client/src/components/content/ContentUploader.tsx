import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CloudUpload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface ContentUploaderProps {
  className?: string;
}

export function ContentUploader({ className = '' }: ContentUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: async (file: File) => {
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
    onMutate: () => {
      setUploading(true);
    },
    onSuccess: () => {
      setUploading(false);
      toast({
        title: 'Upload successful',
        description: 'Your content has been uploaded successfully!',
      });
      queryClient.invalidateQueries({ queryKey: ['/api/content'] });
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

  return (
    <div className={className}>
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
    </div>
  );
}
