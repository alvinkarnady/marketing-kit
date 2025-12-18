import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export default cloudinary;

/**
 * Upload image to Cloudinary
 * @param buffer - File buffer
 * @param folder - Folder path in Cloudinary
 * @returns URL of uploaded image
 */
export async function uploadToCloudinary(
  buffer: Buffer,
  folder: string = "marketing-kit"
): Promise<string> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: folder,
        resource_type: "image",
        transformation: [
          { width: 1200, crop: "limit" },
          { quality: "auto" },
          { fetch_format: "auto" },
        ],
      },
      (error, result) => {
        if (error) {
          console.error("Cloudinary upload error:", error);
          reject(error);
        } else {
          resolve(result!.secure_url);
        }
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete image from Cloudinary
 * @param imageUrl - Full Cloudinary URL or public_id
 */
export async function deleteFromCloudinary(imageUrl: string): Promise<void> {
  try {
    // Check if it's a Cloudinary URL
    if (!imageUrl.includes("cloudinary.com")) {
      console.log("Not a Cloudinary URL, skipping delete");
      return;
    }

    // Extract public_id from URL
    // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123456/folder/filename.jpg
    const urlParts = imageUrl.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");

    if (uploadIndex === -1) {
      console.error("Invalid Cloudinary URL format");
      return;
    }

    // Get everything after 'upload/vXXXXXX/' or 'upload/'
    const pathAfterUpload = urlParts.slice(uploadIndex + 1).join("/");

    // Remove version number if present (starts with 'v' followed by numbers)
    const pathWithoutVersion = pathAfterUpload.replace(/^v\d+\//, "");

    // Remove file extension
    const publicId = pathWithoutVersion.replace(/\.[^/.]+$/, "");

    console.log("Deleting from Cloudinary:", publicId);

    const result = await cloudinary.uploader.destroy(publicId);
    console.log("Cloudinary delete result:", result);
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    // Don't throw error - allow operation to continue even if delete fails
  }
}

/**
 * Get optimized image URL from Cloudinary
 * @param imageUrl - Original Cloudinary URL
 * @param options - Transformation options
 */
export function getOptimizedImageUrl(
  imageUrl: string,
  options?: {
    width?: number;
    height?: number;
    crop?: string;
    quality?: string | number;
    format?: string;
  }
): string {
  if (!imageUrl.includes("cloudinary.com")) {
    return imageUrl;
  }

  const {
    width = 800,
    height,
    crop = "limit",
    quality = "auto",
    format = "auto",
  } = options || {};

  // Build transformation string
  const transformations = [
    width && `w_${width}`,
    height && `h_${height}`,
    crop && `c_${crop}`,
    quality && `q_${quality}`,
    format && `f_${format}`,
  ]
    .filter(Boolean)
    .join(",");

  // Insert transformations into URL
  return imageUrl.replace("/upload/", `/upload/${transformations}/`);
}
