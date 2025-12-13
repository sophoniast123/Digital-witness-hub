// Image Preprocessing for Better OCR Accuracy
// Especially optimized for social media screenshots (Telegram, Instagram, WhatsApp, etc.)

/**
 * Preprocess image for better OCR accuracy
 * Handles dark mode, colored backgrounds, and low contrast screenshots
 * @param {string} imageDataURL - Base64 image data URL
 * @returns {Promise<string>} - Preprocessed image data URL
 */
export const preprocessImageForOCR = async (imageDataURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        // Create canvas with image dimensions
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        // Draw original image
        ctx.drawImage(img, 0, 0);

        // Get image data
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Apply preprocessing
        preprocessPixels(data);

        // Put processed image back
        ctx.putImageData(imageData, 0, 0);

        // Return processed image as data URL
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageDataURL;
  });
};

/**
 * Preprocess pixels for better OCR
 * - Increases contrast
 * - Converts to grayscale
 * - Applies thresholding
 * - Handles dark mode screenshots
 */
const preprocessPixels = (data) => {
  // Step 1: Convert to grayscale and increase contrast
  for (let i = 0; i < data.length; i += 4) {
    const r = data[i];
    const g = data[i + 1];
    const b = data[i + 2];

    // Calculate luminance (grayscale)
    const gray = 0.299 * r + 0.587 * g + 0.114 * b;

    // Detect if this is likely a dark mode screenshot
    const isDarkMode = gray < 100;

    // Apply contrast enhancement
    let enhanced;
    if (isDarkMode) {
      // For dark mode: invert and enhance
      enhanced = 255 - gray;
      enhanced = Math.min(255, enhanced * 1.3);
    } else {
      // For light mode: enhance contrast
      enhanced = ((gray - 128) * 1.5) + 128;
      enhanced = Math.max(0, Math.min(255, enhanced));
    }

    // Apply adaptive thresholding for better text separation
    const threshold = 140;
    const binarized = enhanced > threshold ? 255 : 0;

    // Set RGB to the processed value
    data[i] = binarized;
    data[i + 1] = binarized;
    data[i + 2] = binarized;
    // Alpha channel stays the same (data[i + 3])
  }
};

/**
 * Detect if image is likely a social media screenshot
 * Based on common characteristics (aspect ratio, dimensions, etc.)
 */
export const detectSocialMediaScreenshot = (width, height) => {
  const aspectRatio = width / height;
  
  // Common mobile screenshot ratios
  const mobileRatios = [
    9/16,   // Standard portrait
    9/19.5, // iPhone X and newer
    9/18,   // Many Android phones
    9/20,   // Some newer phones
  ];

  // Check if aspect ratio matches mobile screenshots
  const isMobileRatio = mobileRatios.some(ratio => 
    Math.abs(aspectRatio - ratio) < 0.1
  );

  // Common mobile widths (accounting for different DPIs)
  const commonMobileWidths = [720, 1080, 1170, 1125, 1242, 1440, 1080, 828, 750];
  const likelyMobileWidth = commonMobileWidths.some(w => 
    Math.abs(width - w) < 50
  );

  return isMobileRatio || likelyMobileWidth;
};

/**
 * Enhanced preprocessing specifically for social media screenshots
 */
export const preprocessSocialMediaScreenshot = async (imageDataURL) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');

        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        // Detect overall brightness to identify dark/light mode
        let totalBrightness = 0;
        for (let i = 0; i < data.length; i += 4) {
          const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;
          totalBrightness += brightness;
        }
        const avgBrightness = totalBrightness / (data.length / 4);
        const isDarkMode = avgBrightness < 100;

        // Apply aggressive preprocessing for social media text
        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          // Grayscale
          let gray = 0.299 * r + 0.587 * g + 0.114 * b;

          if (isDarkMode) {
            // Dark mode: invert colors (white text on dark background → black text on white)
            gray = 255 - gray;
            
            // Aggressive contrast boost for dark mode
            gray = ((gray - 128) * 2.5) + 128;
            gray = Math.max(0, Math.min(255, gray));
            
            // Strong thresholding
            gray = gray > 100 ? 255 : 0;
          } else {
            // Light mode: enhance contrast
            gray = ((gray - 128) * 2.0) + 128;
            gray = Math.max(0, Math.min(255, gray));
            
            // Thresholding
            gray = gray > 140 ? 255 : 0;
          }

          data[i] = gray;
          data[i + 1] = gray;
          data[i + 2] = gray;
        }

        ctx.putImageData(imageData, 0, 0);
        resolve(canvas.toDataURL('image/png'));
      } catch (error) {
        reject(error);
      }
    };
    img.onerror = reject;
    img.src = imageDataURL;
  });
};

export default {
  preprocessImageForOCR,
  detectSocialMediaScreenshot,
  preprocessSocialMediaScreenshot
};
