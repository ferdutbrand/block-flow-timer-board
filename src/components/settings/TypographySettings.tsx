
import React from 'react';
import { Type } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface TypographySettingsProps {
  fontSize: string;
  setFontSize: (size: string) => void;
  fontFamily: string;
  setFontFamily: (family: string) => void;
}

export const TypographySettings: React.FC<TypographySettingsProps> = ({
  fontSize,
  setFontSize,
  fontFamily,
  setFontFamily
}) => {
  const googleFonts = [
    'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 'Poppins', 
    'Source Sans Pro', 'Oswald', 'Raleway', 'Nunito Sans', 'PT Sans',
    'Merriweather', 'Playfair Display', 'Lora', 'Crimson Text'
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base flex items-center gap-2">
          <Type className="h-4 w-4" />
          Tipografia
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium">Tamanho da Fonte</Label>
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
          <Label className="text-sm font-medium">Fonte</Label>
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
      </CardContent>
    </Card>
  );
};
