// backend/src/utils/cloudinary.ts
import { v2 as cloudinary, UploadApiOptions } from 'cloudinary';

// ─── Configuration ────────────────────────────────────────────────────────────
// Credentials are injected from .env — never hard-coded.

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key:    process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// ─── Upload ───────────────────────────────────────────────────────────────────

/**
 * Uploads a raw image Buffer to Cloudinary and returns the secure URL.
 *
 * @param buffer - The raw image file bytes (from multer memoryStorage)
 * @param folder - Cloudinary folder path (e.g. 'ustaadpk/profiles')
 * @param publicId - Optional stable ID for the asset. If provided, re-uploading
 *                   with the same ID replaces the old image instead of creating a new one.
 *                   Pass `tutor_<userId>` so each tutor always has exactly one photo.
 * @returns The secure HTTPS URL of the uploaded image
 */
export const uploadImageBuffer = (
  buffer: Buffer,
  folder: string,
  publicId?: string
): Promise<string> => {
  return new Promise((resolve, reject) => {
    const options: UploadApiOptions = {
      folder,
      resource_type: 'image',
      // Auto-optimize format (serves WebP to modern browsers, JPEG elsewhere)
      // and quality — Cloudinary decides the best balance of size vs. quality.
      format: 'auto',
      quality: 'auto',
      // Crop to a square centered on the detected face. Ideal for profile photos.
      transformation: [
        { width: 400, height: 400, crop: 'fill', gravity: 'face' },
      ],
    };

    if (publicId) {
      options.public_id = publicId;
      options.overwrite = true; // replace existing asset with the same public_id
    }

    const uploadStream = cloudinary.uploader.upload_stream(options, (error, result) => {
      if (error || !result) {
        reject(error ?? new Error('Cloudinary upload returned no result'));
      } else {
        resolve(result.secure_url);
      }
    });

    uploadStream.end(buffer);
  });
};

// ─── Delete ───────────────────────────────────────────────────────────────────

/**
 * Deletes an image from Cloudinary by its public ID.
 * Called when a tutor updates their photo (old one is removed) or deletes their account.
 *
 * @param publicId - The Cloudinary public_id of the asset to delete
 */
export const deleteCloudinaryImage = async (publicId: string): Promise<void> => {
  await cloudinary.uploader.destroy(publicId);
};
