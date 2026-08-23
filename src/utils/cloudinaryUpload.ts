/**
 * Cloudinary unsigned upload utility.
 * Credentials are safe to use client-side with unsigned upload presets.
 * Upload is triggered explicitly — NOT on every file change — to protect free quota.
 */
export async function uploadToCloudinary(file: File): Promise<string> {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error('Cloudinary environment variables are not configured.');
  }

  const data = new FormData();
  data.append('file', file);
  data.append('upload_preset', uploadPreset);

  const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
    method: 'POST',
    body: data,
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err?.error?.message || 'Cloudinary upload failed');
  }

  const json = await res.json();
  return json.secure_url as string; // always use https
}
