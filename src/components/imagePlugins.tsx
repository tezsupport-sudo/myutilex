import React from 'react';

export interface ImageInputField {
  id: string;
  label: string;
  type: 'range' | 'checkbox' | 'select' | 'number';
  defaultValue: any;
  min?: number;
  max?: number;
  step?: number;
  options?: { label: string; value: any }[];
  helpText?: string;
}

export interface ImagePlugin {
  id: string;
  name: string;
  description: string;
  inputs: ImageInputField[];
  process: (
    file: File,
    inputs: Record<string, any>
  ) => Promise<{
    blob: Blob;
    url: string;
    width: number;
    height: number;
    originalSize: number;
    optimizedSize: number;
    format: string;
  }>;
}

// Helper to load a file into an Image object
const loadImage = (file: File): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Failed to load image file.'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read image file.'));
    reader.readAsDataURL(file);
  });
};

// 1. Image Compressor and Resizer Plugin
const imageCompressorPlugin: ImagePlugin = {
  id: 'image-compressor',
  name: 'Smart client-side Image Compressor',
  description: 'Adjust quality levels, transcode between JPEG, PNG, and WebP, and downscale dimensions 100% locally with high-fidelity canvas resamplers.',
  inputs: [
    {
      id: 'quality',
      label: 'Compression Quality',
      type: 'range',
      defaultValue: 80,
      min: 10,
      max: 100,
      step: 1,
      helpText: 'Lower values increase compression and reduce file size, while higher values protect fine details.'
    },
    {
      id: 'format',
      label: 'Output Format',
      type: 'select',
      defaultValue: 'image/jpeg',
      options: [
        { label: 'JPEG (Lossy, Best for Photos)', value: 'image/jpeg' },
        { label: 'PNG (Lossless, Best for Graphics)', value: 'image/png' },
        { label: 'WebP (Modern, Outstanding Savings)', value: 'image/webp' }
      ],
      helpText: 'PNG is lossless and quality-controlled (ignores quality slider). WebP and JPEG offer strong size reduction.'
    },
    {
      id: 'resizeMode',
      label: 'Resize Constraint',
      type: 'select',
      defaultValue: 'none',
      options: [
        { label: 'No Resizing (Keep Original)', value: 'none' },
        { label: 'Scale to Width', value: 'width' },
        { label: 'Scale to Height', value: 'height' },
        { label: 'Custom Dimension Bound', value: 'custom' }
      ]
    },
    {
      id: 'customWidth',
      label: 'Target Width (px)',
      type: 'number',
      defaultValue: 1080,
      min: 50,
      max: 8192,
      helpText: 'Set the target pixel width.'
    },
    {
      id: 'customHeight',
      label: 'Target Height (px)',
      type: 'number',
      defaultValue: 1080,
      min: 50,
      max: 8192,
      helpText: 'Set the target pixel height.'
    },
    {
      id: 'maintainRatio',
      label: 'Maintain Aspect Ratio',
      type: 'checkbox',
      defaultValue: true,
      helpText: 'Locks the original proportions of the image to prevent stretching or squishing.'
    }
  ],
  process: async (file: File, inputs: Record<string, any>) => {
    const quality = Number(inputs.quality || 80) / 100;
    const format = inputs.format || 'image/jpeg';
    const resizeMode = inputs.resizeMode || 'none';
    const customWidth = Number(inputs.customWidth || 1080);
    const customHeight = Number(inputs.customHeight || 1080);
    const maintainRatio = !!inputs.maintainRatio;

    // Load original image
    const img = await loadImage(file);
    const origWidth = img.width;
    const origHeight = img.height;

    let targetW = origWidth;
    let targetH = origHeight;

    // Dimension scaling calculations
    if (resizeMode === 'width') {
      targetW = customWidth;
      targetH = Math.round(origHeight * (customWidth / origWidth));
    } else if (resizeMode === 'height') {
      targetH = customHeight;
      targetW = Math.round(origWidth * (customHeight / origHeight));
    } else if (resizeMode === 'custom') {
      if (maintainRatio) {
        const ratio = Math.min(customWidth / origWidth, customHeight / origHeight);
        targetW = Math.round(origWidth * ratio);
        targetH = Math.round(origHeight * ratio);
      } else {
        targetW = customWidth;
        targetH = customHeight;
      }
    }

    // Safeguard zero or negative bounds
    targetW = Math.max(1, targetW);
    targetH = Math.max(1, targetH);

    // Setup canvas
    const canvas = document.createElement('canvas');
    canvas.width = targetW;
    canvas.height = targetH;

    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Could not establish HTML5 canvas graphic context.');
    }

    // Handle white background for JPEGs when source is transparent PNG
    if (format === 'image/jpeg') {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetW, targetH);
    }

    // Draw & resample image
    ctx.drawImage(img, 0, 0, targetW, targetH);

    // Compress & convert to blob
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error('Failed to render canvas into desired target output stream.'));
            return;
          }

          const url = URL.createObjectURL(blob);
          resolve({
            blob,
            url,
            width: targetW,
            height: targetH,
            originalSize: file.size,
            optimizedSize: blob.size,
            format: format
          });
        },
        format,
        format === 'image/png' ? undefined : quality
      );
    });
  }
};

export const IMAGE_PLUGINS: Record<string, ImagePlugin> = {
  'image-compressor': imageCompressorPlugin
};
