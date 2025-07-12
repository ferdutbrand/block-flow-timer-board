
import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CalendarDays, Plus, Edit, Trash2, Maximize2 } from 'lucide-react';
import { AgendaItem, CalendarView } from '../types/calendar';
import { format, startOfWeek, endOfWeek, startOfMonth, endOfMonth, startOfYear, endOfYear, eachDayOfInterval, isSameDay } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface CalendarBlockProps {
  onTaskCreate?: (task: { title: string; description?: string; date: Date; time?: string }) => void;
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const CalendarBlock: React.FC<CalendarBlockProps> = ({ 
  onTaskCreate, 
  isExpanded = false, 
  onToggleExpand 
}) => {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [view, setView] = useState<CalendarView>('monthly');
  const [agendaItems, setAgendaItems] = useState<AgendaItem[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<AgendaItem | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    time: ''
  });

  useEffect(() => {
    const saved = localStorage.getItem('3fortime-agenda');
    if (saved) {
      const items = JSON.parse(saved).map((item: any) => ({
        ...item,
        date: new Date(item.date),
        createdAt: new Date(item.createdAt)
      }));
      setAgendaItems(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('3fortime-agenda', JSON.stringify(agendaItems));
  }, [agendaItems]);

  const handleAddItem = () => {
    if (!formData.title.trim()) return;

    const newItem: AgendaItem = {
      id: Date.now().toString(),
      title: formData.title,
      description: formData.description,
      date: selectedDate,
      time: formData.time,
      createdAt: new Date()
    };

    if (editingItem) {
      setAgendaItems(prev => prev.map(item => 
        item.id === editingItem.id ? { ...newItem, id: editingItem.id } : item
      ));
    } else {
      setAgendaItems(prev => [...prev, newItem]);
    }

    // Criar tarefa se callback fornecido
    if (onTaskCreate && !editingItem) {
      onTaskCreate({
        title: formData.title,
        description: formData.description,
        date: selectedDate,
        time: formData.time
      });
    }

    setFormData({ title: '', description: '', time: '' });
    setEditingItem(null);
    setIsDialogOpen(false);
  };

  const handleEditItem = (item: AgendaItem) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description || '',
      time: item.time || ''
    });
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsForDate = (date: Date) => {
    return agendaItems.filter(item => isSameDay(item.date, date));
  };

  const renderCalendarView = () => {
    switch (view) {
      case 'weekly':
        // Começar na segunda-feira
        const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1, locale: ptBR });
        const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1, locale: ptBR });
        const weekDays = eachDayOfInterval({ start: weekStart, end: weekEnd });
        
        return (
          <div className="space-y-2">
            <div className="grid grid-cols-7 gap-1">
              {weekDays.map(day => (
                <div key={day.toISOString()} className="p-2 border rounded text-center">
                  <div className="font-medium text-sm">{format(day, 'EEE', { locale: ptBR })}</div>
                  <div className="text-lg">{format(day, 'd')}</div>
                  <div className="mt-1 space-y-1">
                    {getItemsForDate(day).map(item => (
                      <div 
                        key={item.id} 
                        className="text-xs bg-primary/10 p-1 rounded truncate cursor-pointer hover:bg-primary/20"
                        onClick={() => handleEditItem(item)}
                      >
                        {item.time && <span className="font-medium">{item.time}</span>}
                        <div>{item.title}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
        
      case 'yearly':
        return (
          <div className="text-center">
            <h3 className="text-xl font-bold mb-4">{format(selectedDate, 'yyyy')}</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from({ length: 12 }, (_, i) => {
                const month = new Date(selectedDate.getFullYear(), i, 1);
                const monthItems = agendaItems.filter(item => 
                  item.date.getFullYear() === selectedDate.getFullYear() && 
                  item.date.getMonth() === i
                );
                
                return (
                  <div key={i} className="p-2 border rounded">
                    <div className="font-medium text-sm">{format(month, 'MMM', { locale: ptBR })}</div>
                    <div className="text-xs text-muted-foreground">{monthItems.length} tarefas</div>
                  </div>
                );
              })}
            </div>
          </div>
        );
        
      default:
        return (
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && setSelectedDate(date)}
            className="w-full"
            weekStartsOn={1}
          />
        );
    }
  };

  const selectedDateItems = getItemsForDate(selectedDate);

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <h3 className="font-semibold">Calendário</h3>
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={view} 
            onChange={(e) => setView(e.target.value as CalendarView)}
            className="text-sm border rounded px-2 py-1"
          >
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
            <option value="yearly">Anual</option>
          </select>
          
          {onToggleExpand && (
            <Button size="sm" variant="ghost" onClick={onToggleExpand}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm" onClick={() => {
                setEditingItem(null);
                setFormData({ title: '', description: '', time: '' });
              }}>
                <Plus className="w-4 h-4" />
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingItem ? 'Editar Tarefa' : 'Nova Tarefa'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Título da tarefa"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                />
                <Input
                  type="time"
                  value={formData.time}
                  onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                />
                <Textarea
                  placeholder="Descrição (opcional)"
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                />
                <div className="flex gap-2">
                  <Button onClick={handleAddItem} className="flex-1">
                    {editingItem ? 'Salvar' : 'Adicionar'}
                  </Button>
                  <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderCalendarView()}
      </div>

      {view !== 'yearly' && selectedDateItems.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2">
            {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
          </h4>
          <div className="space-y-2 max-h-32 overflow-auto">
            {selectedDateItems.map(item => (
              <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded">
                <div className="flex-1">
                  <div className="font-medium text-sm">
                    {item.time && <span className="text-primary">{item.time}</span>} {item.title}
                  </div>
                  {item.description && (
                    <div className="text-xs text-muted-foreground">{item.description}</div>
                  )}
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="ghost" onClick={() => handleEditItem(item)}>
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => handleDeleteItem(item.id)}>
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={onToggleExpand}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Calendário</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
