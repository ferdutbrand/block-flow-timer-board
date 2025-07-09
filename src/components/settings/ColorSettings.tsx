
import React from 'react';
import { Palette } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Input } from '../ui/input';

interface ColorSettingsProps {
  primaryColor: string;
  setPrimaryColor: (color: string) => void;
  selectedBackgroundHsl: string;
  setSelectedBackgroundHsl: (hsl: string) => void;
}

export const ColorSettings: React.FC<ColorSettingsProps> = ({
  primaryColor,
  setPrimaryColor,
  selectedBackgroundHsl,
  setSelectedBackgroundHsl
}) => {
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Palette className="h-4 w-4" />
          Cores
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Cor Principal</Label>
          <div className="flex gap-2 mt-2">
            <input
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-12 h-10 border rounded-md"
            />
            <Input
              type="text"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              placeholder="#000000"
              className="flex-1"
            />
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium">Cor de Fundo</Label>
          <div className="grid grid-cols-5 gap-2 mt-2">
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
      </CardContent>
    </Card>
  );
};
