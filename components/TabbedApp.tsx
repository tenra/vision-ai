"use client";

import { useState } from "react";
import { VisionResult } from "../lib/vision-api";
import VisionApp from "./VisionApp";
import PedigreeDiagram from "./PedigreeDiagram";
import MapsStatic from "./MapsStatic";

type TabType = "vision" | "pedigree" | "maps";

export default function TabbedApp() {
  const [activeTab, setActiveTab] = useState<TabType>("vision");
  const [visionAnalysisResult, setVisionAnalysisResult] =
    useState<VisionResult | null>(null);

  const handleVisionAnalysisComplete = (result: VisionResult) => {
    setVisionAnalysisResult(result);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* タブナビゲーション */}
      <div className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("vision")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "vision"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Vision AI 画像認識デモ
            </button>
            <button
              onClick={() => setActiveTab("pedigree")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "pedigree"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              系統図作成デモ
            </button>
            <button
              onClick={() => setActiveTab("maps")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "maps"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              静的マップ作成デモ
            </button>
          </div>
        </div>
      </div>

      {/* タブコンテンツ */}
      <div className="flex-1">
        {activeTab === "vision" && (
          <VisionApp
            analysisResult={visionAnalysisResult}
            onAnalysisComplete={handleVisionAnalysisComplete}
          />
        )}
        {activeTab === "pedigree" && <PedigreeDiagram />}
        {activeTab === "maps" && <MapsStatic />}
      </div>
    </div>
  );
}
