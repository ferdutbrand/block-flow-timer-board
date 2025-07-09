
import React, { useState, useEffect } from 'react';
import { Minimize2, Maximize2, X } from 'lucide-react';
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
    const savedLogo = localStorage.getItem('customLogo');
    if (savedLogo) {
      setCustomLogo(savedLogo);
    }

    const handleLogoChange = (event: CustomEvent) => {
      setCustomLogo(event.detail);
    };

    window.addEventListener('logoChanged', handleLogoChange as EventListener);
    return () => {
      window.removeEventListener('logoChanged', handleLogoChange as EventListener);
    };
  }, []);

  const handleClose = () => {
    window.close();
  };

  return (
    <div className="flex items-center justify-between p-4 border-b border-border bg-background/95 backdrop-blur">
      <div className="flex items-center gap-3">
        {customLogo ? (
          <img src={customLogo} alt="Logo" className="w-6 h-6" />
        ) : (
          <div className="w-6 h-6 bg-primary rounded-sm flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">3</span>
          </div>
        )}
        <h1 className="text-lg font-semibold text-foreground">3ForTime</h1>
      </div>
      
      <div className="flex items-center gap-2">
        <SettingsMenu />
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
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClose}
          className="h-8 w-8 p-0 hover:bg-destructive hover:text-destructive-foreground"
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );
};
