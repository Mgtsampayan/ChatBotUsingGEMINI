'use client';

import { useState, useRef, useEffect } from 'react';
import { Message, ChatResponse } from './types/chat';
import { formatErrorMessage } from './lib/utils';
import ChatMessage from './components/ChatMessage';
import ChatInput from './components/ChatInput';
import LoadingDots from './components/LoadingDots';
import ErrorMessage from './components/ErrorMessage';

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    setError(null);
    setIsLoading(true);

    const userMessage: Message = {
      id: crypto.randomUUID(),
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: text }),
      });

      const data = await response.json() as ChatResponse;

      if (!response.ok) {
        throw new Error(data.message || 'Failed to send message');
      }

      const botMessage: Message = {
        id: crypto.randomUUID(),
        text: data.message,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Chat error:', error);
      const errorText = formatErrorMessage(error);

      setError(errorText);

      const botErrorMessage: Message = {
        id: crypto.randomUUID(),
        text: `Error: ${errorText}`,
        sender: 'bot',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botErrorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex flex-col items-center justify-start min-h-screen bg-gray-50 p-4 md:p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">AI Chat Assistant</h1>

      <div className="w-full max-w-3xl bg-white shadow-lg rounded-lg p-4 flex flex-col gap-4">
        {error && <ErrorMessage message={error} />}

        <div className="flex-1 min-h-[400px] max-h-[600px] overflow-y-auto">
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}
          {isLoading && <LoadingDots />}
          <div ref={messagesEndRef} />
        </div>

        <ChatInput
          onSend={handleSendMessage}
          disabled={isLoading}
        />
      </div>
    </main>
  );
}