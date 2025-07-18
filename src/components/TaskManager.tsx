import React, { useState, useCallback, useEffect } from 'react';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Task, Column } from '../types/task';
import { TaskColumn } from './TaskColumn';
import { FloatingHeader } from './FloatingHeader';
import { CompactStats } from './CompactStats';
import { CalendarBlock } from './CalendarBlock';
import { NotesBlock } from './NotesBlock';
import { CalculatorBlock } from './CalculatorBlock';
import { EmailBlock } from './EmailBlock';
import { AIChat } from './AIChat';
import { MindMapBlock } from './MindMapBlock';
import { DraggableWidget } from './DraggableWidget';
import { useTimer } from '../hooks/useTimer';
import { useToast } from '@/hooks/use-toast';
import { useWidgetOrder, Widget } from '../hooks/useWidgetOrder';

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

const initialWidgets: Widget[] = [
  { id: 'calendar', component: 'CalendarBlock', position: 0 },
  { id: 'notes', component: 'NotesBlock', position: 1 },
  { id: 'calculator', component: 'CalculatorBlock', position: 2 },
  { id: 'email', component: 'EmailBlock', position: 3 },
  { id: 'ai', component: 'AIChat', position: 4 },
  { id: 'mindmap', component: 'MindMapBlock', position: 5 },
];

// Audio utility functions
const playNotificationSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.1);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
  
  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.3);
};

const playAlarmSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.2);
  oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.4);
  oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.6);
  
  gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.8);
  
  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + 0.8);
};

