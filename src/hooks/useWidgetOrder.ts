
import { useState, useEffect } from 'react';

export interface Widget {
  id: string;
  component: string;
  position: number;
}

export const useWidgetOrder = (initialWidgets: Widget[]) => {
  const [widgets, setWidgets] = useState<Widget[]>(() => {
    const saved = localStorage.getItem('3fortime-widget-order');
    if (saved) {
      try {
        const savedWidgets = JSON.parse(saved);
        // Merge saved order with current widgets, ensuring all widgets are present
        const merged = initialWidgets.map(widget => {
          const savedWidget = savedWidgets.find((w: Widget) => w.id === widget.id);
          return savedWidget || widget;
        });
        return merged.sort((a, b) => a.position - b.position);
      } catch {
        return initialWidgets;
      }
    }
    return initialWidgets;
  });

  useEffect(() => {
    localStorage.setItem('3fortime-widget-order', JSON.stringify(widgets));
  }, [widgets]);

  const moveWidget = (dragIndex: number, hoverIndex: number) => {
    setWidgets(prev => {
      const newWidgets = [...prev];
      const draggedWidget = newWidgets[dragIndex];
      
      // Remove the dragged widget
      newWidgets.splice(dragIndex, 1);
      // Insert it at the new position
      newWidgets.splice(hoverIndex, 0, draggedWidget);
      
      // Update positions
      return newWidgets.map((widget, index) => ({
        ...widget,
        position: index
      }));
    });
  };

  return { widgets, moveWidget };
};
