"use client";

import { Group, Rect, Text, Line, Circle, Path } from "react-konva";

interface TVPanelProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  showTriangle?: boolean;
  showCircle2?: boolean;
}

export default function TVPanel({
  x,
  y,
  width,
  height,
  label,
  showTriangle = true,
  showCircle2 = true,
}: TVPanelProps) {
  const panelPadding = 10;
  const internalWidth = width - panelPadding * 2;
  const internalHeight = height - panelPadding * 2;
  const internalX = x + panelPadding;
  const internalY = y + panelPadding;

  return (
    <Group>
      {/* 外枠（黒い矩形） */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        stroke="#000000"
        strokeWidth={2}
        fill="transparent"
      />

      {/* ラベル */}
      <Text
        x={x}
        y={y - 25}
        width={width}
        text={label}
        fontSize={12}
        fontFamily="Arial"
        fill="#000000"
        align="center"
      />

      {/* 入力線（上部から入る青い線） */}
      <Line
        points={[x + width / 2, y - 5, x + width / 2, internalY]}
        stroke="#0066cc"
        strokeWidth={2}
      />

      {/* 入力円（+記号） */}
      <Circle
        x={x + width / 2}
        y={internalY}
        radius={6}
        fill="#0066cc"
        stroke="#0066cc"
        strokeWidth={1}
      />
      <Text
        x={x + width / 2 - 4}
        y={internalY - 8}
        text="+"
        fontSize={12}
        fontFamily="Arial"
        fill="#ffffff"
        align="center"
      />

      {/* 内部コンポーネント */}
      {showTriangle && (
        <>
          {/* 下向き三角形 */}
          <Path
            data="M 0 -8 L -6 8 L 6 8 Z"
            x={x + width / 2}
            y={internalY + 20}
            fill="#0066cc"
            stroke="#0066cc"
            strokeWidth={1}
          />

          {/* 円（数字2） */}
          {showCircle2 && (
            <>
              <Circle
                x={x + width / 2}
                y={internalY + 40}
                radius={8}
                fill="#0066cc"
                stroke="#0066cc"
                strokeWidth={1}
              />
              <Text
                x={x + width / 2 - 4}
                y={internalY + 32}
                text="2"
                fontSize={12}
                fontFamily="Arial"
                fill="#ffffff"
                align="center"
              />
            </>
          )}
        </>
      )}

      {/* 水平線（矢印付き） */}
      <Line
        points={[
          internalX + 10,
          internalY + 60,
          internalX + internalWidth - 10,
          internalY + 60,
        ]}
        stroke="#0066cc"
        strokeWidth={2}
      />

      {/* 右向き矢印 */}
      <Path
        data="M -6 -4 L 0 0 L -6 4"
        x={internalX + internalWidth - 10}
        y={internalY + 60}
        fill="#0066cc"
        stroke="#0066cc"
        strokeWidth={2}
      />

      {/* 円（数字4） */}
      <Circle
        x={x + width / 2}
        y={internalY + 80}
        radius={8}
        fill="#0066cc"
        stroke="#0066cc"
        strokeWidth={1}
      />
      <Text
        x={x + width / 2 - 4}
        y={internalY + 72}
        text="4"
        fontSize={12}
        fontFamily="Arial"
        fill="#ffffff"
        align="center"
      />

      {/* 出力線（下部から出る青い線） */}
      <Line
        points={[
          x + width / 2,
          internalY + internalHeight,
          x + width / 2,
          y + height + 5,
        ]}
        stroke="#0066cc"
        strokeWidth={2}
      />
    </Group>
  );
}
