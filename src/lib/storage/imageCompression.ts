/**
 * Compresses an image file and returns a base64 string
 * @param file The image file to compress
 * @param maxWidth Maximum width of the compressed image
 * @param maxHeight Maximum height of the compressed image
 * @param quality Compression quality (0-1)
 * @returns Promise that resolves to a base64 string
 */
export const compressImage = (
  file: File,
  maxWidth = 800,
  maxHeight = 800,
  quality = 0.7
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      
      img.onload = () => {
        // Calculate new dimensions
        let width = img.width;
        let height = img.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Could not get canvas context'));
          return;
        }
        
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to base64 string
        const base64String = canvas.toDataURL('image/jpeg', quality);
        resolve(base64String);
      };
      
      img.onerror = (error) => {
        reject(error);
      };
    };
    
    reader.onerror = (error) => {
      reject(error);
    };
  });
};

/**
 * Estimates the size of a base64 string in bytes
 * @param base64String The base64 string
 * @returns Size in bytes
 */
export const estimateBase64Size = (base64String: string): number => {
  // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
  const base64Data = base64String.split(',')[1] || base64String;
  
  // Calculate the size: each base64 digit represents 6 bits, so 4 digits = 3 bytes
  return Math.ceil((base64Data.length * 3) / 4);
};

/**
 * Checks if the total size of images is within the IndexedDB storage limits
 * @param images Array of base64 image strings
 * @param maxSizeInMB Maximum size in MB
 * @returns Boolean indicating if the images are within the size limit
 */
export const checkImagesSize = (
  images: string[],
  maxSizeInMB = 50
): boolean => {
  const totalSizeInBytes = images.reduce(
    (total, img) => total + estimateBase64Size(img),
    0
  );
  
  const maxSizeInBytes = maxSizeInMB * 1024 * 1024;
  return totalSizeInBytes <= maxSizeInBytes;
};
