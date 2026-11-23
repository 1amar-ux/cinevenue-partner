import React, { useState, useRef, useEffect } from "react";
import { Sun, Moon, Laptop, ChevronDown, Check } from "lucide-react";

export type ThemeMode = "dark" | "light" | "system";

interface ThemeToggleProps {
  className?: string;
  variant?: "dropdown" | "segmented";
}

export default function ThemeToggle({ className = "", variant = "dropdown" }: ThemeToggleProps) {
  const [themeMode, setThemeMode] = useState<ThemeMode>(() => {
    return (localStorage.getItem("cine_theme_mode") as ThemeMode) || "system";
  });
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    localStorage.setItem("cine_theme_mode", themeMode);
    if (themeMode === "dark") {
      document.documentElement.classList.add("dark");
    } else if (themeMode === "light") {
      document.documentElement.classList.remove("dark");
    } else {
      // system
      if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [themeMode]);

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen]);

  const options: { mode: ThemeMode; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { mode: "dark", label: "Dark", icon: Moon },
    { mode: "light", label: "Light", icon: Sun },
    { mode: "system", label: "System", icon: Laptop },
  ];

  const CurrentIcon = themeMode === "system" ? Laptop : themeMode === "light" ? Sun : Moon;

  return (
    <div className={`relative inline-block text-left ${className}`} ref={containerRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        aria-haspopup="true"
        aria-expanded={isOpen}
        title={`Theme: ${themeMode}`}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 hover:border-gold/30 text-zinc-200 hover:text-gold transition-all duration-150 cursor-pointer text-xs font-medium active:scale-95"
      >
        <CurrentIcon className="w-3.5 h-3.5 text-gold shrink-0 transition-transform duration-200" />
        <span className="hidden sm:inline capitalize">{themeMode}</span>
        <ChevronDown className={`w-3 h-3 text-zinc-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-32 rounded-xl bg-[#121215] text-[#F3F4F6] border border-gold/30 shadow-2xl backdrop-blur-xl p-1 z-[100] animate-fade-in space-y-1"
        >
          {options.map(({ mode, label, icon: Icon }) => {
            const isSelected = themeMode === mode;
            return (
              <button
                key={mode}
                role="menuitem"
                type="button"
                onClick={() => {
                  setThemeMode(mode);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  isSelected
                    ? "bg-gold/20 text-gold"
                    : "text-zinc-300 hover:text-gold hover:bg-white/5"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? "text-gold" : "text-zinc-400"}`} />
                  <span>{label}</span>
                </div>
                {isSelected && <Check className="w-3 h-3 text-gold" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
