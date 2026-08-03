import { NextResponse } from "next/server";
import cloudinary, { cloudinaryConfigured } from "@/lib/cloudinary";
import { isAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
// allow larger base64 payloads (compressed images)
export const maxDuration = 30;

// POST /api/upload — admin uploads an image to Cloudinary, returns its URL.
// Body: { image: "data:image/...;base64,..." }
export async function POST(request) {
  if (!isAdmin()) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  if (!cloudinaryConfigured()) {
    return NextResponse.json(
      { error: "Image hosting is not configured on the server." },
      { status: 500 }
    );
  }
  try {
    const { image } = await request.json();
    if (!image || typeof image !== "string" || !image.startsWith("data:image/")) {
      return NextResponse.json({ error: "No valid image provided" }, { status: 400 });
    }

    const res = await cloudinary.uploader.upload(image, {
      folder: "sitara-fans",
      resource_type: "image",
      // let Cloudinary optimise format/quality on delivery
      transformation: [{ quality: "auto", fetch_format: "auto" }],
    });

    return NextResponse.json({ url: res.secure_url, publicId: res.public_id });
  } catch (e) {
    console.error("POST /api/upload", e);
    return NextResponse.json({ error: "Upload failed. Please try again." }, { status: 500 });
  }
}
