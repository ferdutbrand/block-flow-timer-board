
import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Bot, Send, User, Maximize2, Loader } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface AIChatProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

export const AIChat: React.FC<AIChatProps> = ({
  isExpanded = false,
  onToggleExpand
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Olá! Sou sua assistente IA. Como posso ajudá-lo hoje?',
      isUser: false,
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [showApiKeyInput, setShowApiKeyInput] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedKey = localStorage.getItem('3fortime-openai-key');
    if (savedKey) {
      setApiKey(savedKey);
      setShowApiKeyInput(false);
    }
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const saveApiKey = () => {
    if (apiKey.trim()) {
      localStorage.setItem('3fortime-openai-key', apiKey);
      setShowApiKeyInput(false);
    }
  };

  const sendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      isUser: true,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Simulação de resposta da IA (substitua por chamada real à API)
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: `Entendi sua mensagem: "${userMessage.text}". Como uma IA simulada, posso ajudá-lo com diversas tarefas. Para uma resposta real, configure uma chave de API válida.`,
          isUser: false,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <h3 className="font-semibold">Chat IA</h3>
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
          >
            Configurar
          </Button>
          
          {onToggleExpand && (
            <Button size="sm" variant="ghost" onClick={onToggleExpand}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {showApiKeyInput && (
        <div className="mb-4 p-3 bg-muted rounded-lg">
          <div className="text-sm font-medium mb-2">Configurar API Key</div>
          <div className="flex gap-2">
            <Input
              type="password"
              placeholder="Cole sua OpenAI API Key aqui"
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
            />
            <Button size="sm" onClick={saveApiKey}>
              Salvar
            </Button>
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            Sua chave será salva localmente e usada para chamadas à API.
          </div>
        </div>
      )}

      <div className="flex-1 overflow-auto mb-4 space-y-3">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex gap-2 ${message.isUser ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex gap-2 max-w-[80%] ${message.isUser ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                {message.isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>
              <div
                className={`p-3 rounded-lg ${
                  message.isUser
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <div className="text-sm">{message.text}</div>
                <div className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex gap-2 justify-start">
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
              <Bot className="w-4 h-4" />
            </div>
            <div className="bg-muted p-3 rounded-lg">
              <Loader className="w-4 h-4 animate-spin" />
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      <div className="flex gap-2">
        <Input
          placeholder="Digite sua mensagem..."
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          disabled={isLoading}
        />
        <Button onClick={sendMessage} disabled={isLoading || !inputMessage.trim()}>
          <Send className="w-4 h-4" />
        </Button>
      </div>
    </div>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={onToggleExpand}>
        <DialogContent className="max-w-4xl max-h-[90vh] w-full">
          <DialogHeader>
            <DialogTitle>Chat IA</DialogTitle>
          </DialogHeader>
          <div className="h-[600px] overflow-hidden">
            {content}
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
