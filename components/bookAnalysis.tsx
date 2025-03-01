"use client";

import { useGroq } from "@/components/ui/useGroq";
import { useEffect, useState } from "react";

interface BookAnalysisProps {
  content: string;
  isOpen: boolean;
}

export default function BookAnalysis({ content, isOpen, }: BookAnalysisProps) {
  const { sendMessage, messages, isLoading } = useGroq();
  const [hasRequested, setHasRequested] = useState(false);

  useEffect(() => {
    if (isOpen && !hasRequested && !isLoading) {
      const prompt = `Analyze this book excerpt and provide a brief sentiment analysis. Focus on the tone, themes, and emotional content. Keep it concise. Here's the text:\n\n${content.substring(0, 4000)}...`;
      sendMessage(prompt);
      setHasRequested(true);
    }
  }, [isOpen, content, hasRequested, isLoading, sendMessage]);

  useEffect(()=>console.log(messages), [messages]);

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-bold">Sentiment Analysis</h2>
      {isLoading ? (
        <div className="animate-pulse">Analyzing content...</div>
      ) : (
        <div className="prose dark:prose-invert">
          {messages[messages.length - 1]?.role === 'assistant' && 
            messages[messages.length - 1].content}
        </div>
      )}
    </div>
  );
} 