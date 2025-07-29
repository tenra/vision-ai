import { NextRequest, NextResponse } from "next/server";
import { analyzeImageWithFetch } from "../../../lib/vision-api";

export async function POST(request: NextRequest) {
  try {
    const { imageData } = await request.json();

    if (!imageData) {
      return NextResponse.json(
        { error: "Image data is required" },
        { status: 400 }
      );
    }

    // base64データをBufferに変換
    const imageBuffer = Buffer.from(imageData, "base64");

    // Vision APIで画像分析
    const result = await analyzeImageWithFetch(imageBuffer);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      {
        labels: [],
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
