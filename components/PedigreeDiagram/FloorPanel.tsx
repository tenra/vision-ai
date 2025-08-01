"use client";

import { Group, Rect, Text, Path, Circle } from "react-konva";
import Konva from "konva";

interface FloorPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  floorNumber: number;
  hasSplitter?: boolean;
  hasBooster?: boolean;
  draggable?: boolean;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd?: (e: Konva.KonvaEventObject<Event>) => void;
  onClick?: () => void;
  onSplitterClick?: () => void;
  onBoosterClick?: () => void;
  onSplitterDelete?: () => void;
  onBoosterDelete?: () => void;
  selectedSplitter?: boolean;
  selectedBooster?: boolean;
}

export default function FloorPanel({
  x,
  y,
  width,
  height,
  floorNumber,
  hasSplitter = false,
  hasBooster = false,
  draggable = false,
  onDragEnd,
  onTransformEnd,
  onClick,
  onSplitterClick,
  onBoosterClick,
  onSplitterDelete,
  onBoosterDelete,
  selectedSplitter = false,
  selectedBooster = false,
}: FloorPanelProps) {
  return (
    <Group
      id={`floor-${floorNumber}`}
      x={x}
      y={y}
      draggable={draggable}
      onDragEnd={onDragEnd}
      onTransformEnd={onTransformEnd}
      onClick={onClick}
    >
      {/* 黒い矩形枠 */}
      <Rect
        x={0}
        y={0}
        width={width}
        height={height}
        stroke="#000000"
        strokeWidth={2}
        fill="transparent"
      />

      {/* 階数ラベル */}
      <Text
        x={0}
        y={-25}
        width={width}
        text={`${floorNumber}01号室`}
        fontSize={14}
        fontFamily="Arial"
        fill="#000000"
        align="center"
        fontWeight="bold"
      />

      {/* 片方向ブースター（下向き三角形） */}
      {hasBooster && (
        <Group>
          <Path
            data="M 0 8 L -6 -8 L 6 -8 Z"
            x={width / 2}
            y={height / 2 - 15}
            //fill="#0066cc"
            stroke="#0066cc"
            strokeWidth={1}
            onClick={onBoosterClick}
            onTap={onBoosterClick}
          />
          {selectedBooster && (
            <Group>
              {/* バツボタンの背景 */}
              <Circle
                x={width / 2 + 15}
                y={height / 2 - 30}
                radius={8}
                fill="#f0f0f0"
                stroke="#cccccc"
                strokeWidth={1}
                onClick={onBoosterDelete}
                onTap={onBoosterDelete}
              />
              {/* バツボタンのテキスト */}
              <Text
                x={width / 2 + 7}
                y={height / 2 - 34}
                text="×"
                fontSize={12}
                fontFamily="Arial"
                fill="#000000"
                align="center"
                onClick={onBoosterDelete}
                onTap={onBoosterDelete}
              />
            </Group>
          )}
        </Group>
      )}

      {/* 2分配器表示 */}
      {hasSplitter && (
        <Group>
          <Text
            x={width / 2 - 8}
            y={height / 2 + 5}
            text="②"
            fontSize={16}
            fontFamily="Arial"
            fill="#0066cc"
            align="center"
            fontWeight="bold"
            onClick={onSplitterClick}
            onTap={onSplitterClick}
          />
          {selectedSplitter && (
            <Group>
              {/* バツボタンの背景 */}
              <Circle
                x={width / 2 + 15}
                y={height / 2 - 5}
                radius={8}
                fill="#f0f0f0"
                stroke="#cccccc"
                strokeWidth={1}
                onClick={onSplitterDelete}
                onTap={onSplitterDelete}
              />
              {/* バツボタンのテキスト */}
              <Text
                x={width / 2 + 7}
                y={height / 2 - 9}
                text="×"
                fontSize={12}
                fontFamily="Arial"
                fill="#000000"
                align="center"
                onClick={onSplitterDelete}
                onTap={onSplitterDelete}
              />
            </Group>
          )}
        </Group>
      )}
    </Group>
  );
}
