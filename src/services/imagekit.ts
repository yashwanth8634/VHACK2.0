const ImageKitSDK = require("@imagekit/nodejs");
const ImageKit = ImageKitSDK.default || ImageKitSDK;

/**
 * ImageKit Service
 * Handles image upload using ImageKit SDK
 * The image URLs returned are stored in MongoDB
 */

// Initialize ImageKit (lazy singleton)
let _imagekit: any = null;

function getImageKitInstance() {
  if (!_imagekit) {
    _imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT,
    });
  }
  return _imagekit;
}

/**
 * Upload image to ImageKit from buffer
 * @param buffer - Image buffer
 * @param fileName - Original filename
 * @returns Image URL to store in MongoDB
 */
export const uploadImage = async (
  buffer: Buffer,
  fileName: string = "image.jpg"
): Promise<string> => {
  try {
    if (
      !process.env.IMAGEKIT_PUBLIC_KEY ||
      !process.env.IMAGEKIT_PRIVATE_KEY ||
      !process.env.IMAGEKIT_URL_ENDPOINT
    ) {
      console.warn("⚠️ ImageKit not configured. Using base64 fallback.");
      return `data:image/jpeg;base64,${buffer.toString("base64")}`;
    }

    console.log("📤 Uploading to ImageKit:", fileName);

    const imagekit = getImageKitInstance();
    const result = await imagekit.files.upload({
      file: buffer.toString("base64"),
      fileName: fileName,
      folder: "/vhack2/payments",
      useUniqueFileName: true,
    });

    console.log("✅ ImageKit upload successful:", result.url);
    return result.url;
  } catch (error: any) {
    console.error("❌ ImageKit Upload Error:", error.message);

    // Fallback: return base64 data URL
    console.warn("⚠️ Falling back to base64 data URL");
    return `data:image/jpeg;base64,${buffer.toString("base64")}`;
  }
};

/**
 * Delete image from ImageKit
 * @param fileId - ImageKit file ID
 */
export const deleteImage = async (
  fileId: string
): Promise<{ success: boolean; error?: string }> => {
  try {
    const imagekit = getImageKitInstance();
    await imagekit.files.deleteFile(fileId);
    return { success: true };
  } catch (error: any) {
    console.error("ImageKit Delete Error:", error.message);
    return { success: false, error: error.message };
  }
};

