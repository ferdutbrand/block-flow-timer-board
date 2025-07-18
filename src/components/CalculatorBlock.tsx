import React, { useState } from 'react';
import { Button } from './ui/button';

export const CalculatorBlock: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForNewValue, setWaitingForNewValue] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForNewValue) {
      setDisplay(num);
      setWaitingForNewValue(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForNewValue) {
      setDisplay('0,');
      setWaitingForNewValue(false);
    } else if (display.indexOf(',') === -1) {
      setDisplay(display + ',');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForNewValue(false);
  };

  const clearEntry = () => {
    setDisplay('0');
  };

  const backspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display.replace(',', '.'));

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      setDisplay(String(newValue).replace('.', ','));
      setPreviousValue(newValue);
    }

    setWaitingForNewValue(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string) => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '−':
        return firstValue - secondValue;
      case '×':
        return firstValue * secondValue;
      case '÷':
        return secondValue !== 0 ? firstValue / secondValue : 0;
      case '=':
        return secondValue;
      default:
        return secondValue;
    }
  };

  const handleEquals = () => {
    const inputValue = parseFloat(display.replace(',', '.'));

    if (previousValue !== null && operation) {
      const newValue = calculate(previousValue, inputValue, operation);
      setDisplay(String(newValue).replace('.', ','));
      setPreviousValue(null);
      setOperation(null);
      setWaitingForNewValue(true);
    }
  };

  const handlePercentage = () => {
    const value = parseFloat(display.replace(',', '.'));
    setDisplay(String(value / 100).replace('.', ','));
  };

  const handleNegate = () => {
    const value = parseFloat(display.replace(',', '.'));
    if (value !== 0) {
      setDisplay(String(-value).replace('.', ','));
    }
  };

  const handleSquareRoot = () => {
    const value = parseFloat(display.replace(',', '.'));
    if (value >= 0) {
      setDisplay(String(Math.sqrt(value)).replace('.', ','));
      setWaitingForNewValue(true);
    }
  };

  const handleSquare = () => {
    const value = parseFloat(display.replace(',', '.'));
    setDisplay(String(value * value).replace('.', ','));
    setWaitingForNewValue(true);
  };

  const handleFraction = () => {
    const value = parseFloat(display.replace(',', '.'));
    if (value !== 0) {
      setDisplay(String(1 / value).replace('.', ','));
      setWaitingForNewValue(true);
    }
  };

  const CalcButton = ({ children, onClick, variant = 'number', className = '' }: {
    children: React.ReactNode;
    onClick: () => void;
    variant?: 'number' | 'operation' | 'function' | 'equals';
    className?: string;
  }) => {
    const variantClasses = {
      number: 'bg-background hover:bg-muted text-foreground border-border',
      operation: 'bg-primary hover:bg-primary/90 text-primary-foreground',
      function: 'bg-muted hover:bg-muted/80 text-muted-foreground border-border',
      equals: 'bg-primary hover:bg-primary/90 text-primary-foreground'
    };

    return (
      <Button
        className={`h-10 text-sm font-normal border transition-all duration-150 hover:scale-105 active:scale-95 ${variantClasses[variant]} ${className}`}
        onClick={onClick}
        variant="outline"
      >
        {children}
      </Button>
    );
  };

  return (
    <div className="p-3 space-y-3 h-full flex flex-col">
      {/* Display */}
      <div className="bg-card border rounded-md p-3 text-right min-h-[3rem] flex items-center justify-end">
        <div className="text-2xl font-mono text-foreground overflow-hidden">
          {display}
        </div>
      </div>

      {/* Button Grid - Windows Calculator Style */}
      <div className="grid grid-cols-4 gap-1 flex-1">
        {/* Row 1: Memory and Functions */}
        <CalcButton variant="function" onClick={handlePercentage}>
          %
        </CalcButton>
        <CalcButton variant="function" onClick={clearEntry}>
          CE
        </CalcButton>
        <CalcButton variant="function" onClick={clear}>
          C
        </CalcButton>
        <CalcButton variant="function" onClick={backspace}>
          ⌫
        </CalcButton>

        {/* Row 2: Advanced Functions */}
        <CalcButton variant="function" onClick={handleFraction}>
          1/x
        </CalcButton>
        <CalcButton variant="function" onClick={handleSquare}>
          x²
        </CalcButton>
        <CalcButton variant="function" onClick={handleSquareRoot}>
          √x
        </CalcButton>
        <CalcButton variant="operation" onClick={() => performOperation('÷')}>
          ÷
        </CalcButton>

        {/* Row 3 */}
        <CalcButton variant="number" onClick={() => inputNumber('7')}>
          7
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('8')}>
          8
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('9')}>
          9
        </CalcButton>
        <CalcButton variant="operation" onClick={() => performOperation('×')}>
          ×
        </CalcButton>

        {/* Row 4 */}
        <CalcButton variant="number" onClick={() => inputNumber('4')}>
          4
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('5')}>
          5
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('6')}>
          6
        </CalcButton>
        <CalcButton variant="operation" onClick={() => performOperation('−')}>
          −
        </CalcButton>

        {/* Row 5 */}
        <CalcButton variant="number" onClick={() => inputNumber('1')}>
          1
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('2')}>
          2
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('3')}>
          3
        </CalcButton>
        <CalcButton variant="operation" onClick={() => performOperation('+')}>
          +
        </CalcButton>

        {/* Row 6 */}
        <CalcButton variant="function" onClick={handleNegate}>
          +/−
        </CalcButton>
        <CalcButton variant="number" onClick={() => inputNumber('0')}>
          0
        </CalcButton>
        <CalcButton variant="number" onClick={inputDecimal}>
          ,
        </CalcButton>
        <CalcButton variant="equals" onClick={handleEquals}>
          =
        </CalcButton>
      </div>
    </div>
  );
};