import { Shield, Zap, Download, Smartphone, Cloud, History, Sliders, Share2 } from 'lucide-react';
import { Card } from '@/components/ui/card';

const features = [
  {
    icon: Shield,
    title: 'Privacy First',
    description: 'All conversions happen in your browser. Your images never leave your device.',
  },
  {
    icon: Zap,
    title: 'Lightning Fast',
    description: 'Instant conversion with no waiting. Convert multiple images simultaneously.',
  },
  {
    icon: Download,
    title: 'Batch Processing',
    description: 'Upload and convert multiple PNG files at once with a single click.',
  },
  {
    icon: Sliders,
    title: 'Quality Control',
    description: 'Adjust compression levels and resize images to your exact specifications.',
  },
  {
    icon: Cloud,
    title: 'Cloud Integration',
    description: 'Import images directly from Google Drive or Dropbox (coming soon).',
  },
  {
    icon: History,
    title: 'Conversion History',
    description: 'Keep track of all your conversions with local history storage.',
  },
  {
    icon: Share2,
    title: 'Easy Sharing',
    description: 'Share converted images instantly or generate download links.',
  },
  {
    icon: Smartphone,
    title: 'Mobile Ready',
    description: 'Works perfectly on desktop, tablet, and mobile devices.',
  },
];

export const Features = () => {
  return (
    <section className="py-12" id="features">
      <div className="text-center mb-12">
        <h2 className="text-3xl font-bold mb-4">Why Choose PixelSift for Image Conversion?</h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          The most advanced free image converter online with support for multiple formats, privacy-first design, and professional features for all your image conversion needs.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {features.map((feature, index) => (
          <Card key={index} className="p-6 text-center hover:shadow-lg transition-all duration-300">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <feature.icon className="w-6 h-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">{feature.title}</h3>
            <p className="text-sm text-muted-foreground">{feature.description}</p>
          </Card>
        ))}
      </div>
    </section>
  );
};