import { useState } from 'react';
import { History, Calendar, FileImage, Download, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useConversionHistory } from '@/hooks/useLocalStorage';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

export const ConversionHistory = () => {
  const { history, clearHistory } = useConversionHistory();
  const [isOpen, setIsOpen] = useState(false);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

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

  const groupedHistory = history.reduce((groups: { [key: string]: any[] }, item: any) => {
    const date = new Date(item.timestamp).toDateString();
    if (!groups[date]) {
      groups[date] = [];
    }
    groups[date].push(item);
    return groups;
  }, {});

  if (history.length === 0) {
    return (
      <Card className="p-6 text-center">
        <History className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">No conversion history</h3>
        <p className="text-muted-foreground">
          Start converting images to see your history here
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-4">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CollapsibleTrigger asChild>
          <Button variant="ghost" className="w-full justify-between p-0 h-auto">
            <div className="flex items-center space-x-2">
              <History className="w-4 h-4" />
              <span className="font-semibold">Conversion History ({history.length})</span>
            </div>
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </Button>
        </CollapsibleTrigger>
        
        <CollapsibleContent className="mt-4">
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-muted-foreground">
              Recent conversions from this browser
            </p>
            <Button variant="outline" size="sm" onClick={clearHistory}>
              <Trash2 className="w-3 h-3 mr-1" />
              Clear All
            </Button>
          </div>

          <div className="space-y-4 max-h-80 overflow-y-auto">
            {Object.entries(groupedHistory).map(([date, items]) => (
              <div key={date} className="space-y-2">
                <div className="flex items-center space-x-2 text-sm font-medium text-muted-foreground">
                  <Calendar className="w-3 h-3" />
                  <span>{date}</span>
                </div>
                
                <div className="space-y-2 pl-4 border-l-2 border-border">
                  {(items as any[]).map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                    >
                      <div className="flex items-center space-x-3 min-w-0 flex-1">
                        <FileImage className="w-5 h-5 text-primary flex-shrink-0" />
                        <div className="min-w-0 flex-1">
                          <p className="font-medium truncate text-sm">
                            {item.originalName}
                          </p>
                          <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                            <span>
                              {formatFileSize(item.originalSize)} → {formatFileSize(item.convertedSize)}
                            </span>
                            <Badge variant="secondary" className="text-xs">
                              {calculateCompressionRatio(item.originalSize, item.convertedSize)}% saved
                            </Badge>
                            <span>{formatDate(item.timestamp)}</span>
                          </div>
                        </div>
                      </div>
                      
                      {item.downloadUrl && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 flex-shrink-0"
                          onClick={() => {
                            const link = document.createElement('a');
                            link.href = item.downloadUrl;
                            link.download = item.originalName.replace(/\.[^/.]+$/, '.jpg');
                            link.click();
                          }}
                        >
                          <Download className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};