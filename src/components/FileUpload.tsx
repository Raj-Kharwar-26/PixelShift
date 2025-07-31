import { useCallback, useState } from 'react';
import { Upload, Image, X, FileImage, Cloud } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from 'sonner';

interface FileUploadProps {
  onFilesSelected: (files: File[]) => void; // revert to only files
  isConverting: boolean;
}

export const FileUpload = ({ onFilesSelected, isConverting }: FileUploadProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  // Remove outputFormat state and related logic

  // Supported formats
  const supportedTypes = [
    'image/png',
    'image/jpeg',
    'image/webp',
    'image/avif',
    'application/pdf',
  ];
  const formatOptions = [
    { label: 'JPG', value: 'image/jpeg' },
    { label: 'PNG', value: 'image/png' },
    { label: 'WebP', value: 'image/webp' },
    { label: 'AVIF', value: 'image/avif' },
  ];

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;

    const validFiles: File[] = [];
    const invalidFiles: string[] = [];

    Array.from(files).forEach(file => {
      if (supportedTypes.includes(file.type)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file.name);
      }
    });

    if (invalidFiles.length > 0) {
      toast.error(`Unsupported file type(s): ${invalidFiles.join(', ')}`);
    }

    if (validFiles.length > 0) {
      setSelectedFiles(prev => [...prev, ...validFiles]);
      toast.success(`Added ${validFiles.length} file${validFiles.length > 1 ? 's' : ''}`);
    }
  }, []);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
  }, [handleFiles]);

  const removeFile = useCallback((index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  }, []);

  const handleConvert = useCallback(() => {
    if (selectedFiles.length === 0) {
      toast.error('Please select image files to convert');
      return;
    }
    onFilesSelected(selectedFiles); // only pass files
  }, [selectedFiles, onFilesSelected]);

  const clearAll = useCallback(() => {
    setSelectedFiles([]);
    toast.success('Cleared all files');
  }, []);

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Upload Zone */}
      <Card
        className={`p-8 transition-all duration-300 cursor-pointer hover:shadow-lg ${
          dragActive ? 'drag-zone drag-active' : 'drag-zone'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <div className="flex flex-col items-center justify-center text-center space-y-4">
          <div className="p-4 rounded-full bg-primary/10">
            <Upload className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Drop image or PDF files here</h3>
            <p className="text-muted-foreground mb-4">
              or click to browse your device
            </p>
            <div className="flex flex-wrap justify-center gap-2 text-sm text-muted-foreground">
              <span className="flex items-center gap-1">
                <FileImage className="w-4 h-4" />
                JPG, PNG, WebP, AVIF, PDF
              </span>
              <span>•</span>
              <span>Multiple files supported</span>
              <span>•</span>
              <span>Max 10MB per file</span>
            </div>
          </div>
          <input
            id="file-input"
            type="file"
            multiple
            accept="image/png,image/jpeg,image/webp,image/avif,application/pdf"
            onChange={handleInputChange}
            className="hidden"
          />
        </div>
      </Card>
      {/* Output Format Selection */}
      {/* Cloud Upload Options */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-12 w-full"
          onClick={() => toast.info('Google Drive integration coming soon!')}
        >
          <Cloud className="w-4 h-4 mr-2" />
          Upload from Google Drive
        </Button>
        <Button
          variant="outline"
          className="h-12 w-full"
          onClick={() => toast.info('Dropbox integration coming soon!')}
        >
          <Cloud className="w-4 h-4 mr-2" />
          Upload from Dropbox
        </Button>
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold">Selected Files ({selectedFiles.length})</h3>
            <Button variant="ghost" size="sm" onClick={clearAll}>
              Clear All
            </Button>
          </div>
          
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {selectedFiles.map((file, index) => (
              <div key={index} className="flex items-center justify-between p-2 bg-secondary/50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <Image className="w-5 h-5 text-primary" />
                  <div>
                    <p className="font-medium text-sm truncate max-w-48">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{formatFileSize(file.size)}</p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => removeFile(index)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="mt-4 pt-4 border-t">
            <Button
              onClick={handleConvert}
              disabled={isConverting || selectedFiles.length === 0}
              className="w-full h-12"
            >
              {isConverting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                  Converting...
                </>
              ) : (
                <>
                  <Image className="w-4 h-4 mr-2" />
                  Convert {selectedFiles.length} File{selectedFiles.length > 1 ? 's' : ''}
                </>
              )}
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};