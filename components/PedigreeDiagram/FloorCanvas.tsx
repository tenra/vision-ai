"use client";

import { useState, useRef, useEffect } from "react";
import { Stage, Layer, Line, Transformer } from "react-konva";
import Konva from "konva";
import FloorPanel from "./FloorPanel";

interface FloorData {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  floorNumber: number;
  hasSplitter: boolean;
}

export default function FloorCanvas() {
  const [floorCount, setFloorCount] = useState<number>(10);
  const [hasSplitter, setHasSplitter] = useState<boolean>(true);
  const [floors, setFloors] = useState<FloorData[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const transformerRef = useRef<Konva.Transformer>(null);

  // Transformerの接続を管理
  useEffect(() => {
    if (selectedId && transformerRef.current) {
      const node = transformerRef.current.getStage()?.findOne(`#${selectedId}`);
      if (node) {
        transformerRef.current.nodes([node]);
        transformerRef.current.getLayer()?.batchDraw();
      }
    }
  }, [selectedId]);

  const handleFloorSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 入力された階数から2階までを逆順で生成
    const floorArray = Array.from(
      { length: floorCount - 1 },
      (_, i) => floorCount - i
    );

    // 折り返し表示のための計算
    const stageHeight = 600;
    const panelHeight = 80;
    const maxPanelsPerColumn = Math.floor(stageHeight / panelHeight);

    const newFloors: FloorData[] = floorArray.map((floor, index) => {
      const column = Math.floor(index / maxPanelsPerColumn);
      const row = index % maxPanelsPerColumn;
      const x = 100 + column * 200;
      const y = 50 + row * panelHeight;

      return {
        id: `floor-${floor}`,
        x,
        y,
        width: 120,
        height: 60,
        floorNumber: floor,
        hasSplitter: hasSplitter,
      };
    });

    setFloors(newFloors);
  };

  const handleDragEnd = (e: Konva.KonvaEventObject<DragEvent>, id: string) => {
    const node = e.target;
    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          x: node.x(),
          y: node.y(),
        };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  const handleTransformEnd = (e: Konva.KonvaEventObject<Event>, id: string) => {
    const node = e.target;
    const scaleX = node.scaleX();
    const scaleY = node.scaleY();

    // スケールをリセット
    node.scaleX(1);
    node.scaleY(1);

    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          x: node.x(),
          y: node.y(),
          width: Math.max(50, floor.width * scaleX),
          height: Math.max(30, floor.height * scaleY),
        };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  const handlePanelClick = (id: string) => {
    setSelectedId(id);
  };

  // Transformerの更新
  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
    }
  };

  return (
    <div>
      {/* フォーム */}
      <div className="mb-6 p-4 bg-gray-50 rounded-lg">
        <form onSubmit={handleFloorSubmit} className="space-y-4">
          <div className="flex items-center gap-4">
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
          </div>

          <div className="flex items-center gap-2">
            <input
              id="hasSplitter"
              type="checkbox"
              checked={hasSplitter}
              onChange={(e) => setHasSplitter(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="hasSplitter"
              className="text-sm font-medium text-gray-700"
            >
              2分配器
            </label>
          </div>
        </form>
      </div>

      {/* キャンバス */}
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Stage
          width={800}
          height={600}
          onMouseDown={checkDeselect}
          onTouchStart={checkDeselect}
        >
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
            {floors.map((floor) => (
              <FloorPanel
                key={floor.id}
                x={floor.x}
                y={floor.y}
                width={floor.width}
                height={floor.height}
                floorNumber={floor.floorNumber}
                hasSplitter={floor.hasSplitter}
                draggable={true}
                onDragEnd={(e) => handleDragEnd(e, floor.id)}
                onTransformEnd={(e) => handleTransformEnd(e, floor.id)}
                onClick={() => handlePanelClick(floor.id)}
              />
            ))}

            {/* Transformer for resizing */}
            {selectedId && (
              <Transformer
                ref={transformerRef}
                boundBoxFunc={(oldBox, newBox) => {
                  // 最小サイズを制限
                  return newBox.width < 50 || newBox.height < 30
                    ? oldBox
                    : newBox;
                }}
              />
            )}
          </Layer>
        </Stage>
      </div>
    </div>
  );
}
