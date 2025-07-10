
import React, { useState } from 'react';
import { Palette } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { TypographySettings } from './TypographySettings';
import { ColorSettings } from './ColorSettings';
import { ComponentPreview } from './ComponentPreview';
import { useTheme } from '../../hooks/useTheme';

interface DesignSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DesignSettings: React.FC<DesignSettingsProps> = ({ open, onOpenChange }) => {
  const { theme, updateContrastVariables } = useTheme();
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter');
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#000000');
  const [selectedBackgroundHsl, setSelectedBackgroundHsl] = useState(() => {
    const saved = localStorage.getItem('selectedBackgroundHsl');
    return saved || '0 0% 0%';
  });

  const applyAllSettings = () => {
    const root = document.documentElement;
    
    // Apply font settings
    const fontSizes = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = fontSizes[fontSize as keyof typeof fontSizes];
    
    const googleFonts = [
      'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
      'Source Sans Pro', 'Oswald', 'Raleway', 'Nunito Sans', 'PT Sans',
      'Merriweather', 'Playfair Display', 'Lora', 'Crimson Text'
    ];

    if (googleFonts.includes(fontFamily)) {
      const existingLink = document.querySelector(`link[href*="${fontFamily.replace(' ', '+')}"]`);
      if (!existingLink) {
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = `https://fonts.googleapis.com/css2?family=${fontFamily.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
        document.head.appendChild(link);
      }
    }
    root.style.fontFamily = `"${fontFamily}", -apple-system, BlinkMacSystemFont, sans-serif`;
    
    // Apply color settings
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

      return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) };
    };

    const primaryHsl = hexToHsl(primaryColor);
    root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    root.style.setProperty('--background', selectedBackgroundHsl);
    
    // Update contrast variables based on background
    updateContrastVariables(selectedBackgroundHsl, theme === 'dark');
    
    // Save to localStorage
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontFamily', fontFamily);
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('selectedBackgroundHsl', selectedBackgroundHsl);
    
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Palette className="h-5 w-5" />
            Design & Cores
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <TypographySettings
            fontSize={fontSize}
            setFontSize={setFontSize}
            fontFamily={fontFamily}
            setFontFamily={setFontFamily}
          />

          <ColorSettings
            primaryColor={primaryColor}
            setPrimaryColor={setPrimaryColor}
            selectedBackgroundHsl={selectedBackgroundHsl}
            setSelectedBackgroundHsl={setSelectedBackgroundHsl}
          />

          <ComponentPreview />
        </div>
        
        <Button onClick={applyAllSettings} className="w-full mt-6">
          Aplicar Todas as Configurações
        </Button>
      </DialogContent>
    </Dialog>
  );
};
