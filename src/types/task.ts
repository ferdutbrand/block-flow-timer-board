
export interface Task {
  id: string;
  title: string;
  duration: 30 | 45 | 60; // minutos
  pauseDuration: 5 | 15 | 30; // minutos
  timeSpent: number; // segundos
  pauseTime: number; // segundos
  isActive: boolean;
  isPaused: boolean;
  status: 'todo' | 'doing' | 'done';
  createdAt: Date;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}
