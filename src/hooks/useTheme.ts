
import { useState, useEffect } from 'react';

export const useTheme = () => {
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    return (saved as 'light' | 'dark') || 'light';
  });

  const updateContrastVariables = (backgroundHsl: string, isDark: boolean) => {
    const root = document.documentElement;
    
    // Parse HSL values
    const [h, s, l] = backgroundHsl.split(' ').map(v => parseFloat(v.replace('%', '')));
    
    // Auto-adjust text contrast based on background lightness
    if (!isDark && l < 30) {
      // Dark background in light mode - use light text
      root.style.setProperty('--text-contrast', '210 40% 98%');
      root.style.setProperty('--text-contrast-muted', '215 20.2% 75%');
    } else if (!isDark && l > 80) {
      // Light background in light mode - use dark text
      root.style.setProperty('--text-contrast', '222.2 84% 4.9%');
      root.style.setProperty('--text-contrast-muted', '215.4 16.3% 46.9%');
    } else {
      // Default contrast values
      if (isDark) {
        root.style.setProperty('--text-contrast', '210 40% 98%');
        root.style.setProperty('--text-contrast-muted', '215 20.2% 65.1%');
      } else {
        root.style.setProperty('--text-contrast', '222.2 84% 4.9%');
        root.style.setProperty('--text-contrast-muted', '215.4 16.3% 46.9%');
      }
    }
  };

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');
    root.classList.add(theme);
    localStorage.setItem('theme', theme);

    // Update contrast based on current background
    const savedBackground = localStorage.getItem('selectedBackgroundHsl');
    if (savedBackground) {
      updateContrastVariables(savedBackground, theme === 'dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  return { theme, toggleTheme, updateContrastVariables };
};
