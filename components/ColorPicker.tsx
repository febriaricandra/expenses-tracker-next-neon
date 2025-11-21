import React from "react";

const COLORS = [
  "#FFD54F", "#4FC3F7", "#81C784", "#E57373", "#BDBDBD", "#232B3E", "#181F2C", "#FFB300", "#00BFAE", "#FF4081"
];

export default function ColorPicker({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {COLORS.map((color) => (
        <button
          key={color}
          type="button"
          className={`w-7 h-7 rounded-full border-2 ${value === color ? "border-white" : "border-transparent"}`}
          style={{ background: color }}
          onClick={() => onChange(color)}
        />
      ))}
    </div>
  );
}
