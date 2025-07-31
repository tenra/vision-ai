"use client";

import { useState } from "react";
import { Stage, Layer, Line } from "react-konva";
import FloorPanel from "./FloorPanel";

export default function FloorCanvas() {
  const [floorCount, setFloorCount] = useState<number>(10);
  const [floors, setFloors] = useState<number[]>([]);

  const handleFloorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 入力された階数から2階までを逆順で生成
    const floorArray = Array.from(
      { length: floorCount - 1 },
      (_, i) => floorCount - i
    );
    setFloors(floorArray);
  };

  return (
    <div>
      {/* フォーム */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <form onSubmit={handleFloorSubmit} className="flex items-center gap-4">
          <label
            htmlFor="floorCount"
            className="text-sm font-medium text-gray-700"
          >
            建物の階数:
          </label>
          <input
            id="floorCount"
            type="number"
            min="2"
            max="50"
            value={floorCount}
            onChange={(e) => setFloorCount(Number(e.target.value))}
            className="px-3 py-2 border border-gray-300 text-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            作成する
          </button>
        </form>
      </div>

      {/* キャンバス */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Stage width={800} height={600}>
          {/* 背景グリッド用のLayer */}
          <Layer>
            {/* 縦線 */}
            {Array.from({ length: 9 }, (_, i) => (
              <Line
                key={`v-${i}`}
                points={[i * 100, 0, i * 100, 600]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}
            {/* 横線 */}
            {Array.from({ length: 7 }, (_, i) => (
              <Line
                key={`h-${i}`}
                points={[0, i * 100, 800, i * 100]}
                stroke="#f0f0f0"
                strokeWidth={1}
              />
            ))}
          </Layer>

          {/* 階層パネル用のLayer */}
          <Layer>
            {floors.map((floor, index) => (
              <FloorPanel
                key={floor}
                x={100}
                y={50 + index * 80}
                width={120}
                height={60}
                floorNumber={floor}
              />
            ))}

            {/* 接続線（階層間の縦線） */}
            {floors.length > 1 &&
              floors.map((floor, index) => {
                if (index < floors.length - 1) {
                  return (
                    <Line
                      key={`connector-${floor}`}
                      points={[160, 110 + index * 80, 160, 130 + index * 80]}
                      stroke="#000000"
                      strokeWidth={2}
                    />
                  );
                }
                return null;
              })}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
