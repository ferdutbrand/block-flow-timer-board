
import React, { useState } from 'react';
import { Upload } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface LogoSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogoSettings: React.FC<LogoSettingsProps> = ({ open, onOpenChange }) => {
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
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Configurações de Logotipo
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Upload SVG</Label>
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
