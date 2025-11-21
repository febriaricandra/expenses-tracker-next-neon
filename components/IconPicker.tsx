import React from "react";
import { Wallet, Home, Droplets, Shirt, Coffee, Fuel, Plane, Sparkles, Cookie, BarChart3, Shield, MoreHorizontal } from "lucide-react";

const ICONS = [
  { name: "Wallet", icon: <Wallet size={28} /> },
  { name: "Home", icon: <Home size={28} /> },
  { name: "Droplets", icon: <Droplets size={28} /> },
  { name: "Shirt", icon: <Shirt size={28} /> },
  { name: "Coffee", icon: <Coffee size={28} /> },
  { name: "Fuel", icon: <Fuel size={28} /> },
  { name: "Plane", icon: <Plane size={28} /> },
  { name: "Sparkles", icon: <Sparkles size={28} /> },
  { name: "Cookie", icon: <Cookie size={28} /> },
  { name: "BarChart3", icon: <BarChart3 size={28} /> },
  { name: "Shield", icon: <Shield size={28} /> },
  { name: "MoreHorizontal", icon: <MoreHorizontal size={28} /> },
];

export default function IconPicker({ value, onChange }: { value: string; onChange: (icon: string) => void }) {
  return (
    <div className="flex gap-2 flex-wrap">
      {ICONS.map((item) => (
        <button
          key={item.name}
          type="button"
          className={`w-10 h-10 rounded-lg flex items-center justify-center border-2 ${value === item.name ? "border-white" : "border-transparent"}`}
          onClick={() => onChange(item.name)}
        >
          {item.icon}
        </button>
      ))}
    </div>
  );
}
