import React, { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, Pause, Play, Square, Timer, Hand, RotateCcw, Trash2 } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime, getProgressPercentage } from '../utils/timeUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';

interface TaskCardProps {
  task: Task;
  index: number;
  columnId: string;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTimer: (taskId: string) => void;
  onTogglePause: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
  onResetTime: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  columnId,
  onUpdateTask,
  onToggleTimer,
  onTogglePause,
  onStopTask,
  onResetTime,
  onDeleteTask,
}) => {
  const [customTime, setCustomTime] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  
  const progressPercentage = getProgressPercentage(task.timeSpent, task.duration);
  const isOvertime = task.timeSpent > task.duration * 60;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask(task.id, { title: e.target.value });
  };

  const handleDurationChange = (duration: number) => {
    onUpdateTask(task.id, { duration });
  };

  const handlePauseDurationChange = (pauseDuration: 5 | 15 | 30) => {
    onUpdateTask(task.id, { pauseDuration });
  };

  const handleResetTime = () => {
    onResetTime(task.id);
  };

  const handleDeleteTask = () => {
    onDeleteTask(task.id);
  };

  const handleCustomTimeSubmit = () => {
    const timeInMinutes = parseCustomTime(customTime);
    if (timeInMinutes > 0) {
      onUpdateTask(task.id, { duration: timeInMinutes });
      setCustomTime('');
      setShowCustomInput(false);
    }
  };

  const parseCustomTime = (timeStr: string): number => {
    const cleaned = timeStr.toLowerCase().trim();
    
    // Handle formats like "1h30m", "1h30", "90m", "90"
    const hourMinuteMatch = cleaned.match(/(\d+)h(?:(\d+)m?)?/);
    if (hourMinuteMatch) {
      const hours = parseInt(hourMinuteMatch[1]);
      const minutes = hourMinuteMatch[2] ? parseInt(hourMinuteMatch[2]) : 0;
      return hours * 60 + minutes;
    }
    
    // Handle formats like "30m", "30"
    const minuteMatch = cleaned.match(/(\d+)m?/);
    if (minuteMatch) {
      return parseInt(minuteMatch[1]);
    }
    
    return 0;
  };

  const formatDurationDisplay = (minutes: number): string => {
    if (minutes >= 60 && minutes % 60 === 0) {
      return `${minutes / 60}h`;
    }
    return `${minutes}m`;
  };

  // Card simplificado para "A Fazer"
  if (columnId === 'todo') {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 transition-all duration-200 ${
              snapshot.isDragging ? 'rotate-1 shadow-lg' : 'hover:shadow-md'
            } bg-card border-border`}
          >
            <CardContent className="p-3">
              <div className="flex items-center gap-2">
                <Hand className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                <input
                  type="text"
                  value={task.title}
                  onChange={handleTitleChange}
                  className="flex-1 font-medium text-sm bg-transparent border-none outline-none focus:bg-background focus:border focus:border-border rounded px-1 py-1 text-foreground"
                  placeholder="Nome da tarefa..."
                />
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleDeleteTask}
                  className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                >
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  }

  // Card simplificado para "Feito"
  if (columnId === 'done') {
    return (
      <Draggable draggableId={task.id} index={index}>
        {(provided, snapshot) => (
          <Card
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            className={`mb-3 transition-all duration-200 ${
              snapshot.isDragging ? 'rotate-1 shadow-lg' : 'hover:shadow-md'
            } bg-muted/50 border-border opacity-75`}
          >
            <CardContent className="p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Hand className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                  <span className="font-medium text-sm text-muted-foreground line-through">
                    {task.title}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground font-mono">
                      {formatTime(task.timeSpent)}
                    </span>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleDeleteTask}
                    className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </Draggable>
    );
  }

  // Card completo para "Fazendo"
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-1 shadow-lg' : 'hover:shadow-md'
          } ${task.isActive ? 'ring-2 ring-primary bg-primary/5' : 'bg-card'} border-border`}
        >
          <CardHeader className="pb-2">
            <div className="flex items-center gap-2">
              <Hand className="w-4 h-4 text-muted-foreground flex-shrink-0" />
              <input
                type="text"
                value={task.title}
                onChange={handleTitleChange}
                className="flex-1 font-medium text-sm bg-transparent border-none outline-none focus:bg-background focus:border focus:border-border rounded px-1 py-1 text-foreground"
                placeholder="Nome da tarefa..."
              />
              <Button
                size="sm"
                variant="ghost"
                onClick={handleDeleteTask}
                className="h-6 w-6 p-0 text-destructive hover:text-destructive"
              >
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Duração e controles */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[30, 45, 60].map((duration) => (
                <Badge
                  key={duration}
                  variant={task.duration === duration ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleDurationChange(duration)}
                >
                  {formatDurationDisplay(duration)}
                </Badge>
              ))}
              
              {!showCustomInput ? (
                <Badge
                  variant="outline"
                  className="cursor-pointer text-xs"
                  onClick={() => setShowCustomInput(true)}
                >
                  +
                </Badge>
              ) : (
                <div className="flex gap-1">
                  <input
                    type="text"
                    value={customTime}
                    onChange={(e) => setCustomTime(e.target.value)}
                    placeholder="ex: 1h30m"
                    className="w-16 text-xs px-1 py-0.5 border rounded bg-background"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleCustomTimeSubmit();
                      if (e.key === 'Escape') {
                        setShowCustomInput(false);
                        setCustomTime('');
                      }
                    }}
                    autoFocus
                  />
                  <button
                    onClick={handleCustomTimeSubmit}
                    className="text-xs px-1 py-0.5 border rounded bg-primary text-primary-foreground"
                  >
                    ✓
                  </button>
                </div>
              )}
            </div>

            {/* Barra de progresso */}
            <div className={`w-full bg-muted rounded-full h-2 mb-3 ${isOvertime ? 'bg-destructive/20' : ''}`}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isOvertime ? 'bg-destructive' : 'bg-primary'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>

            {/* Tempo principal */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-muted-foreground" />
                <span className={`font-mono text-sm ${isOvertime ? 'text-destructive' : 'text-foreground'}`}>
                  {formatTime(task.timeSpent)}
                </span>
              </div>
              <span className="text-xs text-muted-foreground">
                / {formatDurationDisplay(task.duration)}
              </span>
            </div>

            {/* Tempo de pausa */}
            {task.pauseTime > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-4 h-4 text-muted-foreground" />
                <span className="font-mono text-sm text-muted-foreground">
                  Pausa: {formatTime(task.pauseTime)}
                </span>
              </div>
            )}

            {/* Controles de pausa */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[5, 15, 30].map((pauseDuration) => (
                <Badge
                  key={pauseDuration}
                  variant={task.pauseDuration === pauseDuration ? "secondary" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handlePauseDurationChange(pauseDuration as 5 | 15 | 30)}
                >
                  {formatDurationDisplay(pauseDuration)} pausa
                </Badge>
              ))}
            </div>

            {/* Botões de controle */}
            <div className="flex gap-2 mt-3">
              <Button
                size="sm"
                variant={task.isActive && !task.isPaused ? "destructive" : "default"}
                onClick={() => onToggleTimer(task.id)}
                className="flex-1"
              >
                {task.isActive && !task.isPaused ? (
                  <>
                    <Square className="w-3 h-3 mr-1" />
                    Parar
                  </>
                ) : (
                  <>
                    <Play className="w-3 h-3 mr-1" />
                    Iniciar
                  </>
                )}
              </Button>
              
              {task.isActive && (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onTogglePause(task.id)}
                >
                  <Pause className="w-3 h-3" />
                </Button>
              )}
              
              <Button
                size="sm"
                variant="outline"
                onClick={handleResetTime}
                title="Resetar tempo"
              >
                <RotateCcw className="w-3 h-3" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
