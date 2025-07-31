"use client";

import { VisionText } from "../lib/vision-api";
import { useState, useRef, useEffect } from "react";

interface TextZoomOverlayProps {
  imageUrl: string;
  texts: VisionText[];
  imageSize: { width: number; height: number } | null;
  className?: string;
}

export default function TextZoomOverlay({
  imageUrl,
  texts,
  imageSize,
  className = "",
}: TextZoomOverlayProps) {
  const [selectedText, setSelectedText] = useState<VisionText | null>(null);
  const [zoomPosition, setZoomPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const zoomRef = useRef<HTMLDivElement>(null);

  // デフォルトで最初のテキストを選択
  useEffect(() => {
    if (texts.length > 0 && !selectedText) {
      setSelectedText(texts[0]);
    }
  }, [texts, selectedText]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomRef.current) {
      setIsDragging(true);
      setDragStart({
        x: e.clientX - zoomPosition.x,
        y: e.clientY - zoomPosition.y,
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      setZoomPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTextClick = (text: VisionText) => {
    setSelectedText(text);
  };

  if (!selectedText || !imageSize) return null;

  // 選択されたテキストの座標を正規化
  const vertices = selectedText.boundingBox.vertices;
  const isNormalized = vertices.every(
    (v) => v.x >= 0 && v.x <= 1 && v.y >= 0 && v.y <= 1
  );

  let normalizedVertices = vertices;
  if (!isNormalized && imageSize) {
    normalizedVertices = vertices.map((v) => ({
      x: v.x / imageSize.width,
      y: v.y / imageSize.height,
    }));
  }

  // テキスト領域の座標を計算
  const minX = Math.min(...normalizedVertices.map((v) => v.x));
  const maxX = Math.max(...normalizedVertices.map((v) => v.x));
  const minY = Math.min(...normalizedVertices.map((v) => v.y));
  const maxY = Math.max(...normalizedVertices.map((v) => v.y));

  const textWidth = (maxX - minX) * imageSize.width;
  const textHeight = (maxY - minY) * imageSize.height;

  return (
    <div className={`${className}`}>
      {/* テキスト選択ボタン */}
      <div className="mb-4 flex flex-wrap gap-2">
        {texts.map((text, index) => (
          <button
            key={index}
            onClick={() => handleTextClick(text)}
            className={`px-3 py-1 text-xs rounded border ${
              selectedText === text
                ? "bg-green-500 text-white border-green-500"
                : "bg-white text-green-600 border-green-400 hover:bg-green-50"
            }`}
          >
            &ldquo;{text.text}&rdquo; ({(text.confidence * 100).toFixed(1)}%)
          </button>
        ))}
      </div>

      {/* 拡大表示エリア */}
      <div
        ref={zoomRef}
        className="relative border-1 border-green-400 bg-white shadow-lg cursor-move"
        style={{
          width: `${textWidth * 3}px`,
          height: `${textHeight * 3}px`,
          transform: `translate(${zoomPosition.x}px, ${zoomPosition.y}px)`,
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        {/* 拡大された画像 */}
        <div
          className="absolute overflow-hidden"
          style={{
            width: "100%",
            height: "100%",
            backgroundImage: `url(${imageUrl})`,
            backgroundSize: `${imageSize.width * 3}px ${
              imageSize.height * 3
            }px`,
            backgroundPosition: `-${minX * imageSize.width * 3}px -${
              minY * imageSize.height * 3
            }px`,
          }}
        />

        {/* テキスト領域のハイライト */}
        <div
          className="absolute border-1 border-green-500 bg-opacity-20"
          style={{
            left: "0%",
            top: "0%",
            width: "100%",
            height: "100%",
          }}
        />
      </div>
    </div>
  );
}
