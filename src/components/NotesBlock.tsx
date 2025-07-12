
import React, { useState, useEffect, useRef } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { StickyNote, Pen, Save, Trash2, Calendar, Download } from 'lucide-react';
import { Note } from '../types/notes';
import { AgendaItem } from '../types/calendar';

interface NotesBlockProps {
  onAddToCalendar?: (title: string, description: string) => void;
}

export const NotesBlock: React.FC<NotesBlockProps> = ({ onAddToCalendar }) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isMouseDown, setIsMouseDown] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('3fortime-notes');
    if (saved) {
      const loadedNotes = JSON.parse(saved).map((note: any) => ({
        ...note,
        createdAt: new Date(note.createdAt),
        updatedAt: new Date(note.updatedAt)
      }));
      setNotes(loadedNotes);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('3fortime-notes', JSON.stringify(notes));
  }, [notes]);

  const createNewNote = () => {
    const newNote: Note = {
      id: Date.now().toString(),
      title: 'Nova Nota',
      content: '',
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setNotes(prev => [...prev, newNote]);
    setActiveNote(newNote);
    setIsDialogOpen(true);
  };

  const updateNote = (updates: Partial<Note>) => {
    if (!activeNote) return;
    
    const updatedNote = { 
      ...activeNote, 
      ...updates, 
      updatedAt: new Date() 
    };
    
    setNotes(prev => prev.map(note => 
      note.id === activeNote.id ? updatedNote : note
    ));
    setActiveNote(updatedNote);
  };

  const deleteNote = (id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (activeNote?.id === id) {
      setActiveNote(null);
      setIsDialogOpen(false);
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsMouseDown(true);
    draw(e);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isMouseDown || !canvasRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.lineWidth = 2;
    ctx.lineCap = 'round';
    ctx.strokeStyle = '#000';

    if (isMouseDown) {
      ctx.lineTo(x, y);
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(x, y);
    }
  };

  const stopDrawing = () => {
    if (!canvasRef.current) return;
    setIsMouseDown(false);
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.beginPath();
    }
    
    // Save drawing to note
    if (activeNote) {
      const dataURL = canvas.toDataURL();
      updateNote({ drawings: dataURL });
    }
  };

  const clearCanvas = () => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      if (activeNote) {
        updateNote({ drawings: undefined });
      }
    }
  };

  const loadDrawing = () => {
    if (!canvasRef.current || !activeNote?.drawings) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0);
    };
    img.src = activeNote.drawings;
  };

  useEffect(() => {
    if (activeNote?.drawings) {
      loadDrawing();
    }
  }, [activeNote]);

  const addToCalendar = () => {
    if (!activeNote) return;
    if (onAddToCalendar) {
      onAddToCalendar(activeNote.title, activeNote.content);
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <StickyNote className="w-5 h-5" />
          <h3 className="font-semibold">Bloco de Notas</h3>
        </div>
        
        <Button size="sm" onClick={createNewNote}>
          <StickyNote className="w-4 h-4 mr-1" />
          Nova Nota
        </Button>
      </div>

      <div className="flex-1 overflow-auto">
        {notes.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            <StickyNote className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>Nenhuma nota ainda</p>
            <p className="text-sm">Clique em "Nova Nota" para começar</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-2">
            {notes.map(note => (
              <div 
                key={note.id} 
                className="p-3 border rounded cursor-pointer hover:bg-muted/50 transition-colors"
                onClick={() => {
                  setActiveNote(note);
                  setIsDialogOpen(true);
                }}
              >
                <div className="font-medium text-sm truncate">{note.title}</div>
                <div className="text-xs text-muted-foreground truncate mt-1">
                  {note.content || 'Nota vazia'}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {note.updatedAt.toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              <Input
                value={activeNote?.title || ''}
                onChange={(e) => updateNote({ title: e.target.value })}
                className="font-semibold"
              />
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Texto:</label>
              <textarea
                className="w-full h-24 p-2 border rounded resize-none"
                value={activeNote?.content || ''}
                onChange={(e) => updateNote({ content: e.target.value })}
                placeholder="Escreva sua nota aqui..."
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Desenho:</label>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => setIsDrawing(!isDrawing)}>
                    <Pen className="w-4 h-4 mr-1" />
                    {isDrawing ? 'Parar' : 'Desenhar'}
                  </Button>
                  <Button size="sm" variant="outline" onClick={clearCanvas}>
                    Limpar
                  </Button>
                </div>
              </div>
              <canvas
                ref={canvasRef}
                width={400}
                height={200}
                className="border rounded w-full cursor-crosshair"
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
              />
            </div>

            <div className="flex justify-between">
              <div className="flex gap-2">
                <Button onClick={addToCalendar} variant="outline">
                  <Calendar className="w-4 h-4 mr-1" />
                  Adicionar ao Calendário
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={() => activeNote && deleteNote(activeNote.id)} variant="outline">
                  <Trash2 className="w-4 h-4 mr-1" />
                  Excluir
                </Button>
                <Button onClick={() => setIsDialogOpen(false)}>
                  <Save className="w-4 h-4 mr-1" />
                  Salvar
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
