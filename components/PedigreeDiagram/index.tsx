"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";

// React Konvaを動的インポート（クライアントサイドのみ）
const PedigreeDiagramCanvas = dynamic(() => import("./PedigreeDiagramCanvas"), {
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
            TV盤モジュール例
          </h2>

          {/* React Konva Stage */}
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            {mounted && <PedigreeDiagramCanvas />}
          </div>

          {/* 説明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-2">
              コンポーネント説明
            </h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>
                • <strong>黒い矩形</strong>: TV盤の外枠
              </li>
              <li>
                • <strong>青い線</strong>: 信号の流れ
              </li>
              <li>
                • <strong>下向き三角形</strong>: 信号の分配・増幅
              </li>
              <li>
                • <strong>円（数字）</strong>: 信号の特性・ポート番号
              </li>
              <li>
                • <strong>水平線（矢印）</strong>: 信号の方向性
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
