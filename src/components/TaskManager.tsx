import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { Task, Column } from '../types/task';
import { TaskColumn } from './TaskColumn';
import { FloatingHeader } from './FloatingHeader';
import { CompactStats } from './CompactStats';
import { useTimer } from '../hooks/useTimer';

const initialColumns: Column[] = [
  { id: 'todo', title: 'A Fazer', taskIds: [] },
  { id: 'doing', title: 'Fazendo', taskIds: [] },
  { id: 'done', title: 'Feito', taskIds: [] },
];

const initialTasks: Task[] = [
  {
    id: '1',
    title: 'Revisar apresentação do projeto',
    duration: 45,
    pauseDuration: 15,
    timeSpent: 0,
    pauseTime: 0,
    isActive: false,
    isPaused: false,
    status: 'todo',
    createdAt: new Date(),
  },
  {
    id: '2',
    title: 'Responder e-mails importantes',
    duration: 30,
    pauseDuration: 5,
    timeSpent: 0,
    pauseTime: 0,
    isActive: false,
    isPaused: false,
    status: 'todo',
    createdAt: new Date(),
  },
];

export const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<{ [key: string]: Task }>(() => {
    const taskMap: { [key: string]: Task } = {};
    initialTasks.forEach(task => {
      taskMap[task.id] = task;
    });
    return taskMap;
  });

  const [columns, setColumns] = useState<{ [key: string]: Column }>(() => {
    const columnMap: { [key: string]: Column } = {};
    initialColumns.forEach(column => {
      if (column.id === 'todo') {
        column.taskIds = initialTasks.map(task => task.id);
      }
      columnMap[column.id] = column;
    });
    return columnMap;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(null);
  const [pausedTaskId, setPausedTaskId] = useState<string | null>(null);
  const [isMinimized, setIsMinimized] = useState(false);

  // Timer para tarefa ativa
  const { seconds: activeSeconds } = useTimer(
    activeTaskId !== null,
    useCallback((seconds) => {
      if (activeTaskId && !tasks[activeTaskId]?.isPaused) {
        setTasks(prev => ({
          ...prev,
          [activeTaskId]: {
            ...prev[activeTaskId],
            timeSpent: seconds,
          },
        }));
      }
    }, [activeTaskId, tasks])
  );

  // Timer para pausa
  const { seconds: pauseSeconds } = useTimer(
    pausedTaskId !== null,
    useCallback((seconds) => {
      if (pausedTaskId) {
        setTasks(prev => ({
          ...prev,
          [pausedTaskId]: {
            ...prev[pausedTaskId],
            pauseTime: seconds,
          },
        }));
      }
    }, [pausedTaskId])
  );

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const start = columns[source.droppableId];
    const finish = columns[destination.droppableId];

    if (start === finish) {
      const newTaskIds = Array.from(start.taskIds);
      newTaskIds.splice(source.index, 1);
      newTaskIds.splice(destination.index, 0, draggableId);

      const newColumn = {
        ...start,
        taskIds: newTaskIds,
      };

      setColumns(prev => ({
        ...prev,
        [newColumn.id]: newColumn,
      }));
      return;
    }

    // Moving from one column to another
    const startTaskIds = Array.from(start.taskIds);
    startTaskIds.splice(source.index, 1);
    const newStart = {
      ...start,
      taskIds: startTaskIds,
    };

    const finishTaskIds = Array.from(finish.taskIds);
    finishTaskIds.splice(destination.index, 0, draggableId);
    const newFinish = {
      ...finish,
      taskIds: finishTaskIds,
    };

    // Update task status
    const updatedTask = {
      ...tasks[draggableId],
      status: destination.droppableId as 'todo' | 'doing' | 'done',
      isActive: false,
      isPaused: false,
    };

    // Se mover para "doing", parar outras tarefas ativas
    if (destination.droppableId === 'doing') {
      setActiveTaskId(null);
      setPausedTaskId(null);
    }

    setColumns(prev => ({
      ...prev,
      [newStart.id]: newStart,
      [newFinish.id]: newFinish,
    }));

    setTasks(prev => ({
      ...prev,
      [draggableId]: updatedTask,
    }));
  };

  const updateTask = useCallback((taskId: string, updates: Partial<Task>) => {
    setTasks(prev => ({
      ...prev,
      [taskId]: { ...prev[taskId], ...updates },
    }));
  }, []);

  const toggleTimer = useCallback((taskId: string) => {
    const task = tasks[taskId];
    
    if (task.isActive && !task.isPaused) {
      // Parar timer
      setActiveTaskId(null);
      updateTask(taskId, { isActive: false });
    } else {
      // Iniciar timer - parar outros primeiro
      setActiveTaskId(null);
      setPausedTaskId(null);
      
      // Parar todas as outras tarefas
      Object.keys(tasks).forEach(id => {
        if (id !== taskId) {
          updateTask(id, { isActive: false, isPaused: false });
        }
      });

      // Iniciar esta tarefa
      setActiveTaskId(taskId);
      updateTask(taskId, { 
        isActive: true, 
        isPaused: false,
        timeSpent: task.timeSpent || 0
      });
    }
  }, [tasks, updateTask]);

  const togglePause = useCallback((taskId: string) => {
    const task = tasks[taskId];
    
    if (task.isPaused) {
      // Sair da pausa
      setPausedTaskId(null);
      setActiveTaskId(taskId);
      updateTask(taskId, { isPaused: false });
    } else {
      // Entrar na pausa
      setActiveTaskId(null);
      setPausedTaskId(taskId);
      updateTask(taskId, { isPaused: true });
    }
  }, [tasks, updateTask]);

  const stopTask = useCallback((taskId: string) => {
    setActiveTaskId(null);
    setPausedTaskId(null);
    updateTask(taskId, { isActive: false, isPaused: false });
  }, [updateTask]);

  const addTask = useCallback((columnId: string) => {
    const newId = Date.now().toString();
    const newTask: Task = {
      id: newId,
      title: 'Nova tarefa',
      duration: 30,
      pauseDuration: 5,
      timeSpent: 0,
      pauseTime: 0,
      isActive: false,
      isPaused: false,
      status: columnId as 'todo' | 'doing' | 'done',
      createdAt: new Date(),
    };

    setTasks(prev => ({
      ...prev,
      [newId]: newTask,
    }));

    setColumns(prev => ({
      ...prev,
      [columnId]: {
        ...prev[columnId],
        taskIds: [...prev[columnId].taskIds, newId],
      },
    }));
  }, []);

  // Estatísticas do dia
  const todayStats = {
    total: Object.keys(tasks).length,
    completed: Object.values(tasks).filter(task => task.status === 'done').length,
    inProgress: Object.values(tasks).filter(task => task.status === 'doing').length,
    totalTime: Object.values(tasks).reduce((acc, task) => acc + task.timeSpent, 0),
  };

  return (
    <div className="fixed inset-4 z-50 bg-background/95 backdrop-blur border border-border rounded-lg shadow-2xl overflow-hidden">
      <FloatingHeader 
        isMinimized={isMinimized}
        onToggleMinimize={() => setIsMinimized(!isMinimized)}
      />
      
      {!isMinimized && (
        <div className="p-4 h-[calc(100vh-8rem)] overflow-auto">
          <div className="mb-4">
            <CompactStats stats={todayStats} />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['todo', 'doing', 'done'].map(columnId => {
                const column = columns[columnId];
                const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                return (
                  <TaskColumn
                    key={column.id}
                    column={column}
                    tasks={columnTasks}
                    onUpdateTask={updateTask}
                    onToggleTimer={toggleTimer}
                    onTogglePause={togglePause}
                    onStopTask={stopTask}
                    onAddTask={addTask}
                  />
                );
              })}
            </div>
          </DragDropContext>
        </div>
      )}
      
      {isMinimized && (
        <div className="p-4">
          <CompactStats stats={todayStats} />
        </div>
      )}
    </div>
  );
};
