// app/api/book-history/route.ts
import { cookies } from 'next/headers';
import { type NextRequest, NextResponse } from 'next/server';

interface BookHistoryItem {
  id: string;
  title: string | null;
  author: string | null;
  visitedAt: string;
}

export async function POST(request: NextRequest) {
  const { id, metadata } = await request.json();
  
  // Get the cookie store
  const cookieStore = await cookies();
  
  // Get current book history from cookies or initialize empty array
  const bookHistoryCookie = cookieStore.get('book_history');
  let bookHistory: BookHistoryItem[] = [];
  
  if (bookHistoryCookie) {
    try {
      bookHistory = JSON.parse(bookHistoryCookie.value);
    } catch (e) {
      // If parsing fails, start with empty history
      bookHistory = [];
    }
  }
  
  // Create a new history item for the current book
  const newHistoryItem: BookHistoryItem = {
    id,
    title: metadata.title,
    author: metadata.author,
    visitedAt: new Date().toISOString()
  };
  
  // Check if this book is already in the history
  const existingBookIndex = bookHistory.findIndex(book => book.id === id);
  
  if (existingBookIndex !== -1) {
    // Remove the existing entry so we can add it to the top (most recent)
    bookHistory.splice(existingBookIndex, 1);
  }
  
  // Add the current book to the beginning of the history array
  bookHistory.unshift(newHistoryItem);
  
  // Limit history to 20 items to avoid cookie size issues
  const MAX_HISTORY_SIZE = 20;
  if (bookHistory.length > MAX_HISTORY_SIZE) {
    bookHistory = bookHistory.slice(0, MAX_HISTORY_SIZE);
  }
  
  const response = NextResponse.json({ success: true });
  
  // Set cookies on the response object
  response.cookies.set('book_history', JSON.stringify(bookHistory), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  response.cookies.set('current_book_id', id, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  response.cookies.set('current_book_metadata', JSON.stringify(metadata), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return response;
}