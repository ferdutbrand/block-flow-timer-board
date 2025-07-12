
import React from 'react';
import { Droppable } from '@hello-pangea/dnd';
import { Plus } from 'lucide-react';
import { Task, Column } from '../types/task';
import { TaskCard } from './TaskCard';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';

interface TaskColumnProps {
  column: Column;
  tasks: Task[];
  onUpdateTask: (taskId: string, updates: Partial<Task>) => void;
  onToggleTimer: (taskId: string) => void;
  onTogglePause: (taskId: string) => void;
  onStopTask: (taskId: string) => void;
  onResetTime: (taskId: string) => void;
  onDeleteTask: (taskId: string) => void;
  onAddTask: (columnId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onUpdateTask,
  onToggleTimer,
  onTogglePause,
  onStopTask,
  onResetTime,
  onDeleteTask,
  onAddTask,
}) => {
  const getColumnStyles = () => {
    switch (column.id) {
      case 'todo':
        return 'border-border bg-card';
      case 'doing':
        return 'border-primary bg-primary/5 shadow-lg ring-1 ring-primary/20';
      case 'done':
        return 'border-border bg-muted/30';
      default:
        return 'border-border bg-card';
    }
  };

  const getHeaderStyles = () => {
    switch (column.id) {
      case 'todo':
        return 'text-muted-foreground';
      case 'doing':
        return 'text-primary font-semibold';
      case 'done':
        return 'text-muted-foreground';
      default:
        return 'text-muted-foreground';
    }
  };

  return (
    <Card className={`h-fit min-h-[400px] ${getColumnStyles()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${getHeaderStyles()}`}>
            {column.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground bg-background px-2 py-1 rounded-full border">
              {tasks.length}
            </span>
            {column.id === 'todo' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddTask(column.id)}
                className="h-7 w-7 p-0"
              >
                <Plus className="w-3 h-3" />
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        <Droppable droppableId={column.id}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className={`min-h-[300px] transition-colors duration-200 ${
                snapshot.isDraggingOver ? 'bg-accent/20 rounded-lg' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  columnId={column.id}
                  onUpdateTask={onUpdateTask}
                  onToggleTimer={onToggleTimer}
                  onTogglePause={onTogglePause}
                  onStopTask={onStopTask}
                  onResetTime={onResetTime}
                  onDeleteTask={onDeleteTask}
                />
              ))}
              {provided.placeholder}
              
              {tasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-muted-foreground text-sm border-2 border-dashed border-border rounded-lg">
                  {column.id === 'todo' && 'Adicione uma nova tarefa'}
                  {column.id === 'doing' && 'Arraste tarefas aqui para começar'}
                  {column.id === 'done' && 'Tarefas concluídas aparecerão aqui'}
                </div>
              )}
            </div>
          )}
        </Droppable>
      </CardContent>
    </Card>
  );
};
