"use client";

import { useState } from "react";

interface MapLocation {
  lat: number;
  lng: number;
  name: string;
}

interface StaticMapGeneratorProps {
  currentLocation: MapLocation;
  currentZoom: number;
}

export default function StaticMapGenerator({
  currentLocation,
  currentZoom,
}: StaticMapGeneratorProps) {
  const [staticMapUrl, setStaticMapUrl] = useState<string>("");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const generateStaticMap = async () => {
    setIsGenerating(true);
    try {
      const apiKey = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;
      if (!apiKey) {
        alert("Google Maps API キーが設定されていません");
        return;
      }

      // 高画質な静的地図を生成するためのパラメータ
      const staticMapUrl = `https://maps.googleapis.com/maps/api/staticmap?center=${currentLocation.lat},${currentLocation.lng}&zoom=${currentZoom}&size=1200x800&scale=2&maptype=roadmap&key=${apiKey}`;
      setStaticMapUrl(staticMapUrl);
    } catch (error) {
      console.error("静的地図の生成に失敗しました:", error);
      alert("静的地図の生成に失敗しました");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <>
      {/* 選択された位置 */}
      <div className="p-4 bg-blue-50 rounded-lg w-fit">
        <h3 className="text-blue-800 font-medium mb-2">選択された位置</h3>
        <div className="text-sm text-blue-700">
          <p>
            <strong>緯度:</strong> {currentLocation.lat.toFixed(6)}
          </p>
          <p>
            <strong>経度:</strong> {currentLocation.lng.toFixed(6)}
          </p>
        </div>
        <button
          onClick={generateStaticMap}
          disabled={isGenerating}
          className="mt-3 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
        >
          {isGenerating ? "生成中..." : "静的地図を生成"}
        </button>
      </div>

      {/* 生成された静的地図 */}
      {staticMapUrl && (
        <div className="p-4 bg-green-50 rounded-lg w-full mt-6">
          <h3 className="text-green-800 font-medium mb-2">
            生成された静的地図
          </h3>
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <img src={staticMapUrl} alt="静的地図" className="w-full h-auto" />
          </div>
        </div>
      )}
    </>
  );
}
