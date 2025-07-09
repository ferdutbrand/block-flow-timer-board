
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Copy, Eye, EyeOff, Palette, Type, Layout, Component } from 'lucide-react';
import { Label } from './ui/label';
import { Input } from './ui/input';

interface DesignSystemPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DesignSystemPanel: React.FC<DesignSystemPanelProps> = ({ open, onOpenChange }) => {
  const [selectedTab, setSelectedTab] = useState('colors');

  // Color tokens from the design system
  const colorTokens = [
    { name: 'background', value: 'var(--background)', description: 'Cor de fundo principal' },
    { name: 'foreground', value: 'var(--foreground)', description: 'Cor do texto principal' },
    { name: 'primary', value: 'var(--primary)', description: 'Cor primária da marca' },
    { name: 'primary-foreground', value: 'var(--primary-foreground)', description: 'Texto sobre cor primária' },
    { name: 'secondary', value: 'var(--secondary)', description: 'Cor secundária' },
    { name: 'secondary-foreground', value: 'var(--secondary-foreground)', description: 'Texto sobre cor secundária' },
    { name: 'muted', value: 'var(--muted)', description: 'Cor neutra suave' },
    { name: 'muted-foreground', value: 'var(--muted-foreground)', description: 'Texto neutro' },
    { name: 'accent', value: 'var(--accent)', description: 'Cor de destaque' },
    { name: 'accent-foreground', value: 'var(--accent-foreground)', description: 'Texto sobre cor de destaque' },
    { name: 'destructive', value: 'var(--destructive)', description: 'Cor de erro/perigo' },
    { name: 'destructive-foreground', value: 'var(--destructive-foreground)', description: 'Texto sobre cor de erro' },
    { name: 'border', value: 'var(--border)', description: 'Cor das bordas' },
    { name: 'input', value: 'var(--input)', description: 'Cor de fundo dos inputs' },
    { name: 'ring', value: 'var(--ring)', description: 'Cor do foco' },
  ];

  // Typography tokens
  const typographyTokens = [
    { name: 'font-sans', value: 'ui-sans-serif, system-ui, sans-serif', description: 'Fonte principal' },
    { name: 'text-xs', value: '0.75rem', description: 'Texto extra pequeno' },
    { name: 'text-sm', value: '0.875rem', description: 'Texto pequeno' },
    { name: 'text-base', value: '1rem', description: 'Texto base' },
    { name: 'text-lg', value: '1.125rem', description: 'Texto grande' },
    { name: 'text-xl', value: '1.25rem', description: 'Texto extra grande' },
    { name: 'text-2xl', value: '1.5rem', description: 'Título pequeno' },
    { name: 'text-3xl', value: '1.875rem', description: 'Título médio' },
    { name: 'text-4xl', value: '2.25rem', description: 'Título grande' },
  ];

  // Spacing tokens
  const spacingTokens = [
    { name: 'spacing-1', value: '0.25rem', description: '4px' },
    { name: 'spacing-2', value: '0.5rem', description: '8px' },
    { name: 'spacing-3', value: '0.75rem', description: '12px' },
    { name: 'spacing-4', value: '1rem', description: '16px' },
    { name: 'spacing-6', value: '1.5rem', description: '24px' },
    { name: 'spacing-8', value: '2rem', description: '32px' },
    { name: 'spacing-12', value: '3rem', description: '48px' },
    { name: 'spacing-16', value: '4rem', description: '64px' },
  ];

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const ColorToken = ({ token }: { token: typeof colorTokens[0] }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div 
          className="w-8 h-8 rounded border"
          style={{ backgroundColor: `hsl(${token.value})` }}
        />
        <div>
          <div className="font-medium text-sm">{token.name}</div>
          <div className="text-xs text-muted-foreground">{token.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded">{token.value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(token.value)}
          className="h-6 w-6 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const TypographyToken = ({ token }: { token: typeof typographyTokens[0] }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex-1">
        <div className="font-medium text-sm">{token.name}</div>
        <div className="text-xs text-muted-foreground">{token.description}</div>
        <div className="mt-2" style={{ fontSize: token.value }}>
          Exemplo de texto neste tamanho
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded">{token.value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(token.name)}
          className="h-6 w-6 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  const SpacingToken = ({ token }: { token: typeof spacingTokens[0] }) => (
    <div className="flex items-center justify-between p-3 border rounded-lg">
      <div className="flex items-center gap-3">
        <div className="flex items-center">
          <div 
            className="bg-primary"
            style={{ width: token.value, height: '16px' }}
          />
        </div>
        <div>
          <div className="font-medium text-sm">{token.name}</div>
          <div className="text-xs text-muted-foreground">{token.description}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <code className="text-xs bg-muted px-2 py-1 rounded">{token.value}</code>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => copyToClipboard(token.value)}
          className="h-6 w-6 p-0"
        >
          <Copy className="h-3 w-3" />
        </Button>
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Component className="h-5 w-5" />
            Design System
          </DialogTitle>
        </DialogHeader>
        
        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 overflow-hidden">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="colors" className="flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Cores
            </TabsTrigger>
            <TabsTrigger value="typography" className="flex items-center gap-2">
              <Type className="h-4 w-4" />
              Tipografia
            </TabsTrigger>
            <TabsTrigger value="spacing" className="flex items-center gap-2">
              <Layout className="h-4 w-4" />
              Espaçamento
            </TabsTrigger>
            <TabsTrigger value="components" className="flex items-center gap-2">
              <Component className="h-4 w-4" />
              Componentes
            </TabsTrigger>
          </TabsList>
          
          <div className="flex-1 overflow-y-auto mt-4">
            <TabsContent value="colors" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tokens de Cor</h3>
                <div className="space-y-2">
                  {colorTokens.map((token) => (
                    <ColorToken key={token.name} token={token} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="typography" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Escala Tipográfica</h3>
                <div className="space-y-2">
                  {typographyTokens.map((token) => (
                    <TypographyToken key={token.name} token={token} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="spacing" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Tokens de Espaçamento</h3>
                <div className="space-y-2">
                  {spacingTokens.map((token) => (
                    <SpacingToken key={token.name} token={token} />
                  ))}
                </div>
              </div>
            </TabsContent>
            
            <TabsContent value="components" className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-4">Componentes da Interface</h3>
                <div className="grid gap-4">
                  {/* Buttons */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Botões</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex gap-2 flex-wrap">
                        <Button variant="default">Primário</Button>
                        <Button variant="secondary">Secundário</Button>
                        <Button variant="outline">Contorno</Button>
                        <Button variant="ghost">Fantasma</Button>
                        <Button variant="destructive">Destrutivo</Button>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        <Button size="sm">Pequeno</Button>
                        <Button size="default">Padrão</Button>
                        <Button size="lg">Grande</Button>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Badges */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Badges</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex gap-2 flex-wrap">
                        <Badge variant="default">Padrão</Badge>
                        <Badge variant="secondary">Secundário</Badge>
                        <Badge variant="outline">Contorno</Badge>
                        <Badge variant="destructive">Destrutivo</Badge>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Inputs */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Campos de Entrada</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="space-y-2">
                        <Label htmlFor="example">Campo de exemplo</Label>
                        <Input id="example" placeholder="Digite algo aqui..." />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
