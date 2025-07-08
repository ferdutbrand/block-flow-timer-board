
import React, { useState, useEffect } from 'react';
import { Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { SettingsMenu } from './SettingsMenu';

interface FloatingHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  isMinimized,
  onToggleMinimize,
}) => {
  const [customLogo, setCustomLogo] = useState<string | null>(null);

  useEffect(() => {
    // Load custom logo from localStorage
    const savedLogo = localStorage.getItem('customLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }

    // Load font settings
    const savedFontSize = localStorage.getItem('fontSize');
    const savedFontFamily = localStorage.getItem('fontFamily');
    const savedPrimaryColor = localStorage.getItem('primaryColor');

    const root = document.documentElement;
    
    if (savedFontSize) {
      switch (savedFontSize) {
        case 'small':
          root.style.fontSize = '14px';
          break;
        case 'medium':
          root.style.fontSize = '16px';
          break;
        case 'large':
          root.style.fontSize = '18px';
          break;
      }
    }
    
    if (savedFontFamily) {
      root.style.fontFamily = savedFontFamily;
    }

    if (savedPrimaryColor) {
      const hexToHsl = (hex: string) => {
        const r = parseInt(hex.slice(1, 3), 16) / 255;
        const g = parseInt(hex.slice(3, 5), 16) / 255;
        const b = parseInt(hex.slice(5, 7), 16) / 255;

        const max = Math.max(r, g, b);
        const min = Math.min(r, g, b);
        let h = 0, s = 0, l = (max + min) / 2;

        if (max !== min) {
          const d = max - min;
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
          switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
          }
          h /= 6;
        }

        return {
          h: Math.round(h * 360),
          s: Math.round(s * 100),
          l: Math.round(l * 100)
        };
      };

      const hsl = hexToHsl(savedPrimaryColor);
      root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    }

    // Listen for logo changes
    const handleLogoChange = (e: CustomEvent) => {
      setCustomLogo(e.detail);
    };

    window.addEventListener('logoChanged', handleLogoChange as EventListener);
    
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange as EventListener);
    };
  }, []);

  return (
    <div className="flex items-center justify-between p-3 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3">
        {customLogo ? (
          <img src={customLogo} alt="Logo" className="w-6 h-6" />
        ) : null}
        <h1 className="text-lg font-semibold text-foreground">3 for time</h1>
      </div>
      
      <div className="flex items-center gap-2">
        {!isMinimized && <SettingsMenu />}
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleMinimize}
          className="h-8 w-8 p-0"
        >
          {isMinimized ? (
            <Maximize2 className="w-4 h-4" />
          ) : (
            <Minimize2 className="w-4 h-4" />
          )}
        </Button>
      </div>
    </div>
  );
};
