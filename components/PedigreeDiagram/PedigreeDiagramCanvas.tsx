"use client";

import { Stage, Layer, Line } from "react-konva";
import TVPanel from "./TVPanel";

export default function PedigreeDiagramCanvas() {
  return (
    <Stage width={800} height={400}>
      {/* 背景グリッド用のLayer */}
      <Layer>
        {/* 縦線 */}
        {Array.from({ length: 9 }, (_, i) => (
          <Line
            key={`v-${i}`}
            points={[i * 100, 0, i * 100, 400]}
            stroke="#f0f0f0"
            strokeWidth={1}
          />
        ))}
        {/* 横線 */}
        {Array.from({ length: 5 }, (_, i) => (
          <Line
            key={`h-${i}`}
            points={[0, i * 100, 800, i * 100]}
            stroke="#f0f0f0"
            strokeWidth={1}
          />
        ))}
      </Layer>

      {/* メインコンテンツ用のLayer */}
      <Layer>
        {/* TV盤モジュール */}
        <TVPanel
          x={100}
          y={50}
          width={120}
          height={100}
          label="803号室前TV盤"
          showTriangle={true}
          showCircle2={true}
        />

        {/* 簡略版TV盤モジュール（903号室タイプ） */}
        <TVPanel
          x={300}
          y={50}
          width={120}
          height={100}
          label="903号室前TV盤"
          showTriangle={false}
          showCircle2={false}
        />

        {/* 別のTV盤モジュール */}
        <TVPanel
          x={500}
          y={50}
          width={120}
          height={100}
          label="804号室横TV盤"
          showTriangle={true}
          showCircle2={true}
        />

        {/* 接続線の例 */}
        <Line
          points={[160, 150, 360, 150]}
          stroke="#0066cc"
          strokeWidth={2}
          dash={[5, 5]}
        />

        <Line
          points={[360, 150, 560, 150]}
          stroke="#0066cc"
          strokeWidth={2}
          dash={[5, 5]}
        />
      </Layer>
    </Stage>
  );
}
