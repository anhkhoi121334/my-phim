/**
 * Utility functions for handling images
 */

// Default placeholder image as base64 data URI (light gray with product icon)
const DEFAULT_PLACEHOLDER = 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIyMDAiIGhlaWdodD0iMjAwIiB2aWV3Qm94PSIwIDAgMjAwIDIwMCI+PHJlY3Qgd2lkdGg9IjIwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNmMWYxZjEiLz48cGF0aCBkPSJNMTAwIDcwQzg0LjUgNzAgNzIgODIuNSA3MiA5OHMxMi41IDI4IDI4IDI4IDI4LTEyLjUgMjgtMjgtMTIuNS0yOC0yOC0yOHptMCA0MmMtNy43MzIgMC0xNC02LjI2OC0xNC0xNHM2LjI2OC0xNCAxNCAxNCA2LjI2OCAxNCAxNCA2LjI2OC0xNCAxNC0xNCAxNHptNDItNDJoLTE0di0xNGgtNTZ2MTRoLTE0YTEzLjk5IDEzLjk5IDAgMDAtMTQgMTR2NDJoMTR2LTE0aDg0djE0aDE0di00MmExMy45OSAxMy45OSAwIDAwLTE0LTE0em0wIDQyaC04NHYtMjhjMC0uNTUuNDUtMSAxLTFoODJjLjU1IDAgMSAuNDUgMSAxdjI4eiIgZmlsbD0iIzljOWM5YyIvPjwvc3ZnPg==';

// Using picsum.photos for better placeholder images
const PICSUM_PLACEHOLDER = 'https://picsum.photos/600/600';

/**
 * Get a valid image URL with fallback
 * @param {string} imageUrl - The original image URL
 * @param {string} fallbackUrl - Optional custom fallback URL
 * @returns {string} - A valid image URL
 */
export const getImageUrl = (imageUrl, fallbackUrl = PICSUM_PLACEHOLDER) => {
  // If no image URL provided, return fallback
  if (!imageUrl) return fallbackUrl;
  
  // If it's a relative URL (starts with / but not //), it's a local image
  if (imageUrl.startsWith('/') && !imageUrl.startsWith('//')) {
    return imageUrl;
  }
  
  // If it's an absolute URL with http/https, return it
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    // Replace placeholder.com URLs with picsum.photos
    if (imageUrl.includes('placeholder.com') || imageUrl.includes('via.placeholder.com')) {
      return fallbackUrl;
    }
    return imageUrl;
  }
  
  // If it's a data URI, return it
  if (imageUrl.startsWith('data:')) {
    return imageUrl;
  }
  
  // For any other format, return the fallback
  return fallbackUrl;
};

/**
 * Create an image onError handler to replace broken images with fallback
 * @param {Event} e - The error event
 */
export const handleImageError = (e) => {
  e.target.onerror = null; // Prevent infinite loop
  e.target.src = PICSUM_PLACEHOLDER; // Use picsum.photos instead of the data URI
};

export default {
  getImageUrl,
  handleImageError,
  DEFAULT_PLACEHOLDER,
  PICSUM_PLACEHOLDER
}; 