import { useState } from 'react';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/FileUpload';
import { ConversionSettingsPanel, ConversionSettings } from '@/components/ConversionSettings';
import { ConversionResults } from '@/components/ConversionResults';
import { ConversionHistory } from '@/components/ConversionHistory';
import { Features } from '@/components/Features';
import { SEOContent } from '@/components/SEOContent';
import { Footer } from '@/components/Footer';
import { useImageConverter } from '@/hooks/useImageConverter';
import { useConversionHistory } from '@/hooks/useLocalStorage';
import { toast } from 'sonner';
import * as pdfjsLib from 'pdfjs-dist';
import { useEffect } from 'react';

const Index = () => {
  const [settings, setSettings] = useState<ConversionSettings>({
    quality: 0.85,
    format: 'jpeg',
    enableResize: false,
    maintainAspectRatio: true,
  });
  // Remove outputFormat state
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [pdfPageCount, setPdfPageCount] = useState<number>(0);
  const [selectedPdfPages, setSelectedPdfPages] = useState<number[]>([]);
  const [pdfPreviewUrl, setPdfPreviewUrl] = useState<string | null>(null);

  const { isConverting, convertedImages, convertImages, downloadImage, downloadAll, clearAll, setConvertedImages } = useImageConverter();
  const { addToHistory } = useConversionHistory();

  // Accept only files from FileUpload
  const handleFilesSelected = async (files: File[]) => {
    if (files.length === 0) return;
    setUploadedFiles(files);
    // If PDF, load page count and preview
    if (files.length === 1 && files[0].type === 'application/pdf') {
      const arrayBuffer = await files[0].arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      setPdfPageCount(pdf.numPages);
      setSelectedPdfPages([1]);
      // Render first page preview
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 1 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      setPdfPreviewUrl(canvas.toDataURL('image/png'));
      return;
    } else {
      setPdfPageCount(0);
      setSelectedPdfPages([]);
      setPdfPreviewUrl(null);
    }
    const conversionOptions = {
      quality: settings.quality,
      format: settings.format,
      width: settings.enableResize ? settings.width : undefined,
      height: settings.enableResize ? settings.height : undefined,
    };
    try {
      const { results, errors } = await convertImages(files, conversionOptions);
      // Add successful conversions to history
      results.forEach(result => {
        addToHistory({
          originalName: result.originalName,
          originalSize: result.originalSize,
          convertedSize: result.convertedSize,
          quality: result.quality,
          width: result.width,
          height: result.height,
        });
      });
      if (errors.length > 0) {
        toast.error(`Failed to convert ${errors.length} file${errors.length > 1 ? 's' : ''}`);
      }
    } catch (error) {
      toast.error('Conversion failed. Please try again.');
      console.error('Conversion error:', error);
    }
  };

  // When user selects PDF pages, trigger conversion for those pages
  const handleConvertSelectedPdfPages = async () => {
    if (uploadedFiles.length === 1 && uploadedFiles[0].type === 'application/pdf' && selectedPdfPages.length > 0) {
      const file = uploadedFiles[0];
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const results = [];
      for (const pageNum of selectedPdfPages) {
        const page = await pdf.getPage(pageNum);
        const viewport = page.getViewport({ scale: 2 });
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        canvas.width = settings.enableResize && settings.width ? settings.width : viewport.width;
        canvas.height = settings.enableResize && settings.height ? settings.height : viewport.height;
        await page.render({ canvasContext: context, viewport, canvas }).promise;
        let mimeType = settings.format === 'jpeg' ? 'image/jpeg' :
          settings.format === 'png' ? 'image/png' :
          settings.format === 'webp' ? 'image/webp' :
          settings.format === 'avif' ? 'image/avif' : 'image/png';
        let blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, settings.quality));
        if (!blob && mimeType !== 'image/png') {
          // Fallback to PNG if the selected format is not supported
          mimeType = 'image/png';
          blob = await new Promise(resolve => canvas.toBlob(resolve, mimeType, settings.quality));
          if (blob) {
            toast.warning(`Format ${settings.format} not supported, used PNG for page ${pageNum}`);
          }
        }
        if (!blob) {
          toast.error(`Failed to convert page ${pageNum} (unsupported format)`);
          continue;
        }
        const downloadUrl = URL.createObjectURL(blob);
        const ext = mimeType === 'image/jpeg' ? 'jpg' : mimeType === 'image/png' ? 'png' : mimeType === 'image/webp' ? 'webp' : mimeType === 'image/avif' ? 'avif' : 'img';
        const converted = {
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalName: `${file.name.replace(/\.pdf$/, '')}-page${pageNum}.${ext}`,
          originalSize: file.size,
          convertedSize: blob.size,
          downloadUrl,
          timestamp: new Date(),
          quality: settings.quality,
          width: canvas.width,
          height: canvas.height,
          format: ext,
        };
        results.push(converted);
        addToHistory({
          originalName: converted.originalName,
          originalSize: converted.originalSize,
          convertedSize: converted.convertedSize,
          quality: converted.quality,
          width: converted.width,
          height: converted.height,
        });
        toast.success(`Converted page ${pageNum}`);
      }
      setPdfPageCount(0);
      setSelectedPdfPages([]);
      setPdfPreviewUrl(null);
      setUploadedFiles([]);
      setConvertedImages(prev => [...prev, ...results]);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <section className="text-center py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Convert Images Online Free
              <span className="block bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                PixelSift - Fast & Private
              </span>
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Professional image converter supporting PNG, JPG, WebP, AVIF, and PDF. 
              Advanced compression, batch processing, and complete privacy. All conversions happen in your browser.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground mb-8">
              <span className="flex items-center">✓ No file size limits</span>
              <span className="flex items-center">✓ Batch conversion</span>
              <span className="flex items-center">✓ 100% private</span>
              <span className="flex items-center">✓ Free forever</span>
            </div>
            
            {/* SEO-friendly content */}
            <div className="max-w-3xl mx-auto text-left mt-12 space-y-6">
              <h2 className="text-2xl font-semibold mb-4">Why Use PixelSift for Image Conversion?</h2>
              <div className="grid md:grid-cols-2 gap-6 text-sm text-muted-foreground">
                <div>
                  <h3 className="font-medium text-foreground mb-2">Multiple Format Support</h3>
                  <p>Convert between PNG, JPG, WebP, AVIF, and PDF formats. Support for modern web formats with excellent compression.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Complete Privacy</h3>
                  <p>All processing happens in your browser. Your images never leave your device or get uploaded to any server.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">Batch Processing</h3>
                  <p>Convert multiple images simultaneously. Perfect for bulk operations and saving time on large projects.</p>
                </div>
                <div>
                  <h3 className="font-medium text-foreground mb-2">No Limitations</h3>
                  <p>No file size limits, no registration required, and completely free. Convert as many images as you need.</p>
                </div>
              </div>
            </div>
          </div>
        </section>
        {/* Conversion Tools */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <FileUpload 
              onFilesSelected={handleFilesSelected}
              isConverting={isConverting}
            />
           {/* PDF-specific UI */}
           {pdfPageCount > 0 && (
             <div className="p-4 bg-secondary/30 rounded-lg mt-4">
               <h4 className="font-semibold mb-2">PDF Preview & Page Selection</h4>
               {pdfPreviewUrl && (
                 <img src={pdfPreviewUrl} alt="PDF Preview" className="mb-2 max-h-48 mx-auto" />
               )}
               <div className="mb-2">Select pages to convert:</div>
               <div className="flex flex-wrap gap-2 mb-2">
                 {Array.from({ length: pdfPageCount }, (_, i) => i + 1).map(pageNum => (
                   <button
                     key={pageNum}
                     className={`px-2 py-1 rounded border ${selectedPdfPages.includes(pageNum) ? 'bg-primary text-white' : 'bg-background'}`}
                     onClick={() => setSelectedPdfPages(prev => prev.includes(pageNum) ? prev.filter(p => p !== pageNum) : [...prev, pageNum])}
                   >
                     {pageNum}
                   </button>
                 ))}
               </div>
               <button
                 className="px-4 py-2 bg-primary text-white rounded"
                 onClick={handleConvertSelectedPdfPages}
                 disabled={selectedPdfPages.length === 0}
               >
                 Convert Selected Pages
               </button>
             </div>
           )}
            {convertedImages.length > 0 && (
              <ConversionResults
                images={convertedImages}
                onDownload={(img) => {
                  const validFormats = ['jpeg', 'png', 'webp', 'avif'] as const;
                  if (validFormats.includes(img.format as any)) {
                    downloadImage(img, img.format as any);
                  } else {
                    // Optionally handle PDF download here
                  }
                }}
                onDownloadAll={downloadAll}
                onClear={clearAll}
              />
            )}
          </div>
          <div className="space-y-6">
            <ConversionSettingsPanel
              settings={settings}
              onChange={setSettings}
            />
            <ConversionHistory />
          </div>
        </div>
        {/* Features Section */}
        <Features />
        
        {/* SEO Content Section */}
        <SEOContent />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
