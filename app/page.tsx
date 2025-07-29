"use client";

import { useState } from "react";
import { VisionResult } from "../lib/vision-api";
import ImageUploader from "../components/ImageUploader";
import ResultsDisplay from "../components/ResultsDisplay";

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState<VisionResult | null>(
    null
  );

  const handleAnalysisComplete = (result: VisionResult) => {
    setAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* ヘッダー */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            topaz Vision AI 画像認識デモ
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Google Cloud Vision APIを使用して画像をアップロードし、
            認識されたラベルを表示します。画像をドラッグ&ドロップまたは
            クリックして選択してください。
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* 左側: 画像アップロード */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                画像をアップロード
              </h2>
              <ImageUploader onAnalysisComplete={handleAnalysisComplete} />
            </div>
          </div>

          {/* 右側: 結果表示 */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                分析結果
              </h2>
              <ResultsDisplay result={analysisResult} />
            </div>
          </div>
        </div>

        {/* フッター */}
        <div className="mt-12 text-center">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-2">🚀 機能</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600">
              <div className="flex items-center justify-center">
                <span className="mr-2">📷</span>
                ドラッグ&ドロップ対応
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">🔍</span>
                高精度ラベル認識
              </div>
              <div className="flex items-center justify-center">
                <span className="mr-2">⚡</span>
                リアルタイム分析
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
