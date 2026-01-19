import { NextResponse } from "next/server";
import cloudinary from '@/lib/cloudinary';
import { uploadMediaOnCloudinary } from "@/app/controllers/cloudinary";

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const previousPublicId = formData.get("previousPublicId");
    
    if (!file) return NextResponse.json({ success: false, error: "No file provided" },{ status: 400 });

    if (previousPublicId) await cloudinary.uploader.destroy(String(previousPublicId));


    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await uploadMediaOnCloudinary(buffer, file.name);

    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Server error" },{ status: 500 });
  }
}
