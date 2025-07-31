"use client";

import { Group, Rect, Text } from "react-konva";

interface FloorPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  floorNumber: number;
}

export default function FloorPanel({
  x,
  y,
  width,
  height,
  floorNumber,
}: FloorPanelProps) {
  return (
    <Group>
      {/* 黒い矩形枠 */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="#000000"
        strokeWidth={2}
        fill="transparent"
      />

      {/* 階数ラベル */}
      <Text
        x={x}
        y={y - 25}
        width={width}
        text={`${floorNumber}01号室`}
        fontSize={14}
        fontFamily="Arial"
        fill="#000000"
        align="center"
        fontWeight="bold"
      />
    </Group>
  );
}
