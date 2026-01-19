import cloudinary from "@/lib/cloudinary";
import { UploadApiResponse } from "cloudinary";


export async function uploadMediaOnCloudinary(buffer: Buffer,filename?: string) {
  try {
    const uploadResult: UploadApiResponse = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            folder: "briezl-media",
            resource_type: "auto",
            public_id: filename,
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result as UploadApiResponse);
          }
        ).end(buffer);
      }
    );

    return {
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
      resource_type: uploadResult.resource_type,
    };
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : "Unknown error");
  }
}
