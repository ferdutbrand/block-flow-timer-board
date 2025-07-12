
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Calculator, History, Trash2, Maximize2 } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface CalculatorBlockProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: Date;
}

export const CalculatorBlock: React.FC<CalculatorBlockProps> = ({
  isExpanded = false,
  onToggleExpand
}) => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('3fortime-calculator-history');
    if (saved) {
      const items = JSON.parse(saved).map((item: any) => ({
        ...item,
        timestamp: new Date(item.timestamp)
      }));
      setHistory(items);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('3fortime-calculator-history', JSON.stringify(history));
  }, [history]);

  const addToHistory = (expression: string, result: string) => {
    const newItem: HistoryItem = {
      id: Date.now().toString(),
      expression,
      result,
      timestamp: new Date()
    };
    setHistory(prev => [newItem, ...prev.slice(0, 19)]); // Manter apenas 20 itens
  };

  const clearHistory = () => {
    setHistory([]);
  };

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDot = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);
    
    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      let result = currentValue;
      
      switch (operation) {
        case '+':
          result = currentValue + inputValue;
          break;
        case '-':
          result = currentValue - inputValue;
          break;
        case '×':
          result = currentValue * inputValue;
          break;
        case '÷':
          result = inputValue !== 0 ? currentValue / inputValue : 0;
          break;
        case '%':
          result = (currentValue * inputValue) / 100;
          break;
        case '√':
          result = Math.sqrt(inputValue);
          break;
        default:
          return;
      }

      const expression = operation === '√' 
        ? `√${inputValue}` 
        : `${currentValue} ${operation} ${inputValue}`;
      
      addToHistory(expression, result.toString());
      
      setPreviousValue(result);
      setDisplay(result.toString());
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    const inputValue = parseFloat(display);
    
    if (previousValue !== null && operation) {
      performOperation('=');
    }
    
    setOperation(null);
    setPreviousValue(null);
    setWaitingForOperand(true);
  };

  const percentage = () => {
    const inputValue = parseFloat(display);
    setDisplay((inputValue / 100).toString());
  };

  const sqrt = () => {
    const inputValue = parseFloat(display);
    const result = Math.sqrt(inputValue);
    addToHistory(`√${inputValue}`, result.toString());
    setDisplay(result.toString());
    setWaitingForOperand(true);
  };

  const buttons = [
    { label: 'C', onClick: clear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: '√', onClick: sqrt, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '%', onClick: percentage, className: 'bg-blue-500 hover:bg-blue-600 text-white' },
    { label: '÷', onClick: () => performOperation('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '7', onClick: () => inputNumber('7') },
    { label: '8', onClick: () => inputNumber('8') },
    { label: '9', onClick: () => inputNumber('9') },
    { label: '×', onClick: () => performOperation('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '4', onClick: () => inputNumber('4') },
    { label: '5', onClick: () => inputNumber('5') },
    { label: '6', onClick: () => inputNumber('6') },
    { label: '-', onClick: () => performOperation('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '1', onClick: () => inputNumber('1') },
    { label: '2', onClick: () => inputNumber('2') },
    { label: '3', onClick: () => inputNumber('3') },
    { label: '+', onClick: () => performOperation('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    { label: '0', onClick: () => inputNumber('0'), className: 'col-span-2' },
    { label: '.', onClick: inputDot },
    { label: '=', onClick: calculate, className: 'bg-green-500 hover:bg-green-600 text-white' },
  ];

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          <h3 className="font-semibold">Calculadora</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowHistory(!showHistory)}
          >
            <History className="w-4 h-4" />
          </Button>
          
          {onToggleExpand && (
            <Button size="sm" variant="ghost" onClick={onToggleExpand}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Display */}
        <div className="bg-gray-900 text-white p-4 rounded mb-4 text-right">
          <div className="text-2xl font-mono">{display}</div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-4 max-h-32 overflow-auto border rounded p-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">Histórico</span>
              <Button size="sm" variant="ghost" onClick={clearHistory}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <div className="space-y-1">
              {history.map(item => (
                <div key={item.id} className="text-xs flex justify-between">
                  <span>{item.expression}</span>
                  <span className="font-mono">{item.result}</span>
                </div>
              ))}
              {history.length === 0 && (
                <div className="text-xs text-muted-foreground">Nenhum cálculo ainda</div>
              )}
            </div>
          </div>
        )}

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 flex-1">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              className={`h-12 ${button.className || 'bg-gray-200 hover:bg-gray-300 text-black'} ${
                button.label === '0' ? 'col-span-2' : ''
              }`}
              variant="ghost"
            >
              {button.label}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={onToggleExpand}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Calculadora</DialogTitle>
          </DialogHeader>
          <div className="h-[500px]">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
