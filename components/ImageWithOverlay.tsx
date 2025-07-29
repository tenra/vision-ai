"use client";

import { VisionObject } from "../lib/vision-api";

interface ImageWithOverlayProps {
  imageUrl: string;
  objects: VisionObject[];
  className?: string;
}

export default function ImageWithOverlay({
  imageUrl,
  objects,
  className = "",
}: ImageWithOverlayProps) {
  return (
    <div className={`relative ${className}`}>
      <img
        src={imageUrl}
        alt="Uploaded image with object detection"
        className="max-w-full h-auto rounded"
      />
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
            key={index}
            className="absolute border-1 border-red-500 bg-opacity-20"
            style={{
              left: `${left}%`,
              top: `${top}%`,
              width: `${width}%`,
              height: `${height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 text-red-500 text-xs px-2 py-1">
              {obj.name} ({(obj.score * 100).toFixed(1)}%)
            </div>
          </div>
        );
      })}
    </div>
  );
}
