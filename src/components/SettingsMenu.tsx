
import React, { useState } from 'react';
import { Settings, Palette, Type, Upload, Moon, Sun } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { useTheme } from '../hooks/useTheme';

export const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [showLogoSettings, setShowLogoSettings] = useState(false);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
            <Settings className="w-4 h-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel>Configurações</DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={toggleTheme}>
              {theme === 'dark' ? (
                <>
                  <Sun className="mr-2 h-4 w-4" />
                  Modo Claro
                </>
              ) : (
                <>
                  <Moon className="mr-2 h-4 w-4" />
                  Modo Escuro
                </>
              )}
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowFontSettings(true)}>
              <Type className="mr-2 h-4 w-4" />
              Tipografia
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowColorSettings(true)}>
              <Palette className="mr-2 h-4 w-4" />
              Cores
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowLogoSettings(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Logotipo
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Font Settings Dialog */}
      <FontSettingsDialog 
        open={showFontSettings} 
        onOpenChange={setShowFontSettings} 
      />
      
      {/* Color Settings Dialog */}
      <ColorSettingsDialog 
        open={showColorSettings} 
        onOpenChange={setShowColorSettings} 
      />
      
      {/* Logo Settings Dialog */}
      <LogoSettingsDialog 
        open={showLogoSettings} 
        onOpenChange={setShowLogoSettings} 
      />
    </>
  );
};

const FontSettingsDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const [fontSize, setFontSize] = useState('medium');
  const [fontFamily, setFontFamily] = useState('Inter');

  const applyFontSettings = () => {
    const root = document.documentElement;
    
    // Apply font size
    switch (fontSize) {
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
    
    // Apply font family
    root.style.fontFamily = fontFamily;
    
    localStorage.setItem('fontSize', fontSize);
    localStorage.setItem('fontFamily', fontFamily);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Tipografia</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Tamanho da Fonte</label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={fontSize === 'small' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('small')}
              >
                A
              </Button>
              <Button
                variant={fontSize === 'medium' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('medium')}
              >
                AA
              </Button>
              <Button
                variant={fontSize === 'large' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setFontSize('large')}
              >
                AAA
              </Button>
            </div>
          </div>
          
          <div>
            <label className="text-sm font-medium">Tipografia</label>
            <select
              value={fontFamily}
              onChange={(e) => setFontFamily(e.target.value)}
              className="w-full mt-2 p-2 border rounded-md bg-background"
            >
              <option value="Inter">Inter</option>
              <option value="Arial">Arial</option>
              <option value="Helvetica">Helvetica</option>
              <option value="Times New Roman">Times New Roman</option>
              <option value="Georgia">Georgia</option>
              <option value="Courier New">Courier New</option>
            </select>
          </div>
          
          <Button onClick={applyFontSettings} className="w-full">
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const ColorSettingsDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const [primaryColor, setPrimaryColor] = useState('#000000');

  const applyColorSettings = () => {
    const root = document.documentElement;
    const hsl = hexToHsl(primaryColor);
    root.style.setProperty('--primary', `${hsl.h} ${hsl.s}% ${hsl.l}%`);
    
    localStorage.setItem('primaryColor', primaryColor);
    onOpenChange(false);
  };

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Cores</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Cor Principal</label>
            <div className="flex gap-2 mt-2">
              <input
                type="color"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="w-12 h-10 border rounded-md"
              />
              <input
                type="text"
                value={primaryColor}
                onChange={(e) => setPrimaryColor(e.target.value)}
                className="flex-1 p-2 border rounded-md bg-background"
                placeholder="#000000"
              />
            </div>
          </div>
          
          <Button onClick={applyColorSettings} className="w-full">
            Aplicar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

const LogoSettingsDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'image/svg+xml') {
      setLogoFile(file);
    } else {
      alert('Por favor, selecione apenas arquivos SVG');
    }
  };

  const applyLogo = () => {
    if (logoFile) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const logoData = e.target?.result as string;
        localStorage.setItem('customLogo', logoData);
        // Trigger logo update in header
        window.dispatchEvent(new CustomEvent('logoChanged', { detail: logoData }));
      };
      reader.readAsDataURL(logoFile);
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Logotipo</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Upload SVG</label>
            <input
              type="file"
              accept=".svg"
              onChange={handleFileChange}
              className="w-full mt-2 p-2 border rounded-md bg-background"
            />
            {logoFile && (
              <p className="text-sm text-muted-foreground mt-1">
                Arquivo selecionado: {logoFile.name}
              </p>
            )}
          </div>
          
          <Button onClick={applyLogo} className="w-full" disabled={!logoFile}>
            Aplicar Logotipo
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
