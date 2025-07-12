
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Calculator, History, Trash2, Maximize2, RotateCcw } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { ScrollArea } from './ui/scroll-area';

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
  const [memory, setMemory] = useState(0);

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
    setHistory(prev => [newItem, ...prev.slice(0, 49)]);
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

  const clearAll = () => {
    clear();
    setMemory(0);
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);
    
    if (isNaN(inputValue)) return;
    
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
          if (inputValue === 0) {
            setDisplay('Erro');
            return;
          }
          result = currentValue / inputValue;
          break;
        case '%':
          result = (currentValue * inputValue) / 100;
          break;
        default:
          return;
      }

      const expression = `${currentValue} ${operation} ${inputValue}`;
      addToHistory(expression, result.toString());
      
      setPreviousValue(result);
      setDisplay(parseFloat(result.toFixed(10)).toString());
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = () => {
    if (previousValue !== null && operation) {
      performOperation('=');
      setOperation(null);
      setPreviousValue(null);
      setWaitingForOperand(true);
    }
  };

  const percentage = () => {
    const inputValue = parseFloat(display);
    if (isNaN(inputValue)) return;
    
    const result = inputValue / 100;
    addToHistory(`${inputValue}%`, result.toString());
    setDisplay(result.toString());
    setWaitingForOperand(true);
  };

  const sqrt = () => {
    const inputValue = parseFloat(display);
    if (isNaN(inputValue) || inputValue < 0) {
      setDisplay('Erro');
      return;
    }
    
    const result = Math.sqrt(inputValue);
    addToHistory(`√${inputValue}`, result.toString());
    setDisplay(parseFloat(result.toFixed(10)).toString());
    setWaitingForOperand(true);
  };

  const square = () => {
    const inputValue = parseFloat(display);
    if (isNaN(inputValue)) return;
    
    const result = inputValue * inputValue;
    addToHistory(`${inputValue}²`, result.toString());
    setDisplay(parseFloat(result.toFixed(10)).toString());
    setWaitingForOperand(true);
  };

  const inverse = () => {
    const inputValue = parseFloat(display);
    if (isNaN(inputValue) || inputValue === 0) {
      setDisplay('Erro');
      return;
    }
    
    const result = 1 / inputValue;
    addToHistory(`1/${inputValue}`, result.toString());
    setDisplay(parseFloat(result.toFixed(10)).toString());
    setWaitingForOperand(true);
  };

  const toggleSign = () => {
    if (display !== '0') {
      setDisplay(display.startsWith('-') ? display.slice(1) : '-' + display);
    }
  };

  const memoryAdd = () => {
    const inputValue = parseFloat(display);
    if (!isNaN(inputValue)) {
      setMemory(memory + inputValue);
    }
  };

  const memorySubtract = () => {
    const inputValue = parseFloat(display);
    if (!isNaN(inputValue)) {
      setMemory(memory - inputValue);
    }
  };

  const memoryRecall = () => {
    setDisplay(memory.toString());
    setWaitingForOperand(true);
  };

  const memoryClear = () => {
    setMemory(0);
  };

  const buttons = [
    // Row 1
    { label: 'MC', onClick: memoryClear, className: 'bg-blue-500 hover:bg-blue-600 text-white text-xs' },
    { label: 'MR', onClick: memoryRecall, className: 'bg-blue-500 hover:bg-blue-600 text-white text-xs' },
    { label: 'M+', onClick: memoryAdd, className: 'bg-blue-500 hover:bg-blue-600 text-white text-xs' },
    { label: 'M-', onClick: memorySubtract, className: 'bg-blue-500 hover:bg-blue-600 text-white text-xs' },
    
    // Row 2
    { label: 'C', onClick: clear, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: 'CE', onClick: clearAll, className: 'bg-red-500 hover:bg-red-600 text-white' },
    { label: '⌫', onClick: backspace, className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    { label: '÷', onClick: () => performOperation('÷'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    // Row 3
    { label: '1/x', onClick: inverse, className: 'bg-gray-300 hover:bg-gray-400 text-black text-xs' },
    { label: 'x²', onClick: square, className: 'bg-gray-300 hover:bg-gray-400 text-black text-xs' },
    { label: '√', onClick: sqrt, className: 'bg-gray-300 hover:bg-gray-400 text-black' },
    { label: '×', onClick: () => performOperation('×'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    // Row 4
    { label: '7', onClick: () => inputNumber('7') },
    { label: '8', onClick: () => inputNumber('8') },
    { label: '9', onClick: () => inputNumber('9') },
    { label: '-', onClick: () => performOperation('-'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    // Row 5
    { label: '4', onClick: () => inputNumber('4') },
    { label: '5', onClick: () => inputNumber('5') },
    { label: '6', onClick: () => inputNumber('6') },
    { label: '+', onClick: () => performOperation('+'), className: 'bg-orange-500 hover:bg-orange-600 text-white' },
    
    // Row 6
    { label: '1', onClick: () => inputNumber('1') },
    { label: '2', onClick: () => inputNumber('2') },
    { label: '3', onClick: () => inputNumber('3') },
    { label: '=', onClick: calculate, className: 'bg-green-500 hover:bg-green-600 text-white row-span-2' },
    
    // Row 7
    { label: '±', onClick: toggleSign, className: 'bg-gray-300 hover:bg-gray-400 text-black' },
    { label: '0', onClick: () => inputNumber('0') },
    { label: '.', onClick: inputDot },
  ];

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Calculator className="w-5 h-5" />
          <h3 className="font-semibold">Calculadora</h3>
          {memory !== 0 && (
            <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
              M: {memory}
            </span>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowHistory(!showHistory)}
            className="relative"
          >
            <History className="w-4 h-4" />
            {history.length > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {history.length > 9 ? '9+' : history.length}
              </span>
            )}
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
        <div className="bg-gray-900 text-white p-4 rounded mb-4 text-right min-h-[60px] flex items-end justify-end">
          <div className="text-3xl font-mono break-all">{display}</div>
        </div>

        {/* History Panel */}
        {showHistory && (
          <div className="mb-4 border rounded">
            <div className="flex items-center justify-between p-2 bg-gray-50">
              <span className="text-sm font-medium">Histórico</span>
              <Button size="sm" variant="ghost" onClick={clearHistory}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
            <ScrollArea className="h-32">
              <div className="p-2 space-y-1">
                {history.map(item => (
                  <div key={item.id} className="text-xs flex justify-between hover:bg-gray-100 p-1 rounded cursor-pointer"
                       onClick={() => setDisplay(item.result)}>
                    <span className="text-gray-600">{item.expression}</span>
                    <span className="font-mono font-medium">{item.result}</span>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="text-xs text-muted-foreground text-center py-4">
                    Nenhum cálculo ainda
                  </div>
                )}
              </div>
            </ScrollArea>
          </div>
        )}

        {/* Buttons Grid */}
        <div className="grid grid-cols-4 gap-2 flex-1">
          {buttons.map((button, index) => (
            <Button
              key={index}
              onClick={button.onClick}
              className={`h-12 ${button.className || 'bg-gray-200 hover:bg-gray-300 text-black'} ${
                button.label === '=' ? 'row-span-2' : ''
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
        <DialogContent className="max-w-md max-h-[90vh] w-full">
          <DialogHeader>
            <DialogTitle>Calculadora Avançada</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] overflow-auto">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
