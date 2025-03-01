'use client';

import { useEffect } from 'react';

interface Metadata {
    title: string | null;
    alternativeTitle: string | null;
    author: string | null;
    editor: string | null;
    illustrator: string | null;
    language: string | null;
    releaseDate: string | null;
    downloads: string | null;
    copyright: string | null;
    subjects: string[];
  }

export default function UpdateBookHistory({ id, metadata}: {id: string, metadata: Metadata}) {
  useEffect(() => {
    const updateHistory = async () => {
      try {
        await fetch('/api/book-history', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id, metadata }),
        });
      } catch (error) {
        console.error('Failed to update book history:', error);
      }
    };
    
    updateHistory();
  }, [id, metadata]);
  
  return null; // This component doesn't render anything
}