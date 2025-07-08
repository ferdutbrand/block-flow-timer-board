
import React from 'react';
import { Clock, Target, CheckCircle } from 'lucide-react';

interface CompactStatsProps {
  stats: {
    total: number;
    completed: number;
    inProgress: number;
    totalTime: number;
  };
}

export const CompactStats: React.FC<CompactStatsProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-4 gap-2 p-3 bg-muted/30 rounded-lg">
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Target className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{stats.total}</span>
        </div>
        <p className="text-xs text-muted-foreground">Total</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{stats.inProgress}</span>
        </div>
        <p className="text-xs text-muted-foreground">Ativo</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <CheckCircle className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">{stats.completed}</span>
        </div>
        <p className="text-xs text-muted-foreground">Feito</p>
      </div>
      
      <div className="text-center">
        <div className="flex items-center justify-center gap-1">
          <Clock className="w-3 h-3 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            {Math.floor(stats.totalTime / 3600)}h{Math.floor((stats.totalTime % 3600) / 60)}m
          </span>
        </div>
        <p className="text-xs text-muted-foreground">Tempo</p>
      </div>
    </div>
  );
};
