"use client"
import Image from "next/image";
import { useState } from "react";
import { Sparkles, ClipboardCheck, Menu } from "lucide-react";

export default function Home() {
  const [navOpen, setNavOpen] = useState(false);
  return (
    <div className="min-h-screen bg-[#0B0F19] font-sans flex flex-col">
      {/* Header */}
      <header className="flex items-center justify-between px-4 sm:px-8 py-6 relative">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-[#A78BFA]">MONUVO</span>
        </div>
        {/* Desktop Nav */}
        <nav className="hidden md:flex gap-8 text-lg font-medium text-white">
          <a href="#" className="hover:text-[#A78BFA]">
            Home
          </a>
          <a href="#" className="hover:text-[#A78BFA]">
            Profil
          </a>
          <a href="#" className="hover:text-[#A78BFA]">
            Fitur
          </a>
          <a href="#" className="hover:text-[#A78BFA]">
            Premuim
          </a>
          <a href="#" className="hover:text-[#A78BFA]">
            About
          </a>
        </nav>
        {/* Mobile Nav Button */}
        <button
          className="md:hidden text-white"
          onClick={() => setNavOpen(!navOpen)}
        >
          <Menu size={32} />
        </button>
        {/* Notification Icon */}
        <div className="relative ml-4">
          <ClipboardCheck size={32} color="#fff" />
          <span className="absolute -top-2 -right-2 bg-[#A78BFA] text-white text-xs rounded-full px-2 py-0.5">
            1
          </span>
        </div>
        {/* Mobile Nav Drawer */}
        {navOpen && (
          <nav className="absolute top-full left-0 w-full bg-[#181F2C] flex flex-col gap-4 py-4 px-8 z-50 md:hidden">
            <a href="#" className="hover:text-[#A78BFA]">
              Home
            </a>
            <a href="#" className="hover:text-[#A78BFA]">
              Profil
            </a>
            <a href="#" className="hover:text-[#A78BFA]">
              Fitur
            </a>
            <a href="#" className="hover:text-[#A78BFA]">
              Premuim
            </a>
            <a href="#" className="hover:text-[#A78BFA]">
              About
            </a>
          </nav>
        )}
      </header>
      {/* Banner & Content */}
      <div className="flex flex-col items-center mt-8 px-4 sm:px-0">
        <div className="flex items-center gap-2 bg-[#232B3E] px-4 sm:px-6 py-2 rounded-full text-[#A78BFA] font-semibold text-sm mb-6">
          <Sparkles size={18} />
          MANAGE YOUR MONEY CONTROL YOUR LIFE
        </div>
        <h1 className="text-white text-3xl sm:text-5xl font-extrabold mb-4 tracking-tight text-center">
          HELLO MONUVERS!!!
        </h1>
        <p className="text-[#A7B1C2] text-base sm:text-lg mb-8 text-center max-w-xl">
          Welcome to the Budgeting Website to Manage Your Finance
        </p>
        <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 w-full sm:w-auto justify-center">
          <a
            href="#"
            className="bg-[#A78BFA] text-white font-bold px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg flex items-center gap-2 shadow-lg hover:bg-[#7C3AED] transition justify-center"
          >
            Let's Talk{" "}
            <span className="ml-2">→</span>
          </a>
          <a
            href="#"
            className="bg-[#181F2C] text-white font-bold px-6 sm:px-8 py-4 rounded-full text-base sm:text-lg flex items-center gap-2 shadow-lg border-2 border-[#A78BFA] hover:bg-[#232B3E] transition justify-center"
          >
            View Our Work
          </a>
        </div>
      </div>
    </div>
  );
}
