
import React, { useState } from 'react';
import { Settings, Palette, Type, Upload, Moon, Sun, Monitor, Layers } from 'lucide-react';
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
import { DesignSystemPanel } from './DesignSystemPanel';

export const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showFontSettings, setShowFontSettings] = useState(false);
  const [showColorSettings, setShowColorSettings] = useState(false);
  const [showLogoSettings, setShowLogoSettings] = useState(false);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
  const [showDesignSystem, setShowDesignSystem] = useState(false);

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
            
            <DropdownMenuItem onClick={() => setShowDesignSystem(true)}>
              <Layers className="mr-2 h-4 w-4" />
              Design System
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowFontSettings(true)}>
              <Type className="mr-2 h-4 w-4" />
              Tipografia
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowColorSettings(true)}>
              <Palette className="mr-2 h-4 w-4" />
              Cores
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowLayoutSettings(true)}>
              <Monitor className="mr-2 h-4 w-4" />
              Layout
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => setShowLogoSettings(true)}>
              <Upload className="mr-2 h-4 w-4" />
              Logotipo
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Design System Panel */}
      <DesignSystemPanel 
        open={showDesignSystem} 
        onOpenChange={setShowDesignSystem} 
      />

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
      
      {/* Layout Settings Dialog */}
      <LayoutSettingsDialog 
        open={showLayoutSettings} 
        onOpenChange={setShowLayoutSettings} 
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
  const [fontSize, setFontSize] = useState(() => localStorage.getItem('fontSize') || 'medium');
  const [fontFamily, setFontFamily] = useState(() => localStorage.getItem('fontFamily') || 'Inter');

  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Source Sans Pro', 'Oswald', 'Raleway', 'Nunito Sans', 'PT Sans',
    'Merriweather', 'Playfair Display', 'Lora', 'Crimson Text'
  ];

  const loadGoogleFont = (fontName: string) => {
    const existingLink = document.querySelector(`link[href*="${fontName.replace(' ', '+')}"]`);
    if (!existingLink) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(' ', '+')}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
    }
  };

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
    
    // Load and apply Google Font
    if (googleFonts.includes(fontFamily)) {
      loadGoogleFont(fontFamily);
    }
    
    root.style.fontFamily = `"${fontFamily}", -apple-system, BlinkMacSystemFont, sans-serif`;
    
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
              {googleFonts.map(font => (
                <option key={font} value={font}>{font}</option>
              ))}
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
  const [primaryColor, setPrimaryColor] = useState(() => localStorage.getItem('primaryColor') || '#000000');
  const [selectedBackgroundHsl, setSelectedBackgroundHsl] = useState(() => {
    const saved = localStorage.getItem('selectedBackgroundHsl');
    return saved || '0 0% 0%'; // Default to pure black
  });

  // 15 predefined background colors respecting max 60% saturation and 20% luminosity
  const predefinedBackgrounds = [
    { name: 'Preto Puro', hsl: '0 0% 0%', hex: '#000000' },
    { name: 'Cinza Escuro', hsl: '0 0% 10%', hex: '#1a1a1a' },
    { name: 'Cinza Carvão', hsl: '0 0% 15%', hex: '#262626' },
    { name: 'Azul Noturno', hsl: '220 60% 15%', hex: '#0f1419' },
    { name: 'Verde Floresta', hsl: '120 50% 12%', hex: '#0f1f0f' },
    { name: 'Roxo Profundo', hsl: '280 55% 18%', hex: '#2d1b3d' },
    { name: 'Marrom Escuro', hsl: '30 40% 15%', hex: '#332618' },
    { name: 'Vermelho Sombrio', hsl: '0 50% 18%', hex: '#4d1a1a' },
    { name: 'Azul Acinzentado', hsl: '210 30% 18%', hex: '#202937' },
    { name: 'Verde Musgo', hsl: '80 45% 16%', hex: '#252d14' },
    { name: 'Índigo Escuro', hsl: '240 60% 17%', hex: '#1a1a4d' },
    { name: 'Laranja Queimado', hsl: '20 55% 16%', hex: '#3d241a' },
    { name: 'Teal Profundo', hsl: '180 50% 15%', hex: '#133333' },
    { name: 'Rosa Escuro', hsl: '320 45% 18%', hex: '#3d1f2f' },
    { name: 'Amarelo Terroso', hsl: '45 40% 20%', hex: '#474026' }
  ];

  const applyColorSettings = () => {
    const root = document.documentElement;
    
    // Apply primary color
    const primaryHsl = hexToHsl(primaryColor);
    root.style.setProperty('--primary', `${primaryHsl.h} ${primaryHsl.s}% ${primaryHsl.l}%`);
    
    // Apply selected background color
    root.style.setProperty('--background', selectedBackgroundHsl);
    
    localStorage.setItem('primaryColor', primaryColor);
    localStorage.setItem('selectedBackgroundHsl', selectedBackgroundHsl);
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
      <DialogContent className="max-w-md">
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

          <div>
            <label className="text-sm font-medium">Cor de Fundo</label>
            <p className="text-xs text-muted-foreground mb-3">
              Selecione uma das cores predefinidas
            </p>
            <div className="grid grid-cols-5 gap-2">
              {predefinedBackgrounds.map((bg) => (
                <button
                  key={bg.hsl}
                  className={`w-12 h-12 rounded-md border-2 transition-all ${
                    selectedBackgroundHsl === bg.hsl 
                      ? 'border-primary ring-2 ring-primary/20' 
                      : 'border-border hover:border-primary/50'
                  }`}
                  style={{ backgroundColor: bg.hex }}
                  onClick={() => setSelectedBackgroundHsl(bg.hsl)}
                  title={bg.name}
                />
              ))}
            </div>
            <div className="mt-2 text-xs text-muted-foreground">
              Selecionado: {predefinedBackgrounds.find(bg => bg.hsl === selectedBackgroundHsl)?.name}
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

const LayoutSettingsDialog: React.FC<{ open: boolean; onOpenChange: (open: boolean) => void }> = ({ open, onOpenChange }) => {
  const [windowPosition, setWindowPosition] = useState(() => localStorage.getItem('windowPosition') || 'left');

  const applyLayoutSettings = () => {
    localStorage.setItem('windowPosition', windowPosition);
    // This would be applied when the window is in minimized/anchored mode
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Configurações de Layout</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Posição da Janela Ancorada</label>
            <div className="flex gap-2 mt-2">
              <Button
                variant={windowPosition === 'left' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWindowPosition('left')}
              >
                Esquerda
              </Button>
              <Button
                variant={windowPosition === 'right' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setWindowPosition('right')}
              >
                Direita
              </Button>
            </div>
          </div>
          
          <Button onClick={applyLayoutSettings} className="w-full">
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
