"use client";

import { VisionResult, VisionLabel } from "../lib/vision-api";

interface ResultsDisplayProps {
  result: VisionResult | null;
}

export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  if (!result) {
    return null;
  }

  if (result.error) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-red-500 text-xl mr-2">⚠️</div>
            <div>
              <h3 className="text-red-800 font-medium">エラーが発生しました</h3>
              <p className="text-red-600 text-sm mt-1">{result.error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (result.labels.length === 0) {
    return (
      <div className="w-full max-w-md mx-auto mt-6">
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-center">
            <div className="text-yellow-500 text-xl mr-2">🔍</div>
            <div>
              <h3 className="text-yellow-800 font-medium">認識結果なし</h3>
              <p className="text-yellow-600 text-sm mt-1">
                画像からラベルを認識できませんでした。別の画像をお試しください。
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md mx-auto mt-6">
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">
            認識されたラベル ({result.labels.length}件)
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            信頼度の高い順に表示されています
          </p>
        </div>
        <div className="divide-y divide-gray-200">
          {result.labels.map((label: VisionLabel, index: number) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h4 className="text-sm font-medium text-gray-900">
                    {label.description}
                  </h4>
                  <p className="text-xs text-gray-500 mt-1">
                    信頼度: {(label.score * 100).toFixed(1)}%
                  </p>
                </div>
                <div className="ml-4">
                  <div className="w-16 bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${label.score * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
