
import React from 'react';
import { Card } from '@/components/ui/card';

export const SEOContent = () => {
  return (
    <section className="py-12 space-y-12">
      {/* How to Convert PNG to JPG */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-6 text-center">How to Convert PNG to JPG Online</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl">
              1
            </div>
            <h3 className="font-semibold mb-2">Upload PNG Files</h3>
            <p className="text-sm text-muted-foreground">
              Click "Choose Files" or drag and drop your PNG images. You can upload multiple files for batch conversion.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl">
              2
            </div>
            <h3 className="font-semibold mb-2">Adjust Settings</h3>
            <p className="text-sm text-muted-foreground">
              Set your desired quality, resize dimensions, and compression level for optimal results.
            </p>
          </Card>
          <Card className="p-6 text-center">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-2xl">
              3
            </div>
            <h3 className="font-semibold mb-2">Download JPG Files</h3>
            <p className="text-sm text-muted-foreground">
              Your converted JPG files are ready instantly. Download individually or all at once.
            </p>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Is it safe to convert PNG to JPG online?</h3>
            <p className="text-muted-foreground">
              Yes, PixelShift is completely safe. All image processing happens directly in your browser - 
              your files never leave your device or get uploaded to any server. This ensures 100% privacy and security.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2">What's the difference between PNG and JPG?</h3>
            <p className="text-muted-foreground">
              PNG files support transparency and are lossless, making them larger but perfect for graphics with text or logos. 
              JPG files use lossy compression, creating smaller files ideal for photographs and web images.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Can I convert multiple PNG files at once?</h3>
            <p className="text-muted-foreground">
              Absolutely! PixelShift supports batch conversion. You can upload multiple PNG files simultaneously 
              and convert them all to JPG format with the same settings.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Is there a file size limit?</h3>
            <p className="text-muted-foreground">
              No, there are no file size limits. Since all processing happens in your browser, 
              you can convert images of any size, limited only by your device's memory.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Does converting PNG to JPG reduce quality?</h3>
            <p className="text-muted-foreground">
              JPG uses lossy compression, so there may be a slight quality reduction. However, 
              you can adjust the quality settings to find the perfect balance between file size and image quality.
            </p>
          </Card>
          
          <Card className="p-6">
            <h3 className="font-semibold mb-2">Can I use this converter on mobile devices?</h3>
            <p className="text-muted-foreground">
              Yes! PixelShift is fully responsive and works perfectly on smartphones, tablets, 
              and desktop computers. The interface adapts to your screen size for optimal usability.
            </p>
          </Card>
        </div>
      </div>

      {/* Benefits Section */}
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold mb-8 text-center">Benefits of Using PixelShift PNG to JPG Converter</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">For Web Developers</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Optimize images for faster website loading</li>
              <li>• Reduce bandwidth costs with smaller file sizes</li>
              <li>• Batch process multiple images for efficiency</li>
              <li>• Maintain quality while reducing file size</li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold">For Content Creators</h3>
            <ul className="space-y-2 text-muted-foreground">
              <li>• Prepare images for social media platforms</li>
              <li>• Reduce storage space for image libraries</li>
              <li>• Faster uploads to websites and platforms</li>
              <li>• Universal compatibility across devices</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
