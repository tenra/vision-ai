"use client";

import { useState, useRef, useEffect } from "react";
import {
  VisionLabel,
  VisionResult,
  VisionObject,
  VisionText,
} from "../lib/vision-api";
import ImageWithOverlay from "./ImageWithOverlay";

interface ImageUploaderProps {
  onAnalysisComplete: (result: VisionResult) => void;
}

export default function ImageUploader({
  onAnalysisComplete,
}: ImageUploaderProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<VisionResult | null>(
    null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  // クライアントサイドでのみ実行
  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleFileSelect = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // プレビュー表示
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    setIsUploading(true);

    try {
      // ファイルをBufferに変換
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // API呼び出し
      const response = await fetch("/api/analyze-image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageData: buffer.toString("base64"),
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result: VisionResult = await response.json();
      setAnalysisResult(result);
      onAnalysisComplete(result);
    } catch (error) {
      console.error("Error analyzing image:", error);
      const errorResult = {
        labels: [],
        objects: [],
        texts: [],
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
      setAnalysisResult(errorResult);
      onAnalysisComplete(errorResult);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith("image/")) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(file);
        if (fileInputRef.current) {
          fileInputRef.current.files = dataTransfer.files;
          handleFileSelect({
            target: { files: dataTransfer.files },
          } as React.ChangeEvent<HTMLInputElement>);
        }
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  console.log("analysisResult", analysisResult);

  // サーバーサイドレンダリング時は何も表示しない
  if (!isClient) {
    return (
      <div className="w-full mx-auto">
        <div className="border-2 border-dashed rounded-lg p-2 text-center transition-colors border-gray-300">
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                画像をアップロード
              </p>
              <p className="text-sm text-gray-500 mt-1">
                クリックまたはドラッグ&ドロップで画像を選択
              </p>
            </div>
            <button
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              disabled
            >
              画像を選択
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full mx-auto">
      <div
        className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
          isUploading
            ? "border-blue-300 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
          disabled={isUploading}
        />

        {!previewUrl ? (
          <div className="space-y-4">
            <div className="text-6xl text-gray-400">📷</div>
            <div>
              <p className="text-lg font-medium text-gray-700">
                {isUploading ? "分析中..." : "画像をアップロード"}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                クリックまたはドラッグ&ドロップで画像を選択
              </p>
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isUploading ? "処理中..." : "画像を選択"}
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {analysisResult &&
            (analysisResult.objects.length > 0 ||
              analysisResult.texts.length > 0) ? (
              <ImageWithOverlay
                imageUrl={previewUrl}
                objects={analysisResult.objects}
                texts={analysisResult.texts}
                className="max-w-full h-auto rounded"
              />
            ) : (
              <img
                src={previewUrl}
                alt="Preview"
                className="max-w-full h-auto rounded"
              />
            )}
            {isUploading && (
              <div className="flex items-center justify-center space-x-2">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                <span className="text-blue-600">画像を分析中...</span>
              </div>
            )}
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
            >
              別の画像を選択
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
