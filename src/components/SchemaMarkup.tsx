
import React from 'react';

export const SchemaMarkup = () => {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "Is it safe to convert images online with PixelSift?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PixelSift is completely safe. All image processing happens directly in your browser - your files never leave your device or get uploaded to any server."
        }
      },
      {
        "@type": "Question",
        "name": "What image formats does PixelSift support?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "PixelSift supports PNG, JPG, WebP, AVIF, and PDF formats. You can convert between any of these formats with ease."
        }
      },
      {
        "@type": "Question",
        "name": "Can I convert multiple images at once?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Absolutely! PixelSift supports batch conversion. You can upload multiple image files simultaneously and convert them all at once."
        }
      },
      {
        "@type": "Question",
        "name": "Is there a file size limit?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "No, there are no file size limits. Since all processing happens in your browser, you can convert images of any size."
        }
      },
      {
        "@type": "Question",
        "name": "Is PixelSift free to use?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, PixelSift is completely free to use. There are no hidden fees, subscriptions, or limitations on the number of conversions."
        }
      }
    ]
  };

  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": "How to Convert Images Online with PixelSift",
    "description": "Step-by-step guide to convert images between PNG, JPG, WebP, and other formats using PixelSift online converter",
    "step": [
      {
        "@type": "HowToStep",
        "name": "Upload Image Files",
        "text": "Click 'Choose Files' or drag and drop your images. PixelSift supports PNG, JPG, WebP, AVIF, and PDF formats. You can upload multiple files for batch conversion."
      },
      {
        "@type": "HowToStep",
        "name": "Choose Output Format and Settings",
        "text": "Select your desired output format (JPG, PNG, WebP, AVIF). Adjust quality, resize dimensions, and compression level for optimal results."
      },
      {
        "@type": "HowToStep",
        "name": "Download Converted Files",
        "text": "Your converted files are ready instantly. Download individually or all at once. All processing happens in your browser for maximum privacy."
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />
    </>
  );
};
