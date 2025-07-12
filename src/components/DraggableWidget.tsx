
import React from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { GripVertical } from 'lucide-react';

interface DraggableWidgetProps {
  id: string;
  index: number;
  children: React.ReactNode;
  onMoveWidget: (dragIndex: number, hoverIndex: number) => void;
  className?: string;
}

interface DragItem {
  id: string;
  index: number;
  type: string;
}

export const DraggableWidget: React.FC<DraggableWidgetProps> = ({
  id,
  index,
  children,
  onMoveWidget,
  className = ''
}) => {
  const [{ isDragging }, drag, preview] = useDrag({
    type: 'widget',
    item: { id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'widget',
    hover: (item: DragItem) => {
      if (item.index !== index) {
        onMoveWidget(item.index, index);
        item.index = index;
      }
    },
  });

  return (
    <div
      ref={(node) => {
        preview(node);
        drop(node);
      }}
      className={`relative group ${className} ${isDragging ? 'opacity-50' : ''}`}
    >
      <div
        ref={drag}
        className="absolute top-2 left-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity cursor-move p-1 bg-background/80 rounded border"
      >
        <GripVertical className="w-4 h-4 text-muted-foreground" />
      </div>
      {children}
    </div>
  );
};
