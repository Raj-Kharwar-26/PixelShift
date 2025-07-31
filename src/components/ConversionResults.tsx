import { Download, Eye, Share2, Trash2, FileImage, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { ConvertedImage } from '@/hooks/useImageConverter';

interface ConversionResultsProps {
  images: ConvertedImage[];
  onDownload: (image: ConvertedImage) => void;
  onDownloadAll: () => void;
  onClear: () => void;
}

export const ConversionResults = ({ 
  images, 
  onDownload, 
  onDownloadAll, 
  onClear 
}: ConversionResultsProps) => {
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const calculateCompressionRatio = (original: number, converted: number) => {
    const ratio = ((original - converted) / original) * 100;
    return ratio > 0 ? ratio.toFixed(1) : '0';
  };

  const handleShare = async (image: ConvertedImage) => {
    if (navigator.share) {
      try {
        const response = await fetch(image.downloadUrl);
        const blob = await response.blob();
        const file = new File([blob], image.originalName.replace(/\.[^/.]+$/, '.jpg'), {
          type: 'image/jpeg'
        });
        
        await navigator.share({
          title: 'Converted Image',
          text: `Converted ${image.originalName} to JPG`,
          files: [file]
        });
      } catch (error) {
        toast.error('Sharing failed');
      }
    } else {
      // Fallback to copying download link
      navigator.clipboard.writeText(image.downloadUrl);
      toast.success('Download link copied to clipboard');
    }
  };

  const handlePreview = (image: ConvertedImage) => {
    window.open(image.downloadUrl, '_blank');
  };

  if (images.length === 0) {
    return null;
  }

  const totalOriginalSize = images.reduce((sum, img) => sum + img.originalSize, 0);
  const totalConvertedSize = images.reduce((sum, img) => sum + img.convertedSize, 0);
  const totalSavings = calculateCompressionRatio(totalOriginalSize, totalConvertedSize);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle className="w-5 h-5 text-green-500" />
            Conversion Complete
          </h3>
          <p className="text-sm text-muted-foreground">
            {images.length} image{images.length > 1 ? 's' : ''} converted successfully
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={onDownloadAll} className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Download All
          </Button>
          <Button variant="outline" onClick={onClear}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6 p-4 bg-secondary/20 rounded-lg">
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Original Size</p>
          <p className="font-semibold">{formatFileSize(totalOriginalSize)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Converted Size</p>
          <p className="font-semibold">{formatFileSize(totalConvertedSize)}</p>
        </div>
        <div className="text-center">
          <p className="text-sm text-muted-foreground">Space Saved</p>
          <p className="font-semibold text-green-600">{totalSavings}%</p>
        </div>
      </div>

      {/* Converted Images Grid */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {images.map((image, index) => (
          <div
            key={image.id}
            className="flex items-center justify-between p-4 bg-secondary/10 rounded-lg hover:bg-secondary/20 transition-colors"
          >
            <div className="flex items-center space-x-4 min-w-0 flex-1">
              <div className="flex-shrink-0">
                <FileImage className="w-8 h-8 text-primary" />
              </div>
              <div className="min-w-0 flex-1">
                <h4 className="font-medium truncate">
                  {(() => {
                    let ext = 'jpg';
                    if (image.format === 'jpeg') ext = 'jpg';
                    if (image.format === 'png') ext = 'png';
                    if (image.format === 'webp') ext = 'webp';
                    if (image.format === 'avif') ext = 'avif';
                    return image.originalName.replace(/\.[^/.]+$/, `.${ext}`);
                  })()}
                </h4>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>{formatFileSize(image.originalSize)} → {formatFileSize(image.convertedSize)}</span>
                  {image.width && image.height && (
                    <span>{image.width}×{image.height}</span>
                  )}
                  <Badge variant="secondary" className="text-xs">
                    {calculateCompressionRatio(image.originalSize, image.convertedSize)}% saved
                  </Badge>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 flex-shrink-0">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handlePreview(image)}
                className="h-8 w-8"
              >
                <Eye className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleShare(image)}
                className="h-8 w-8"
              >
                <Share2 className="w-4 h-4" />
              </Button>
              <Button
                variant="default"
                size="sm"
                onClick={() => onDownload(image)}
                className="flex items-center gap-1"
              >
                <Download className="w-3 h-3" />
                Download
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};