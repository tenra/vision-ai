"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

const FloorCanvas = dynamic(() => import("./FloorCanvas"), {
  ssr: false,
  loading: () => (
    <div className="flex items-center justify-center h-96 bg-gray-100 rounded-lg">
      <div className="text-gray-500">読み込み中...</div>
    </div>
  ),
});

export default function PedigreeDiagram() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            系統図作成デモ
          </h1>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            基本設定
          </h2>
          {mounted && <FloorCanvas />}
        </div>
      </div>
    </div>
  );
}
