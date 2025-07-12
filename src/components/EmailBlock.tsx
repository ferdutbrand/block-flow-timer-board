
import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Mail, MailOpen, Star, Archive, Trash2, Maximize2, RefreshCw } from 'lucide-react';

interface EmailBlockProps {
  isExpanded?: boolean;
  onToggleExpand?: () => void;
}

interface Email {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
  isStarred: boolean;
  isImportant: boolean;
}

export const EmailBlock: React.FC<EmailBlockProps> = ({
  isExpanded = false,
  onToggleExpand
}) => {
  const [emails, setEmails] = useState<Email[]>([]);
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [loading, setLoading] = useState(false);

  // Simular dados de email (em um cenário real, isso viria de uma API)
  const generateMockEmails = (): Email[] => {
    const mockSenders = [
      'joao@empresa.com',
      'maria@cliente.com',
      'suporte@plataforma.com',
      'noticias@portal.com',
      'vendas@loja.com'
    ];
    
    const mockSubjects = [
      'Reunião de projeto - Amanhã às 14h',
      'Proposta comercial - Análise urgente',
      'Atualização do sistema - Manutenção programada',
      'Newsletter semanal - Novidades',
      'Fatura vencimento próximo'
    ];

    const mockContents = [
      'Olá! Gostaria de confirmar nossa reunião marcada para amanhã às 14h. Por favor, confirme sua presença.',
      'Segue em anexo nossa proposta comercial para análise. Aguardo retorno até sexta-feira.',
      'Informamos que será realizada manutenção no sistema no próximo domingo das 2h às 6h.',
      'Confira as principais novidades desta semana em nosso portal de notícias.',
      'Lembramos que sua fatura vence em 3 dias. Clique aqui para pagar online.'
    ];

    return Array.from({ length: 8 }, (_, i) => ({
      id: `email-${i + 1}`,
      sender: mockSenders[i % mockSenders.length],
      subject: mockSubjects[i % mockSubjects.length],
      preview: mockContents[i % mockContents.length].substring(0, 60) + '...',
      content: mockContents[i % mockContents.length],
      timestamp: new Date(Date.now() - (i * 2 * 60 * 60 * 1000)), // 2 horas entre cada email
      isRead: i > 2, // Primeiros 3 não lidos
      isStarred: i % 3 === 0,
      isImportant: i < 2
    }));
  };

  useEffect(() => {
    const saved = localStorage.getItem('3fortime-emails');
    if (saved) {
      const savedEmails = JSON.parse(saved).map((email: any) => ({
        ...email,
        timestamp: new Date(email.timestamp)
      }));
      setEmails(savedEmails);
    } else {
      const mockEmails = generateMockEmails();
      setEmails(mockEmails);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('3fortime-emails', JSON.stringify(emails));
  }, [emails]);

  const refreshEmails = () => {
    setLoading(true);
    setTimeout(() => {
      // Simular atualização adicionando um novo email
      const newEmail: Email = {
        id: `email-${Date.now()}`,
        sender: 'novo@contato.com',
        subject: 'Nova mensagem recebida',
        preview: 'Esta é uma nova mensagem que acabou de chegar...',
        content: 'Esta é uma nova mensagem que acabou de chegar. Conteúdo completo da mensagem aqui.',
        timestamp: new Date(),
        isRead: false,
        isStarred: false,
        isImportant: true
      };
      setEmails(prev => [newEmail, ...prev]);
      setLoading(false);
    }, 1000);
  };

  const markAsRead = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isRead: true } : email
    ));
  };

  const toggleStar = (emailId: string) => {
    setEmails(prev => prev.map(email => 
      email.id === emailId ? { ...email, isStarred: !email.isStarred } : email
    ));
  };

  const deleteEmail = (emailId: string) => {
    setEmails(prev => prev.filter(email => email.id !== emailId));
    if (selectedEmail?.id === emailId) {
      setSelectedEmail(null);
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    
    if (hours < 1) return 'Agora';
    if (hours < 24) return `${hours}h`;
    return date.toLocaleDateString('pt-BR');
  };

  const unreadCount = emails.filter(email => !email.isRead).length;

  const content = (
    <div className="bg-card p-4 rounded-lg border h-full flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Mail className="w-5 h-5" />
          <h3 className="font-semibold">Email</h3>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount}
            </Badge>
          )}
        </div>
        
        <div className="flex gap-2">
          <Button 
            size="sm" 
            variant="ghost" 
            onClick={refreshEmails}
            disabled={loading}
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </Button>
          
          {onToggleExpand && (
            <Button size="sm" variant="ghost" onClick={onToggleExpand}>
              <Maximize2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        <div className="space-y-2">
          {emails.map(email => (
            <div 
              key={email.id}
              className={`p-3 rounded border cursor-pointer transition-colors ${
                !email.isRead ? 'bg-blue-50 border-blue-200' : 'hover:bg-muted/50'
              } ${selectedEmail?.id === email.id ? 'ring-2 ring-primary' : ''}`}
              onClick={() => {
                setSelectedEmail(email);
                markAsRead(email.id);
              }}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className={`text-sm ${!email.isRead ? 'font-semibold' : ''}`}>
                      {email.sender}
                    </span>
                    {email.isImportant && (
                      <Badge variant="destructive" className="text-xs">Importante</Badge>
                    )}
                  </div>
                  <div className={`text-sm mb-1 ${!email.isRead ? 'font-medium' : ''}`}>
                    {email.subject}
                  </div>
                  <div className="text-xs text-muted-foreground truncate">
                    {email.preview}
                  </div>
                </div>
                
                <div className="flex items-center gap-1 ml-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleStar(email.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Star className={`w-3 h-3 ${email.isStarred ? 'fill-yellow-400 text-yellow-400' : ''}`} />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteEmail(email.id);
                    }}
                    className="h-6 w-6 p-0"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                  <span className="text-xs text-muted-foreground">
                    {formatTime(email.timestamp)}
                  </span>
                </div>
              </div>
            </div>
          ))}
          
          {emails.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <Mail className="w-12 h-12 mx-auto mb-2 opacity-50" />
              <p>Nenhum email</p>
            </div>
          )}
        </div>
      </div>

      {/* Email Preview */}
      {selectedEmail && !isExpanded && (
        <div className="mt-4 pt-4 border-t">
          <div className="text-sm">
            <div className="font-medium mb-1">{selectedEmail.subject}</div>
            <div className="text-muted-foreground text-xs mb-2">
              De: {selectedEmail.sender}
            </div>
            <div className="text-xs">{selectedEmail.content}</div>
          </div>
        </div>
      )}
    </div>
  );

  if (isExpanded) {
    return (
      <Dialog open={isExpanded} onOpenChange={onToggleExpand}>
        <DialogContent className="max-w-4xl h-[80vh]">
          <DialogHeader>
            <DialogTitle>Email</DialogTitle>
          </DialogHeader>
          <div className="h-full overflow-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              <div>
                {content}
              </div>
              {selectedEmail && (
                <div className="bg-card p-4 rounded-lg border">
                  <div className="mb-4">
                    <h4 className="font-semibold">{selectedEmail.subject}</h4>
                    <div className="text-sm text-muted-foreground">
                      De: {selectedEmail.sender}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {selectedEmail.timestamp.toLocaleString('pt-BR')}
                    </div>
                  </div>
                  <div className="text-sm">
                    {selectedEmail.content}
                  </div>
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return content;
};
