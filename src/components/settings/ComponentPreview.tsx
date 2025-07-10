
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export const ComponentPreview: React.FC = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base text-auto-contrast">Preview</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium mb-2 block text-auto-contrast">Botões</Label>
          <div className="flex gap-2 flex-wrap">
            <Button variant="default">Primário</Button>
            <Button variant="secondary">Secundário</Button>
            <Button variant="outline">Contorno</Button>
            <Button variant="ghost">Fantasma</Button>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block text-auto-contrast">Badges</Label>
          <div className="flex gap-2 flex-wrap">
            <Badge variant="default">Padrão</Badge>
            <Badge variant="secondary">Secundário</Badge>
            <Badge variant="outline">Contorno</Badge>
          </div>
        </div>

        <div>
          <Label className="text-sm font-medium mb-2 block text-auto-contrast">Campo de Entrada</Label>
          <Input placeholder="Digite algo aqui..." />
        </div>

        <div className="p-4 rounded-lg bg-muted">
          <p className="text-auto-contrast-muted text-sm">
            Este texto usa contraste automático baseado no fundo selecionado.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
