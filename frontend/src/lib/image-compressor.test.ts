import { describe, it, expect } from 'bun:test';
import {
  calculateAspectRatioFit,
  toWebPFilename,
  compressImageToWebP,
} from './image-compressor';

describe('Image Compressor Utility', () => {
  describe('toWebPFilename', () => {
    it('changes standard extensions (.jpg, .jpeg, .png) to .webp', () => {
      expect(toWebPFilename('photo.jpg')).toBe('photo.webp');
      expect(toWebPFilename('wedding-cover.jpeg')).toBe('wedding-cover.webp');
      expect(toWebPFilename('couple.PNG')).toBe('couple.webp');
    });

    it('keeps existing .webp extension unchanged', () => {
      expect(toWebPFilename('image.webp')).toBe('image.webp');
    });

    it('handles files with multiple dots', () => {
      expect(toWebPFilename('my.wedding.photo.jpg')).toBe('my.wedding.photo.webp');
    });
  });

  describe('calculateAspectRatioFit', () => {
    it('keeps original dimensions if smaller than maximums', () => {
      const res = calculateAspectRatioFit(800, 600, 1920, 1920);
      expect(res.width).toBe(800);
      expect(res.height).toBe(600);
    });

    it('downscales wide landscape image maintaining aspect ratio', () => {
      const res = calculateAspectRatioFit(3840, 2160, 1920, 1920);
      expect(res.width).toBe(1920);
      expect(res.height).toBe(1080);
    });

    it('downscales tall portrait image maintaining aspect ratio', () => {
      const res = calculateAspectRatioFit(2000, 4000, 1920, 1920);
      expect(res.height).toBe(1920);
      expect(res.width).toBe(960);
    });

    it('handles square images proportionally', () => {
      const res = calculateAspectRatioFit(3000, 3000, 1920, 1920);
      expect(res.width).toBe(1920);
      expect(res.height).toBe(1920);
    });
  });

  describe('compressImageToWebP validations', () => {
    it('throws error when unsupported non-image file is provided', async () => {
      const textFile = new File(['hello world'], 'document.pdf', { type: 'application/pdf' });
      expect(compressImageToWebP(textFile)).rejects.toThrow(
        'Format file "application/pdf" tidak didukung. Harap pilih file gambar.'
      );
    });
  });
});
