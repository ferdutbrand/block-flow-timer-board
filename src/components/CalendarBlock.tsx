
import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/calendar';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { CalendarDays, Plus, Edit, Trash2, Maximize2, ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import { AgendaItem, CalendarView } from '../types/calendar';
import { format, startOfWeek, endOfWeek, addWeeks, subWeeks, eachDayOfInterval, isSameDay, isToday, isSameMonth, addMonths, subMonths, startOfMonth, endOfMonth } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ScrollArea } from './ui/scroll-area';

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
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1, locale: ptBR })
  );

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
    setSelectedDate(item.date);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = (id: string) => {
    setAgendaItems(prev => prev.filter(item => item.id !== id));
  };

  const getItemsForDate = (date: Date) => {
    return agendaItems.filter(item => isSameDay(item.date, date));
  };

  const navigateWeek = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setCurrentWeekStart(subWeeks(currentWeekStart, 1));
    } else {
      setCurrentWeekStart(addWeeks(currentWeekStart, 1));
    }
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setSelectedDate(subMonths(selectedDate, 1));
    } else {
      setSelectedDate(addMonths(selectedDate, 1));
    }
  };

  const renderWeeklyView = () => {
    const weekEnd = endOfWeek(currentWeekStart, { weekStartsOn: 1, locale: ptBR });
    const weekDays = eachDayOfInterval({ start: currentWeekStart, end: weekEnd });
    
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => navigateWeek('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h4 className="font-medium">
              {format(currentWeekStart, 'dd MMM', { locale: ptBR })} - {format(weekEnd, 'dd MMM yyyy', { locale: ptBR })}
            </h4>
            <Button size="sm" variant="outline" onClick={() => navigateWeek('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={() => setCurrentWeekStart(startOfWeek(new Date(), { weekStartsOn: 1 }))}>
            Hoje
          </Button>
        </div>
        
        <div className="grid grid-cols-7 gap-1">
          {weekDays.map(day => {
            const dayItems = getItemsForDate(day);
            const isCurrentDay = isToday(day);
            
            return (
              <div 
                key={day.toISOString()} 
                className={`p-2 border rounded-lg min-h-[120px] cursor-pointer transition-colors ${
                  isCurrentDay ? 'bg-blue-50 border-blue-200' : 'hover:bg-gray-50'
                } ${isSameDay(day, selectedDate) ? 'ring-2 ring-blue-500' : ''}`}
                onClick={() => setSelectedDate(day)}
              >
                <div className="text-center mb-2">
                  <div className="text-xs font-medium text-gray-500 uppercase">
                    {format(day, 'EEE', { locale: ptBR })}
                  </div>
                  <div className={`text-lg font-semibold ${isCurrentDay ? 'text-blue-600' : ''}`}>
                    {format(day, 'd')}
                  </div>
                </div>
                
                <ScrollArea className="h-20">
                  <div className="space-y-1">
                    {dayItems.map(item => (
                      <div 
                        key={item.id} 
                        className="text-xs bg-primary/10 hover:bg-primary/20 p-1 rounded cursor-pointer transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleEditItem(item);
                        }}
                      >
                        {item.time && (
                          <div className="font-medium text-primary flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {item.time}
                          </div>
                        )}
                        <div className="truncate font-medium">{item.title}</div>
                        {item.description && (
                          <div className="text-gray-500 truncate">{item.description}</div>
                        )}
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  const renderMonthlyView = () => {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Button size="sm" variant="outline" onClick={() => navigateMonth('prev')}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <h4 className="font-medium text-lg">
              {format(selectedDate, 'MMMM yyyy', { locale: ptBR })}
            </h4>
            <Button size="sm" variant="outline" onClick={() => navigateMonth('next')}>
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button size="sm" variant="outline" onClick={() => setSelectedDate(new Date())}>
            Hoje
          </Button>
        </div>
        
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={(date) => date && setSelectedDate(date)}
          className="w-full"
          weekStartsOn={1}
          locale={ptBR}
          month={selectedDate}
          onMonthChange={setSelectedDate}
          components={{
            Day: ({ date, ...props }) => {
              const dayItems = getItemsForDate(date);
              const hasItems = dayItems.length > 0;
              
              return (
                <div className="relative">
                  <button {...props} />
                  {hasItems && (
                    <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-primary rounded-full"></div>
                  )}
                </div>
              );
            }
          }}
        />
      </div>
    );
  };

  const selectedDateItems = getItemsForDate(selectedDate);

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5" />
          <h3 className="font-semibold">Agenda</h3>
          {agendaItems.length > 0 && (
            <Badge variant="secondary">{agendaItems.length}</Badge>
          )}
        </div>
        
        <div className="flex items-center gap-2">
          <select 
            value={view} 
            onChange={(e) => setView(e.target.value as CalendarView)}
            className="text-sm border rounded px-2 py-1 bg-background"
          >
            <option value="weekly">Semanal</option>
            <option value="monthly">Mensal</option>
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
                  {editingItem ? 'Editar Evento' : 'Novo Evento'}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-1 block">Título</label>
                  <Input
                    placeholder="Ex: Reunião com cliente"
                    value={formData.title}
                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Horário</label>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-1 block">Descrição</label>
                  <Textarea
                    placeholder="Detalhes adicionais (opcional)"
                    value={formData.description}
                    onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  />
                </div>
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
        {view === 'weekly' ? renderWeeklyView() : renderMonthlyView()}
      </div>

      {selectedDateItems.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium mb-2 flex items-center gap-2">
            <CalendarDays className="w-4 h-4" />
            {format(selectedDate, 'dd/MM/yyyy', { locale: ptBR })}
            <Badge variant="outline">{selectedDateItems.length}</Badge>
          </h4>
          <ScrollArea className="max-h-32">
            <div className="space-y-2">
              {selectedDateItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors">
                  <div className="flex-1">
                    <div className="font-medium text-sm flex items-center gap-2">
                      {item.time && (
                        <Badge variant="outline" className="text-xs">
                          {item.time}
                        </Badge>
                      )}
                      {item.title}
                    </div>
                    {item.description && (
                      <div className="text-xs text-muted-foreground mt-1">{item.description}</div>
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
          </ScrollArea>
        </div>
      )}
    </div>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={onToggleExpand}>
        <DialogContent className="max-w-7xl max-h-[95vh] w-[95vw] h-[95vh]">
          <DialogHeader>
            <DialogTitle>Agenda Completa</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto flex-1 p-4">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
