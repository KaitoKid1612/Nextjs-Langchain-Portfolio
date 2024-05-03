"use client"

import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes"

export default function ThemeToggle() {
    const {theme, setTheme} = useTheme();

    return <button
        onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
    >
        <Sun size={24} className="absolute translate-all rotate-90 scale-0 dark:rotate-0 dark:scale-100"/>
        <Moon size={24} className="translate-all rotate-0 scale-100 dark:-rotate-90 dark:scale-0"/>
    </button>
}