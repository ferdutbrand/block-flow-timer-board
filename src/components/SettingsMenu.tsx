
import React, { useState } from 'react';
import { Settings, Palette, Monitor, Upload, Moon, Sun } from 'lucide-react';
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
import { useTheme } from '../hooks/useTheme';
import { DesignSettings } from './settings/DesignSettings';
import { LayoutSettings } from './settings/LayoutSettings';
import { LogoSettings } from './settings/LogoSettings';

export const SettingsMenu: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const [showDesignSettings, setShowDesignSettings] = useState(false);
  const [showLayoutSettings, setShowLayoutSettings] = useState(false);
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
            
            <DropdownMenuItem onClick={() => setShowDesignSettings(true)}>
              <Palette className="mr-2 h-4 w-4" />
              Design & Cores
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

      <DesignSettings 
        open={showDesignSettings} 
        onOpenChange={setShowDesignSettings} 
      />
      
      <LayoutSettings 
        open={showLayoutSettings} 
        onOpenChange={setShowLayoutSettings} 
      />
      
      <LogoSettings 
        open={showLogoSettings} 
        onOpenChange={setShowLogoSettings} 
      />
    </>
  );
};
