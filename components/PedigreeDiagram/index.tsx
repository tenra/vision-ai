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
  const [activeTab, setActiveTab] = useState<"tv" | "floor">("floor");

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

        {/* タブ切り替え */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
            <button
              onClick={() => setActiveTab("floor")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "floor"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              階層図
            </button>
            <button
              onClick={() => setActiveTab("tv")}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === "tv"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              TV盤図
            </button>
          </div>
        </div>

        {/* メインコンテンツ */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          {activeTab === "floor" ? (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                階層図作成
              </h2>
              {mounted && <FloorCanvas />}
            </>
          ) : (
            <>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                TV盤モジュール例
              </h2>
              {mounted && <PedigreeDiagramCanvas />}
            </>
          )}

          {/* 説明 */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-blue-800 font-medium mb-2">
              {activeTab === "floor" ? "階層図の説明" : "TV盤の説明"}
            </h3>
            {activeTab === "floor" ? (
              <ul className="text-blue-700 text-sm space-y-1">
                <li>
                  • <strong>階数入力</strong>: 建物の最高階数を入力
                </li>
                <li>
                  • <strong>黒い枠</strong>: 各階層を表現
                </li>
                <li>
                  • <strong>縦線</strong>: 階層間の接続
                </li>
                <li>
                  • <strong>自動生成</strong>: 入力階数から2階まで自動配置
                </li>
              </ul>
            ) : (
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
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
