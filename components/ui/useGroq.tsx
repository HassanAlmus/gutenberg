// hooks/useGroq.ts
import { useState } from 'react';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface UseGroqProps {
  initialMessages?: Message[];
  model?: string;
}

export function useGroq({ initialMessages = [], model = "llama-3.3-70b-versatile" }: UseGroqProps = {}) {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (content: string) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add user message to state
      const userMessage: Message = { role: 'user', content };
      const updatedMessages = [...messages, userMessage];
      setMessages(updatedMessages);
      
      // Call the API
      const response = await fetch('/api/groq', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages,
          model,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response');
      }
      
      const data = await response.json();
      const assistantMessage = data.choices[0]?.message;
      
      // Add assistant message to state
      if (assistantMessage) {
        setMessages([...updatedMessages, assistantMessage]);
      }
      
      return assistantMessage;
    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
    } catch (err: any) {
      setError(err.message || 'Something went wrong');
      console.error('Error sending message:', err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    error,
    setMessages,
  };
}