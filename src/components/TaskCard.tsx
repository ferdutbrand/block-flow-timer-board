
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Clock, Pause, Play, Square, Timer } from 'lucide-react';
import { Task } from '../types/task';
import { formatTime, getProgressPercentage } from '../utils/timeUtils';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';

interface TaskCardProps {
  task: Task;
  index: number;
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTimer: (taskId: string) => void;
  onTogglePause: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  index,
  onUpdateTask,
  onToggleTimer,
  onTogglePause,
  onStopTask,
}) => {
  const progressPercentage = getProgressPercentage(task.timeSpent, task.duration);
  const isOvertime = task.timeSpent > task.duration * 60;

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdateTask(task.id, { title: e.target.value });
  };

  const handleDurationChange = (duration: 30 | 45 | 60) => {
    onUpdateTask(task.id, { duration });
  };

  const handlePauseDurationChange = (pauseDuration: 5 | 15 | 30) => {
    onUpdateTask(task.id, { pauseDuration });
  };

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <Card
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`mb-3 transition-all duration-200 ${
            snapshot.isDragging ? 'rotate-2 shadow-lg' : 'hover:shadow-md'
          } ${task.isActive ? 'ring-2 ring-blue-500 bg-blue-50' : ''}`}
        >
          <CardHeader className="pb-2">
            <input
              type="text"
              value={task.title}
              onChange={handleTitleChange}
              className="font-medium text-sm bg-transparent border-none outline-none focus:bg-white focus:border focus:border-gray-300 rounded px-1 py-1"
              placeholder="Nome da tarefa..."
            />
          </CardHeader>
          
          <CardContent className="pt-0">
            {/* Duração e controles */}
            <div className="flex flex-wrap gap-1 mb-3">
              {[30, 45, 60].map((duration) => (
                <Badge
                  key={duration}
                  variant={task.duration === duration ? "default" : "outline"}
                  className="cursor-pointer text-xs"
                  onClick={() => handleDurationChange(duration as 30 | 45 | 60)}
                >
                  {duration}min
                </Badge>
              ))}
            </div>

            {/* Barra de progresso */}
            <div className={`w-full bg-gray-200 rounded-full h-2 mb-3 ${isOvertime ? 'bg-red-100' : ''}`}>
              <div
                className={`h-2 rounded-full transition-all duration-300 ${
                  isOvertime ? 'bg-red-500' : 'bg-blue-500'
                }`}
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>

            {/* Tempo principal */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gray-500" />
                <span className={`font-mono text-sm ${isOvertime ? 'text-red-600' : 'text-gray-700'}`}>
                  {formatTime(task.timeSpent)}
                </span>
              </div>
              <span className="text-xs text-gray-500">
                / {task.duration}min
              </span>
            </div>

            {/* Tempo de pausa */}
            {task.pauseTime > 0 && (
              <div className="flex items-center gap-2 mb-3">
                <Timer className="w-4 h-4 text-orange-500" />
                <span className="font-mono text-sm text-orange-600">
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
                  {pauseDuration}min pausa
                </Badge>
              ))}
            </div>

            {/* Botões de controle */}
            {task.status === 'doing' && (
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
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
};
