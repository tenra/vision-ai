"use client";

import { Group, Rect, Text } from "react-konva";
import Konva from "konva";

interface FloorPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  floorNumber: number;
  hasSplitter?: boolean;
  draggable?: boolean;
  onDragEnd?: (e: Konva.KonvaEventObject<DragEvent>) => void;
  onTransformEnd?: (e: Konva.KonvaEventObject<Event>) => void;
  onClick?: () => void;
}

export default function FloorPanel({
  x,
  y,
  width,
  height,
  floorNumber,
  hasSplitter = false,
  draggable = false,
  onDragEnd,
  onTransformEnd,
  onClick,
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

      {/* 2分配器表示 */}
      {hasSplitter && (
        <Text
          x={width / 2 - 8}
          y={height / 2 - 8}
          text="②"
          fontSize={16}
          fontFamily="Arial"
          fill="#0066cc"
          align="center"
          fontWeight="bold"
        />
      )}
    </Group>
  );
}
