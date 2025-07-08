
import React from 'react';
import { Moon, Sun, Minimize2, Maximize2 } from 'lucide-react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { useTheme } from '../hooks/useTheme';

interface FloatingHeaderProps {
  isMinimized: boolean;
  onToggleMinimize: () => void;
}

export const FloatingHeader: React.FC<FloatingHeaderProps> = ({
  isMinimized,
  onToggleMinimize,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="flex items-center justify-between p-3 bg-background/95 backdrop-blur border-b border-border">
      <div className="flex items-center gap-3">
        <h1 className="text-lg font-semibold text-foreground">3 for time</h1>
        {!isMinimized && (
          <div className="flex items-center gap-2">
            <Sun className="w-4 h-4 text-muted-foreground" />
            <Switch
              checked={theme === 'dark'}
              onCheckedChange={toggleTheme}
              className="data-[state=checked]:bg-primary"
            />
            <Moon className="w-4 h-4 text-muted-foreground" />
          </div>
        )}
      </div>
      
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
  );
};
