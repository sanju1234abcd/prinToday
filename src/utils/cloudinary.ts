export const optimizeCloudinaryUrl = (url: string | undefined | null): string => {
  if (!url) return '';
  // Check if it's a cloudinary URL and doesn't already have q_auto
  if (url.includes('res.cloudinary.com') && url.includes('/upload/') && !url.includes('/upload/q_auto')) {
    return url.replace('/upload/', '/upload/q_auto/');
  }
  return url;
};
