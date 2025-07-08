
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
  onAddTask: (columnId: string) => void;
}

export const TaskColumn: React.FC<TaskColumnProps> = ({
  column,
  tasks,
  onUpdateTask,
  onToggleTimer,
  onTogglePause,
  onStopTask,
  onAddTask,
}) => {
  const getColumnColor = () => {
    switch (column.id) {
      case 'todo':
        return 'border-gray-300 bg-gray-50';
      case 'doing':
        return 'border-blue-300 bg-blue-50';
      case 'done':
        return 'border-green-300 bg-green-50';
      default:
        return 'border-gray-300 bg-gray-50';
    }
  };

  const getHeaderColor = () => {
    switch (column.id) {
      case 'todo':
        return 'text-gray-700';
      case 'doing':
        return 'text-blue-700';
      case 'done':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <Card className={`h-fit min-h-[400px] ${getColumnColor()}`}>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className={`text-lg ${getHeaderColor()}`}>
            {column.title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 bg-white px-2 py-1 rounded-full">
              {tasks.length}
            </span>
            {column.id === 'todo' && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddTask(column.id)}
                className="h-8 w-8 p-0"
              >
                <Plus className="w-4 h-4" />
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
                snapshot.isDraggingOver ? 'bg-white/50 rounded-lg' : ''
              }`}
            >
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onUpdateTask={onUpdateTask}
                  onToggleTimer={onToggleTimer}
                  onTogglePause={onTogglePause}
                  onStopTask={onStopTask}
                />
              ))}
              {provided.placeholder}
              
              {tasks.length === 0 && (
                <div className="flex items-center justify-center h-32 text-gray-400 text-sm border-2 border-dashed border-gray-200 rounded-lg">
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