export const TaskManager: React.FC = () => {
  const { toast } = useToast();
  
  // Widget order management
  const { widgets, moveWidget } = useWidgetOrder(initialWidgets);
  
  // Load saved data from localStorage
  const [tasks, setTasks] = useState<{ [key: string]: Task }>(() => {
    const savedTasks = localStorage.getItem('3fortime-tasks');
    if (savedTasks) {
      const parsedTasks = JSON.parse(savedTasks);
      Object.keys(parsedTasks).forEach(key => {
        parsedTasks[key].createdAt = new Date(parsedTasks[key].createdAt);
      });
      return parsedTasks;
    }
    
    const taskMap: { [key: string]: Task } = {};
    initialTasks.forEach(task => {
      taskMap[task.id] = task;
    });
    return taskMap;
  });

  const [columns, setColumns] = useState<{ [key: string]: Column }>(() => {
    const savedColumns = localStorage.getItem('3fortime-columns');
    if (savedColumns) {
      return JSON.parse(savedColumns);
    }
    
    const columnMap: { [key: string]: Column } = {};
    initialColumns.forEach(column => {
      if (column.id === 'todo') {
        column.taskIds = initialTasks.map(task => task.id);
      }
      columnMap[column.id] = column;
    });
    return columnMap;
  });

  const [activeTaskId, setActiveTaskId] = useState<string | null>(() => {
    const savedActiveTask = localStorage.getItem('3fortime-activeTask');
    return savedActiveTask || null;
  });
  
  const [pausedTaskId, setPausedTaskId] = useState<string | null>(() => {
    const savedPausedTask = localStorage.getItem('3fortime-pausedTask');
    return savedPausedTask || null;
  });
  
  const [isMinimized, setIsMinimized] = useState(false);
  const [fiveMinuteWarningShown, setFiveMinuteWarningShown] = useState<{ [key: string]: boolean }>({});
  const [expandedBlocks, setExpandedBlocks] = useState<{ [key: string]: boolean }>({});

  // Auto-save to localStorage
  useEffect(() => {
    localStorage.setItem('3fortime-tasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('3fortime-columns', JSON.stringify(columns));
  }, [columns]);

  useEffect(() => {
    localStorage.setItem('3fortime-activeTask', activeTaskId || '');
  }, [activeTaskId]);

  useEffect(() => {
    localStorage.setItem('3fortime-pausedTask', pausedTaskId || '');
  }, [pausedTaskId]);

  // Estados para expansão dos blocos
  const toggleBlockExpansion = (blockId: string) => {
    setExpandedBlocks(prev => ({
      ...prev,
      [blockId]: !prev[blockId]
    }));
  };

  const { seconds: activeSeconds, reset: resetActiveTimer } = useTimer(
    activeTaskId !== null,
    useCallback((seconds) => {
      if (activeTaskId && !tasks[activeTaskId]?.isPaused) {
        const task = tasks[activeTaskId];
        const totalDurationSeconds = task.duration * 60;
        const remainingSeconds = totalDurationSeconds - seconds;
        
        if (remainingSeconds === 300 && !fiveMinuteWarningShown[activeTaskId]) {
          playNotificationSound();
          toast({
            title: "⏰ 5 minutos restantes!",
            description: `A tarefa "${task.title}" está quase acabando.`,
          });
          setFiveMinuteWarningShown(prev => ({ ...prev, [activeTaskId]: true }));
        }
        
        if (remainingSeconds <= 0 && seconds >= totalDurationSeconds) {
          playAlarmSound();
          toast({
            title: "🔔 Tempo esgotado!",
            description: `A tarefa "${task.title}" foi concluída.`,
            variant: "destructive",
          });
        }
        
        setTasks(prev => ({
          ...prev,
          [activeTaskId]: {
            ...prev[activeTaskId],
            timeSpent: seconds,
          },
        }));
      }
    }, [activeTaskId, tasks, fiveMinuteWarningShown, toast])
  );

  const { seconds: pauseSeconds, reset: resetPauseTimer } = useTimer(
    pausedTaskId !== null,
    useCallback((seconds) => {
      if (pausedTaskId) {
        const task = tasks[pausedTaskId];
        const totalPauseDurationSeconds = task.pauseDuration * 60;
        const remainingSeconds = totalPauseDurationSeconds - seconds;
        
        if (remainingSeconds === 300 && task.pauseDuration > 5 && !fiveMinuteWarningShown[`pause-${pausedTaskId}`]) {
          playNotificationSound();
          toast({
            title: "⏰ Pausa quase acabando!",
            description: `Faltam 5 minutos para retomar "${task.title}".`,
          });
          setFiveMinuteWarningShown(prev => ({ ...prev, [`pause-${pausedTaskId}`]: true }));
        }
        
        if (remainingSeconds <= 0 && seconds >= totalPauseDurationSeconds) {
          playAlarmSound();
          toast({
            title: "🔔 Pausa finalizada!",
            description: `Hora de retomar a tarefa "${task.title}".`,
          });
        }
        
        setTasks(prev => ({
          ...prev,
          [pausedTaskId]: {
            ...prev[pausedTaskId],
            pauseTime: seconds,
          },
        }));
      }
    }, [pausedTaskId, tasks, fiveMinuteWarningShown, toast])
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

    const updatedTask = {
      ...tasks[draggableId],
      status: destination.droppableId as 'todo' | 'doing' | 'done',
      isActive: false,
      isPaused: false,
    };

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
      setActiveTaskId(null);
      updateTask(taskId, { isActive: false });
      setFiveMinuteWarningShown(prev => ({ ...prev, [taskId]: false }));
    } else {
      setActiveTaskId(null);
      setPausedTaskId(null);
      resetActiveTimer();
      resetPauseTimer();
      
      Object.keys(tasks).forEach(id => {
        if (id !== taskId) {
          updateTask(id, { isActive: false, isPaused: false });
        }
      });

      setActiveTaskId(taskId);
      updateTask(taskId, { 
        isActive: true, 
        isPaused: false,
        timeSpent: task.timeSpent || 0
      });
      setFiveMinuteWarningShown(prev => ({ ...prev, [taskId]: false }));
    }
  }, [tasks, updateTask, resetActiveTimer, resetPauseTimer]);

  const togglePause = useCallback((taskId: string) => {
    const task = tasks[taskId];
    
    if (task.isPaused) {
      setPausedTaskId(null);
      setActiveTaskId(taskId);
      updateTask(taskId, { isPaused: false });
      resetPauseTimer();
      setFiveMinuteWarningShown(prev => ({ ...prev, [`pause-${taskId}`]: false }));
    } else {
      setActiveTaskId(null);
      setPausedTaskId(taskId);
      updateTask(taskId, { isPaused: true });
      resetActiveTimer();
      setFiveMinuteWarningShown(prev => ({ ...prev, [`pause-${taskId}`]: false }));
    }
  }, [tasks, updateTask, resetActiveTimer, resetPauseTimer]);

  const stopTask = useCallback((taskId: string) => {
    setActiveTaskId(null);
    setPausedTaskId(null);
    updateTask(taskId, { isActive: false, isPaused: false });
    resetActiveTimer();
    resetPauseTimer();
    setFiveMinuteWarningShown(prev => ({ ...prev, [taskId]: false, [`pause-${taskId}`]: false }));
  }, [updateTask, resetActiveTimer, resetPauseTimer]);

  const resetTaskTime = useCallback((taskId: string) => {
    updateTask(taskId, { timeSpent: 0, pauseTime: 0 });
    if (activeTaskId === taskId) {
      resetActiveTimer();
    }
    if (pausedTaskId === taskId) {
      resetPauseTimer();
    }
  }, [updateTask, activeTaskId, pausedTaskId, resetActiveTimer, resetPauseTimer]);

  const deleteTask = useCallback((taskId: string) => {
    setTasks(prev => {
      const newTasks = { ...prev };
      delete newTasks[taskId];
      return newTasks;
    });

    setColumns(prev => {
      const newColumns = { ...prev };
      Object.keys(newColumns).forEach(columnId => {
        newColumns[columnId] = {
          ...newColumns[columnId],
          taskIds: newColumns[columnId].taskIds.filter(id => id !== taskId)
        };
      });
      return newColumns;
    });

    if (activeTaskId === taskId) {
      setActiveTaskId(null);
      resetActiveTimer();
    }
    if (pausedTaskId === taskId) {
      setPausedTaskId(null);
      resetPauseTimer();
    }

    toast({
      title: "Tarefa excluída",
      description: "A tarefa foi removida com sucesso.",
    });
  }, [activeTaskId, pausedTaskId, resetActiveTimer, resetPauseTimer, toast]);

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

  const handleAddToCalendar = (title: string, description: string) => {
    const newId = Date.now().toString();
    const newTask: Task = {
      id: newId,
      title,
      duration: 30,
      pauseDuration: 5,
      timeSpent: 0,
      pauseTime: 0,
      isActive: false,
      isPaused: false,
      status: 'todo',
      createdAt: new Date(),
    };

    setTasks(prev => ({
      ...prev,
      [newId]: newTask,
    }));

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [...prev.todo.taskIds, newId],
      },
    }));

    toast({
      title: "Tarefa adicionada",
      description: "A nota foi convertida em tarefa com sucesso.",
    });
  };

  const handleCalendarTaskCreate = (taskData: { title: string; description?: string; date: Date; time?: string }) => {
    const newId = Date.now().toString();
    const newTask: Task = {
      id: newId,
      title: taskData.title,
      duration: 30,
      pauseDuration: 5,
      timeSpent: 0,
      pauseTime: 0,
      isActive: false,
      isPaused: false,
      status: 'todo',
      createdAt: new Date(),
    };

    setTasks(prev => ({
      ...prev,
      [newId]: newTask,
    }));

    setColumns(prev => ({
      ...prev,
      todo: {
        ...prev.todo,
        taskIds: [...prev.todo.taskIds, newId],
      },
    }));

    toast({
      title: "Tarefa criada",
      description: "Tarefa do calendário adicionada à lista.",
    });
  };

  const renderWidget = (widget: Widget) => {
    switch (widget.component) {
      case 'CalendarBlock':
        return <CalendarBlock onTaskCreate={handleCalendarTaskCreate} />;
      case 'NotesBlock':
        return <NotesBlock onAddToCalendar={handleAddToCalendar} />;
      case 'CalculatorBlock':
        return <CalculatorBlock />;
      case 'EmailBlock':
        return <EmailBlock />;
      case 'AIChat':
        return <AIChat />;
      case 'MindMapBlock':
        return (
          <MindMapBlock
            isExpanded={expandedBlocks[widget.id]}
            onToggleExpand={() => toggleBlockExpansion(widget.id)}
          />
        );
      default:
        return null;
    }
  };

  const completedTasks = Object.values(tasks).filter(task => task.status === 'done');
  const todayStats = {
    total: Object.keys(tasks).length,
    completed: completedTasks.length,
    inProgress: Object.values(tasks).filter(task => task.status === 'doing').length,
    totalTime: completedTasks.reduce((acc, task) => acc + task.timeSpent, 0),
  };

  return (
    <DndProvider backend={HTML5Backend}>
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
              <div className="grid grid-cols-3 gap-4 h-auto">
                {/* Primeira linha - Colunas de tarefas (fixas) */}
                {['todo', 'doing', 'done'].map(columnId => {
                  const column = columns[columnId];
                  const columnTasks = column.taskIds.map(taskId => tasks[taskId]);

                  return (
                    <div key={column.id} className="min-h-[400px]">
                      <TaskColumn
                        column={column}
                        tasks={columnTasks}
                        onUpdateTask={updateTask}
                        onToggleTimer={toggleTimer}
                        onTogglePause={togglePause}
                        onStopTask={stopTask}
                        onResetTime={resetTaskTime}
                        onDeleteTask={deleteTask}
                        onAddTask={addTask}
                      />
                    </div>
                  );
                })}
                
                {/* Widgets arrastáveis */}
                {widgets.map((widget, index) => (
                  <DraggableWidget
                    key={widget.id}
                    id={widget.id}
                    index={index}
                    onMoveWidget={moveWidget}
                    className="min-h-[300px]"
                  >
                    {renderWidget(widget)}
                  </DraggableWidget>
                ))}
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
    </DndProvider>
  );
};
