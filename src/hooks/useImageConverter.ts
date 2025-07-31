import { useState, useCallback } from 'react';
import { toast } from 'sonner';
import { jsPDF } from 'jspdf';
import * as pdfjsLib from 'pdfjs-dist';

export interface ConvertedImage {
  id: string;
  originalName: string;
  originalSize: number;
  convertedSize: number;
  downloadUrl: string;
  timestamp: Date;
  quality: number;
  width?: number;
  height?: number;
  format: 'jpeg' | 'png' | 'webp' | 'avif' | 'pdf';
}

export interface ConversionOptions {
  quality: number;
  width?: number;
  height?: number;
  format: 'jpeg' | 'png' | 'webp' | 'avif' | 'pdf';
}

export const useImageConverter = () => {
  const [isConverting, setIsConverting] = useState(false);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);

  const convertImage = useCallback(async (
    file: File,
    options: ConversionOptions = { quality: 0.9, format: 'jpeg' }
  ): Promise<ConvertedImage> => {
    return new Promise((resolve, reject) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();

      img.onload = () => {
        try {
          // Calculate dimensions
          let { width, height } = img;
          
          if (options.width && options.height) {
            width = options.width;
            height = options.height;
          } else if (options.width) {
            height = (img.height * options.width) / img.width;
            width = options.width;
          } else if (options.height) {
            width = (img.width * options.height) / img.height;
            height = options.height;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and convert
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Map format to mime type
          let mimeType = `image/${options.format}`;
          if (options.format === 'jpeg') mimeType = 'image/jpeg';
          if (options.format === 'png') mimeType = 'image/png';
          if (options.format === 'webp') mimeType = 'image/webp';
          if (options.format === 'avif') mimeType = 'image/avif';

          canvas.toBlob(
            (blob) => {
              if (!blob) {
                reject(new Error('Failed to convert image'));
                return;
              }

              const downloadUrl = URL.createObjectURL(blob);
              const convertedImage: ConvertedImage = {
                id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
                originalName: file.name,
                originalSize: file.size,
                convertedSize: blob.size,
                downloadUrl,
                timestamp: new Date(),
                quality: options.quality,
                width,
                height,
                format: options.format,
              };

              resolve(convertedImage);
            },
            mimeType,
            options.quality
          );
        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }, []);

  const convertPdfToImages = async (file: File, options: ConversionOptions): Promise<ConvertedImage[]> => {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    const results: ConvertedImage[] = [];
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      canvas.width = options.width || viewport.width;
      canvas.height = options.height || viewport.height;
      await page.render({ canvasContext: context, viewport, canvas }).promise;
      // Export as image
      const mimeType = options.format === 'jpeg' ? 'image/jpeg' :
        options.format === 'png' ? 'image/png' :
        options.format === 'webp' ? 'image/webp' :
        options.format === 'avif' ? 'image/avif' : 'image/png';
      const blob: Blob | null = await new Promise(resolve => canvas.toBlob(resolve, mimeType, options.quality));
      if (blob) {
        const downloadUrl = URL.createObjectURL(blob);
        results.push({
          id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          originalName: `${file.name.replace(/\.pdf$/, '')}-page${pageNum}.${options.format}`,
          originalSize: file.size,
          convertedSize: blob.size,
          downloadUrl,
          timestamp: new Date(),
          quality: options.quality,
          width: canvas.width,
          height: canvas.height,
          format: options.format,
        });
      }
    }
    return results;
  };

  const convertImagesToPdf = async (files: File[]): Promise<ConvertedImage> => {
    const pdf = new jsPDF();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const imgData = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
      const img = new window.Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = imgData;
      });
      const width = pdf.internal.pageSize.getWidth();
      const height = (img.height / img.width) * width;
      if (i > 0) pdf.addPage();
      pdf.addImage(img, 'JPEG', 0, 0, width, height);
    }
    const pdfBlob = pdf.output('blob');
    const downloadUrl = URL.createObjectURL(pdfBlob);
    return {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      originalName: 'converted.pdf',
      originalSize: files.reduce((sum, f) => sum + f.size, 0),
      convertedSize: pdfBlob.size,
      downloadUrl,
      timestamp: new Date(),
      quality: 1,
      format: 'pdf',
    };
  };

  const convertImages = useCallback(async (
    files: File[],
    options: ConversionOptions = { quality: 0.9, format: 'jpeg' }
  ) => {
    setIsConverting(true);
    const results: ConvertedImage[] = [];
    const errors: string[] = [];
    try {
      if (files.length === 1 && files[0].type === 'application/pdf') {
        // PDF to image
        try {
          const pdfResults = await convertPdfToImages(files[0], options);
          results.push(...pdfResults);
          toast.success(`Converted PDF to ${pdfResults.length} image(s)`);
        } catch (error) {
          errors.push('Failed to convert PDF');
          toast.error('Failed to convert PDF');
        }
      } else if (options.format === 'pdf') {
        // Images to PDF
        try {
          const pdfResult = await convertImagesToPdf(files);
          results.push(pdfResult);
          toast.success('Converted images to PDF');
        } catch (error) {
          errors.push('Failed to convert images to PDF');
          toast.error('Failed to convert images to PDF');
        }
      } else {
        // Standard image conversion
        for (const file of files) {
          try {
            const converted = await convertImage(file, options);
            results.push(converted);
            toast.success(`Converted ${file.name}`);
          } catch (error) {
            const errorMsg = `Failed to convert ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`;
            errors.push(errorMsg);
            toast.error(errorMsg);
          }
        }
      }
      setConvertedImages(prev => [...prev, ...results]);
      if (results.length > 0) {
        toast.success(`Successfully converted ${results.length} file${results.length > 1 ? 's' : ''}`);
      }
      return { results, errors };
    } finally {
      setIsConverting(false);
    }
  }, [convertImage]);

  const downloadImage = useCallback((image: ConvertedImage, format?: 'jpeg' | 'png' | 'webp' | 'avif') => {
    const link = document.createElement('a');
    link.href = image.downloadUrl;
    // Set extension based on format
    const useFormat = format || image.format;
    let ext = 'jpg';
    if (useFormat === 'jpeg') ext = 'jpg';
    if (useFormat === 'png') ext = 'png';
    if (useFormat === 'webp') ext = 'webp';
    if (useFormat === 'avif') ext = 'avif';
    link.download = image.originalName.replace(/\.[^/.]+$/, `.${ext}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success(`Downloaded ${link.download}`);
  }, []);

  const downloadAll = useCallback(() => {
    convertedImages.forEach(image => {
      setTimeout(() => downloadImage(image), 100);
    });
  }, [convertedImages, downloadImage]);

  const clearAll = useCallback(() => {
    convertedImages.forEach(image => {
      URL.revokeObjectURL(image.downloadUrl);
    });
    setConvertedImages([]);
    toast.success('Cleared all converted images');
  }, [convertedImages]);

  return {
    isConverting,
    convertedImages,
    convertImage,
    convertImages,
    downloadImage,
    downloadAll,
    clearAll,
  };
};