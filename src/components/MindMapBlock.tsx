import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { X, Plus, Move, Edit3, Maximize2, Minimize2 } from 'lucide-react';
import { toast } from 'sonner';

interface MindMapNode {
  id: string;
  text: string;
  x: number;
  y: number;
  level: number;
  parentId?: string;
  color: string;
}

interface MindMapConnection {
  id: string;
  fromNodeId: string;
  toNodeId: string;
}

interface MindMapBlockProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

const NODE_COLORS = ['#9CA3AF', '#6B7280', '#4B5563', '#374151', '#1F2937'];

export const MindMapBlock: React.FC<MindMapBlockProps> = ({
  isExpanded = false,
  onToggleExpand
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [nodes, setNodes] = useState<MindMapNode[]>([]);
  const [connections, setConnections] = useState<MindMapConnection[]>([]);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [editingNode, setEditingNode] = useState<string | null>(null);
  const [editText, setEditText] = useState('');
  const [draggedNode, setDraggedNode] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [centerTopic, setCenterTopic] = useState('');
  const [showCenterInput, setShowCenterInput] = useState(false);

  const canvasSize = isExpanded 
    ? { width: window.innerWidth - 100, height: window.innerHeight - 100 }
    : { width: 280, height: 200 };

  // Initialize canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
    drawMindMap();
  }, [nodes, connections, canvasSize, selectedNode]);

  // Load saved mind map
  useEffect(() => {
    const savedNodes = localStorage.getItem('3fortime-mindmap-nodes');
    const savedConnections = localStorage.getItem('3fortime-mindmap-connections');
    
    if (savedNodes) {
      setNodes(JSON.parse(savedNodes));
    }
    if (savedConnections) {
      setConnections(JSON.parse(savedConnections));
    }
  }, []);

  // Save mind map
  useEffect(() => {
    localStorage.setItem('3fortime-mindmap-nodes', JSON.stringify(nodes));
    localStorage.setItem('3fortime-mindmap-connections', JSON.stringify(connections));
  }, [nodes, connections]);

  const drawMindMap = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = 'hsl(var(--background))';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw connections
    connections.forEach(connection => {
      const fromNode = nodes.find(n => n.id === connection.fromNodeId);
      const toNode = nodes.find(n => n.id === connection.toNodeId);
      
      if (fromNode && toNode) {
        ctx.strokeStyle = 'hsl(var(--border))';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(fromNode.x, fromNode.y);
        ctx.lineTo(toNode.x, toNode.y);
        ctx.stroke();
      }
    });

    // Draw nodes
    nodes.forEach(node => {
      const isSelected = selectedNode === node.id;
      const nodeRadius = node.level === 0 ? 40 : 30;
      
      // Node background
      ctx.fillStyle = node.color;
      ctx.beginPath();
      ctx.arc(node.x, node.y, nodeRadius, 0, 2 * Math.PI);
      ctx.fill();
      
      // Node border
      if (isSelected) {
        ctx.strokeStyle = 'hsl(var(--primary))';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = 'hsl(var(--border))';
        ctx.lineWidth = 1;
      }
      ctx.stroke();

      // Node text
      ctx.fillStyle = 'hsl(var(--foreground))';
      ctx.font = node.level === 0 ? 'bold 14px sans-serif' : '12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      
      // Wrap text
      const maxWidth = nodeRadius * 1.5;
      const words = node.text.split(' ');
      const lines: string[] = [];
      let currentLine = '';
      
      words.forEach(word => {
        const testLine = currentLine ? `${currentLine} ${word}` : word;
        const metrics = ctx.measureText(testLine);
        
        if (metrics.width > maxWidth && currentLine) {
          lines.push(currentLine);
          currentLine = word;
        } else {
          currentLine = testLine;
        }
      });
      if (currentLine) lines.push(currentLine);
      
      const lineHeight = 14;
      const startY = node.y - (lines.length - 1) * lineHeight / 2;
      
      lines.forEach((line, index) => {
        ctx.fillText(line, node.x, startY + index * lineHeight);
      });
    });
  }, [nodes, connections, selectedNode]);

  const getMousePos = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
  };

  const getNodeAtPosition = (x: number, y: number): MindMapNode | null => {
    return nodes.find(node => {
      const distance = Math.sqrt((node.x - x) ** 2 + (node.y - y) ** 2);
      const radius = node.level === 0 ? 40 : 30;
      return distance <= radius;
    }) || null;
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    const clickedNode = getNodeAtPosition(x, y);
    
    if (clickedNode) {
      setSelectedNode(clickedNode.id);
    } else {
      setSelectedNode(null);
    }
  };

  const handleCanvasDoubleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    const clickedNode = getNodeAtPosition(x, y);
    
    if (clickedNode) {
      setEditingNode(clickedNode.id);
      setEditText(clickedNode.text);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const { x, y } = getMousePos(e);
    const clickedNode = getNodeAtPosition(x, y);
    
    if (clickedNode) {
      setDraggedNode(clickedNode.id);
      setDragOffset({
        x: x - clickedNode.x,
        y: y - clickedNode.y
      });
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!draggedNode) return;
    
    const { x, y } = getMousePos(e);
    const newX = x - dragOffset.x;
    const newY = y - dragOffset.y;
    
    setNodes(prev => prev.map(node => 
      node.id === draggedNode 
        ? { ...node, x: newX, y: newY }
        : node
    ));
  };

  const handleMouseUp = () => {
    setDraggedNode(null);
  };

  const createCenterNode = () => {
    if (!centerTopic.trim()) return;
    
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: centerTopic,
      x: canvasSize.width / 2,
      y: canvasSize.height / 2,
      level: 0,
      color: NODE_COLORS[0]
    };
    
    setNodes([newNode]);
    setCenterTopic('');
    setShowCenterInput(false);
    toast.success('Tema central criado!');
  };

  const addBranch = () => {
    if (!selectedNode) {
      toast.error('Selecione um nó primeiro');
      return;
    }
    
    const parentNode = nodes.find(n => n.id === selectedNode);
    if (!parentNode) return;
    
    const angle = Math.random() * 2 * Math.PI;
    const distance = 120;
    const newX = parentNode.x + Math.cos(angle) * distance;
    const newY = parentNode.y + Math.sin(angle) * distance;
    
    const newLevel = parentNode.level + 1;
    const newNode: MindMapNode = {
      id: Date.now().toString(),
      text: 'Nova ideia',
      x: Math.max(30, Math.min(canvasSize.width - 30, newX)),
      y: Math.max(30, Math.min(canvasSize.height - 30, newY)),
      level: newLevel,
      parentId: selectedNode,
      color: NODE_COLORS[Math.min(newLevel, NODE_COLORS.length - 1)]
    };
    
    const newConnection: MindMapConnection = {
      id: `${selectedNode}-${newNode.id}`,
      fromNodeId: selectedNode,
      toNodeId: newNode.id
    };
    
    setNodes(prev => [...prev, newNode]);
    setConnections(prev => [...prev, newConnection]);
    setSelectedNode(newNode.id);
    toast.success('Ramificação adicionada!');
  };

  const deleteSelectedNode = () => {
    if (!selectedNode) return;
    
    const nodeToDelete = nodes.find(n => n.id === selectedNode);
    if (nodeToDelete?.level === 0) {
      toast.error('Não é possível excluir o tema central');
      return;
    }
    
    // Remove node and its connections
    setNodes(prev => prev.filter(n => n.id !== selectedNode));
    setConnections(prev => prev.filter(c => 
      c.fromNodeId !== selectedNode && c.toNodeId !== selectedNode
    ));
    setSelectedNode(null);
    toast.success('Nó removido!');
  };

  const saveEditText = () => {
    if (!editingNode || !editText.trim()) return;
    
    setNodes(prev => prev.map(node => 
      node.id === editingNode 
        ? { ...node, text: editText.trim() }
        : node
    ));
    setEditingNode(null);
    setEditText('');
  };

  const clearMindMap = () => {
    setNodes([]);
    setConnections([]);
    setSelectedNode(null);
    toast.success('Mapa mental limpo!');
  };

  if (nodes.length === 0 && !showCenterInput) {
    return (
      <Card className="p-4 h-full flex flex-col justify-center items-center">
        <div className="text-center mb-4">
          <h3 className="font-semibold mb-2">Mapa Mental</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Crie seu primeiro mapa mental
          </p>
          <Button onClick={() => setShowCenterInput(true)} className="mb-2">
            <Plus className="w-4 h-4 mr-2" />
            Criar Tema Central
          </Button>
        </div>
        {onToggleExpand && (
          <Button
            variant="outline"
            size="sm"
            onClick={onToggleExpand}
            className="mt-2"
          >
            <Maximize2 className="w-4 h-4" />
          </Button>
        )}
      </Card>
    );
  }

  return (
    <Card className={`p-4 h-full ${isExpanded ? 'fixed inset-4 z-50 bg-background' : ''}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold">Mapa Mental</h3>
        <div className="flex gap-2">
          {selectedNode && (
            <>
              <Button size="sm" variant="outline" onClick={addBranch}>
                <Plus className="w-4 h-4" />
              </Button>
              <Button size="sm" variant="outline" onClick={deleteSelectedNode}>
                <X className="w-4 h-4" />
              </Button>
            </>
          )}
          <Button size="sm" variant="outline" onClick={clearMindMap}>
            Limpar
          </Button>
          {onToggleExpand && (
            <Button size="sm" variant="outline" onClick={onToggleExpand}>
              {isExpanded ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
            </Button>
          )}
        </div>
      </div>

      {showCenterInput && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Digite o tema central..."
            value={centerTopic}
            onChange={(e) => setCenterTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && createCenterNode()}
          />
          <Button onClick={createCenterNode}>Criar</Button>
          <Button variant="outline" onClick={() => setShowCenterInput(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      {editingNode && (
        <div className="mb-4 flex gap-2">
          <Input
            placeholder="Editar texto..."
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && saveEditText()}
            autoFocus
          />
          <Button onClick={saveEditText}>Salvar</Button>
          <Button variant="outline" onClick={() => setEditingNode(null)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      )}

      <div className="flex-1 overflow-hidden">
        <canvas
          ref={canvasRef}
          className="border border-border rounded cursor-pointer"
          onClick={handleCanvasClick}
          onDoubleClick={handleCanvasDoubleClick}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        />
      </div>

      {selectedNode && (
        <div className="mt-2 text-xs text-muted-foreground">
          Nó selecionado • Duplo clique para editar • Arraste para mover
        </div>
      )}
    </Card>
  );
};