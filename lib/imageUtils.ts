/**
 * Image utility functions for handling external and local images
 */

// List of available local fallback images
const LOCAL_IMAGES = [
  '/images/v1.jpg',
  '/images/v2.jpg',
  '/images/v3.jpg',
  '/images/v4.jpg',
  '/images/v5.jpg',
  '/images/v6.jpg',
  '/images/v7.jpg',
  '/images/v8.jpg',
];

/**
 * Get a safe image source with fallback to local images
 * @param imageSrc - The original image source (can be external URL or local path)
 * @param fallbackIndex - Index for fallback image (0-7)
 * @returns Safe image source
 */
export function getSafeImageSrc(imageSrc: string | undefined, fallbackIndex: number = 0): string {
  // If no image source provided, return fallback
  if (!imageSrc) {
    return LOCAL_IMAGES[fallbackIndex % LOCAL_IMAGES.length];
  }

  // If it's already a local path, return as is
  if (imageSrc.startsWith('/')) {
    return imageSrc;
  }

  // If it's a valid external URL from allowed domains, return it
  const allowedDomains = [
    'res.cloudinary.com',
    'localhost',
    'vercel.app',
  ];

  try {
    const url = new URL(imageSrc);
    const isAllowed = allowedDomains.some(domain => 
      url.hostname === domain || url.hostname.endsWith(`.${domain}`)
    );

    if (isAllowed) {
      return imageSrc;
    }
  } catch (error) {
    // Invalid URL, use fallback
  }

  // Return fallback for unallowed external URLs
  return LOCAL_IMAGES[fallbackIndex % LOCAL_IMAGES.length];
}

/**
 * Get a random local image
 * @returns Random local image path
 */
export function getRandomLocalImage(): string {
  const randomIndex = Math.floor(Math.random() * LOCAL_IMAGES.length);
  return LOCAL_IMAGES[randomIndex];
}

/**
 * Get image source for a test option
 * @param option - Test option object
 * @param index - Index of the option (for fallback)
 * @returns Safe image source
 */
export function getTestOptionImage(option: any, index: number = 0): string {
  return getSafeImageSrc(option?.image, index);
}

/**
 * Handle image error by setting fallback
 * @param event - Image error event
 * @param fallbackIndex - Index for fallback image
 */
export function handleImageError(
  event: React.SyntheticEvent<HTMLImageElement>,
  fallbackIndex: number = 0
): void {
  const img = event.currentTarget;
  img.src = LOCAL_IMAGES[fallbackIndex % LOCAL_IMAGES.length];
}
