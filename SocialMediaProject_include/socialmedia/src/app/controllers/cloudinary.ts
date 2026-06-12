import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";

export async function uploadMediaOnCloudinary(buffer: Buffer, filename?: string) {
  // Ensure Cloudinary returns actionable errors...
  if (!buffer || !(buffer instanceof Buffer)) throw new Error("Invalid buffer passed to uploadMediaOnCloudinary");

  const public_id = filename?.replace(/\s+/g, "-") || undefined;

  const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: "briezl-media",
        resource_type: "auto",
        ...(public_id ? { public_id } : {}),
      },
      (error, result) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload returned empty result"));
        return resolve(result as UploadApiResponse);
      }
    );

    uploadStream.end(buffer);
  });

  return {
    success: true,
    url: uploadResult.secure_url,
    public_id: uploadResult.public_id,
    resource_type: uploadResult.resource_type,
  };
}

