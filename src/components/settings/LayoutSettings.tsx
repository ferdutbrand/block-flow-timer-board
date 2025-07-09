
import React, { useState } from 'react';
import { Monitor } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Label } from '../ui/label';

interface LayoutSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LayoutSettings: React.FC<LayoutSettingsProps> = ({ open, onOpenChange }) => {
  const [windowPosition, setWindowPosition] = useState(() => localStorage.getItem('windowPosition') || 'left');

  const applyLayoutSettings = () => {
    localStorage.setItem('windowPosition', windowPosition);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Configurações de Layout
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label className="text-sm font-medium">Posição da Janela Ancorada</Label>
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
