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
  hasBooster: boolean;
  selectedSplitter?: boolean;
  selectedBooster?: boolean;
}

interface Connection {
  from: FloorData;
  to: FloorData;
  path: Array<{ x: number; y: number }>;
}

export default function FloorCanvas() {
  const [floorCount, setFloorCount] = useState<number>(10);
  const [hasSplitter, setHasSplitter] = useState<boolean>(true);
  const [hasBooster, setHasBooster] = useState<boolean>(false);
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
      // 最初のフロア（最高階数）のみ大きいサイズ
      const isFirstFloor = index === 0;
      const panelWidth = isFirstFloor ? 240 : 120;
      const panelHeightValue = isFirstFloor ? 120 : 60;

      let x, y;

      if (isFirstFloor) {
        // 最初のフロアは左に配置
        x = 50;
        y = 50;
      } else {
        // その他のフロアは右に配置
        const remainingFloors = floorArray.length - 1; // 最初のフロアを除く
        const rightColumnFloors = Math.ceil(remainingFloors / 2); // 右列のフロア数

        const rightIndex = index - 1; // 最初のフロアを除いたインデックス
        const column = Math.floor(rightIndex / rightColumnFloors);
        const row = rightIndex % rightColumnFloors;

        x = 350 + column * 150; // 右側の開始位置
        y = 50 + row * 80;
      }

      return {
        id: `floor-${floor}`,
        x,
        y,
        width: panelWidth,
        height: panelHeightValue,
        floorNumber: floor,
        hasSplitter: hasSplitter,
        hasBooster: hasBooster,
        selectedSplitter: false,
        selectedBooster: false,
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

  // 2分配器クリック処理
  const handleSplitterClick = (id: string) => {
    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          selectedSplitter: !floor.selectedSplitter,
          selectedBooster: false, // 他の選択をクリア
        };
      }
      return {
        ...floor,
        selectedSplitter: false,
        selectedBooster: false,
      };
    });
    setFloors(newFloors);
  };

  // 片方向ブースタークリック処理
  const handleBoosterClick = (id: string) => {
    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          selectedBooster: !floor.selectedBooster,
          selectedSplitter: false, // 他の選択をクリア
        };
      }
      return {
        ...floor,
        selectedSplitter: false,
        selectedBooster: false,
      };
    });
    setFloors(newFloors);
  };

  // 2分配器削除処理
  const handleSplitterDelete = (id: string) => {
    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          hasSplitter: false,
          selectedSplitter: false,
        };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  // 片方向ブースター削除処理
  const handleBoosterDelete = (id: string) => {
    const newFloors = floors.map((floor) => {
      if (floor.id === id) {
        return {
          ...floor,
          hasBooster: false,
          selectedBooster: false,
        };
      }
      return floor;
    });
    setFloors(newFloors);
  };

  // Transformerの更新
  const checkDeselect = (
    e: Konva.KonvaEventObject<MouseEvent | TouchEvent>
  ) => {
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      setSelectedId(null);
      // 選択状態をクリア
      const newFloors = floors.map((floor) => ({
        ...floor,
        selectedSplitter: false,
        selectedBooster: false,
      }));
      setFloors(newFloors);
    }
  };

  // 縦横のみの経路を生成
  const generateOrthogonalPath = (
    from: FloorData,
    to: FloorData
  ): Array<{ x: number; y: number }> => {
    const fromCenterX = from.x + from.width / 2;
    const fromCenterY = from.y + from.height / 2;
    const toCenterX = to.x + to.width / 2;
    const toCenterY = to.y + to.height / 2;
    const path: Array<{ x: number; y: number }> = [];
    // 開始点
    path.push({ x: fromCenterX, y: fromCenterY });
    // 中間点（縦横移動）
    const midX = fromCenterX;
    const midY = toCenterY;
    // 縦移動
    if (Math.abs(fromCenterY - toCenterY) > 5) {
      path.push({ x: midX, y: midY });
    }
    // 横移動
    if (Math.abs(fromCenterX - toCenterX) > 5) {
      path.push({ x: toCenterX, y: midY });
    }
    // 終了点
    path.push({ x: toCenterX, y: toCenterY });
    return path;
  };

  // hasSplitterがtrueのフロアを抽出して接続線を生成
  const getSplitterConnections = (): Connection[] => {
    // すべてのフロアを取得（hasSplitterに関係なく）
    const allFloors = floors;
    const connections: Connection[] = [];

    // 階数順にソート（降順）
    allFloors.sort((a, b) => b.floorNumber - a.floorNumber);

    // 連番で接続
    for (let i = 0; i < allFloors.length - 1; i++) {
      const from = allFloors[i];
      const to = allFloors[i + 1];

      connections.push({
        from,
        to,
        path: generateOrthogonalPath(from, to),
      });
    }

    return connections;
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

          <div className="flex items-center gap-2">
            <input
              id="hasBooster"
              type="checkbox"
              checked={hasBooster}
              onChange={(e) => setHasBooster(e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="hasBooster"
              className="text-sm font-medium text-gray-700"
            >
              片方向ブースター
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

          {/* 接続線用のLayer */}
          <Layer>
            {getSplitterConnections().map((connection, index) => {
              // 経路の各セグメントを描画
              return connection.path.slice(1).map((point, segmentIndex) => {
                const prevPoint = connection.path[segmentIndex];
                return (
                  <Line
                    key={`connection-${connection.from.id}-${connection.to.id}-${segmentIndex}`}
                    points={[prevPoint.x, prevPoint.y, point.x, point.y]}
                    stroke="#0066cc"
                    strokeWidth={1}
                  />
                );
              });
            })}
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
                hasBooster={floor.hasBooster}
                selectedSplitter={floor.selectedSplitter}
                selectedBooster={floor.selectedBooster}
                draggable={true}
                onDragEnd={(e) => handleDragEnd(e, floor.id)}
                onTransformEnd={(e) => handleTransformEnd(e, floor.id)}
                onClick={() => handlePanelClick(floor.id)}
                onSplitterClick={() => handleSplitterClick(floor.id)}
                onBoosterClick={() => handleBoosterClick(floor.id)}
                onSplitterDelete={() => handleSplitterDelete(floor.id)}
                onBoosterDelete={() => handleBoosterDelete(floor.id)}
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
