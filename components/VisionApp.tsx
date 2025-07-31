"use client";

import { VisionResult } from "../lib/vision-api";
import ImageUploader from "./ImageUploader";
import ResultsDisplay from "./ResultsDisplay";

interface VisionAppProps {
  analysisResult: VisionResult | null;
  onAnalysisComplete: (result: VisionResult) => void;
}

export default function VisionApp({
  analysisResult,
  onAnalysisComplete,
}: VisionAppProps) {
  return (
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Google Vision AI 画像認識デモ
          </h1>

          <a
            href="https://cloud.google.com/vision?hl=ja"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600"
          >
            https://cloud.google.com/vision?hl=ja
          </a>

          <p className="text-gray-600">
            ※オブジェクト・画像等の検出精度を上げるには別途AIにトレーニングが必要です。
          </p>
        </div>

        {/* メインコンテンツ */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* 左側: 画像アップロード */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                画像をアップロード
              </h2>
              <ImageUploader onAnalysisComplete={onAnalysisComplete} />
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
      </div>
    </div>
  );
}
