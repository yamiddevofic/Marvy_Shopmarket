import React from 'react';
import { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

const cn = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const useTheme = () => {
  const [theme, setTheme] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') || 'light';
    }
    return 'light';
  });

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return [theme, setTheme];
};

const ToggleTheme = ({ className }) => {
  const [theme, setTheme] = useTheme();
  const [isAnimating, setIsAnimating] = useState(false);

  const toggleTheme = () => {
    setIsAnimating(true);
    setTheme(theme === 'light' ? 'dark' : 'light');
    setTimeout(() => setIsAnimating(false), 500);
  };

  return (
    <button
      onClick={toggleTheme}
      className={cn(
        "p-3 rounded-full fixed right-4 bottom-4 transition-all duration-300",
        "hover:scale-110 focus:outline-none focus:ring-2",
        "focus:ring-emerald-400 focus:ring-offset-2",
        "bg-white dark:bg-emerald-800 shadow-lg",
        isAnimating && "animate-spin",
        className
      )}
      aria-label={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
      title={`Cambiar a modo ${theme === 'light' ? 'oscuro' : 'claro'}`}
    >
      {theme === 'light' ? (
        <Moon 
          className="w-6 h-6 text-emerald-600 transition-colors"
          strokeWidth={2}
        />
      ) : (
        <Sun 
          className="w-6 h-6 text-emerald-300 transition-colors"
          strokeWidth={2}
        />
      )}
    </button>
  );
};

export default ToggleTheme;