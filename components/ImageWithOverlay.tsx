"use client";

import { VisionObject, VisionText } from "../lib/vision-api";
import { useState, useRef, useEffect } from "react";

interface ImageWithOverlayProps {
  imageUrl: string;
  objects: VisionObject[];
  texts?: VisionText[];
  className?: string;
}

export default function ImageWithOverlay({
  imageUrl,
  objects,
  texts = [],
  className = "",
}: ImageWithOverlayProps) {
  const [imageSize, setImageSize] = useState<{
    width: number;
    height: number;
  } | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const img = imageRef.current;
    if (img) {
      const handleLoad = () => {
        setImageSize({ width: img.naturalWidth, height: img.naturalHeight });
      };

      if (img.complete) {
        handleLoad();
      } else {
        img.addEventListener("load", handleLoad);
        return () => img.removeEventListener("load", handleLoad);
      }
    }
  }, [imageUrl]);

  return (
    <div className={`relative ${className}`}>
      <img
        ref={imageRef}
        src={imageUrl}
        alt="Uploaded image with object and text detection"
        className="max-w-full h-auto rounded"
      />

      {/* オブジェクト検出のオーバーレイ */}
      {objects.map((obj, index) => {
        // 正規化された座標をパーセンテージに変換
        const vertices = obj.boundingPoly.vertices;
        if (vertices.length < 3) return null;

        // バウンディングボックスの座標を計算
        const minX = Math.min(...vertices.map((v) => v.x));
        const maxX = Math.max(...vertices.map((v) => v.x));
        const minY = Math.min(...vertices.map((v) => v.y));
        const maxY = Math.max(...vertices.map((v) => v.y));

        const left = minX * 100;
        const top = minY * 100;
        const width = (maxX - minX) * 100;
        const height = (maxY - minY) * 100;

        return (
          <div
            key={`obj-${index}`}
            className="absolute border-1 border-red-500 bg-opacity-20"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-red-500 text-white text-xs px-2 py-1 rounded">
              {obj.name} ({(obj.score * 100).toFixed(1)}%)
            </div>
          </div>
        );
      })}

      {/* テキスト検出のオーバーレイ */}
      {texts.map((text, index) => {
        const vertices = text.boundingBox.vertices;
        if (vertices.length < 3) return null;

        // 座標が正規化されているかチェック（0-1の範囲かどうか）
        const isNormalized = vertices.every(
          (v) => v.x >= 0 && v.x <= 1 && v.y >= 0 && v.y <= 1
        );

        let normalizedVertices = vertices;

        // 正規化されていない場合、実際の画像サイズで正規化
        if (!isNormalized && imageSize) {
          normalizedVertices = vertices.map((v) => ({
            x: v.x / imageSize.width,
            y: v.y / imageSize.height,
          }));
        } else if (!isNormalized && !imageSize) {
          // 画像サイズが取得できない場合は表示しない
          return null;
        }

        // バウンディングボックスの座標を計算
        const minX = Math.min(...normalizedVertices.map((v) => v.x));
        const maxX = Math.max(...normalizedVertices.map((v) => v.x));
        const minY = Math.min(...normalizedVertices.map((v) => v.y));
        const maxY = Math.max(...normalizedVertices.map((v) => v.y));

        const left = minX * 100;
        const top = minY * 100;
        const width = (maxX - minX) * 100;
        const height = (maxY - minY) * 100;

        return (
          <div
            key={`text-${index}`}
            className="absolute border-1 border-green-400 bg-opacity-20"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 bg-green-500 text-white text-xs px-2 py-1 rounded max-w-xs truncate">
              &ldquo;{text.text}&rdquo; ({(text.confidence * 100).toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}
