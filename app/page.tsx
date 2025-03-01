"use client";
import { useState, useEffect } from 'react';
import Link from 'next/link';

interface BookHistoryItem {
  id: string;
  title: string | null;
  author: string | null;
  visitedAt: string; // ISO date string
}

const BookLookup = () => {
  const [bookId, setBookId] = useState('');
  const [bookHistory, setBookHistory] = useState<BookHistoryItem[]>([]);

  // Get book history from cookies on component mount
  useEffect(() => {
    const bookHistoryCookie = document.cookie
      .split('; ')
      .find(row => row.startsWith('book_history='));
    
    if (bookHistoryCookie) {
      try {
        const historyValue = bookHistoryCookie.split('=')[1];
        const decodedValue = decodeURIComponent(historyValue);
        const parsedHistory = JSON.parse(decodedValue);
        setBookHistory(parsedHistory);
      } catch (e) {
        console.error('Failed to parse book history:', e);
      }
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookId(e.target.value);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()}`;
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gray-50 dark:bg-gray-900 p-4">
      {/* Added pt-16 for more space on top on desktop screens */}
      <main className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8 md:mt-16 lg:mt-24">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-800 dark:text-gray-100">
          Get started by typing in the book ID
        </h1>
        <div className="flex flex-col items-center justify-center space-y-4">
          <input
            type="text"
            value={bookId}
            onChange={handleInputChange}
            placeholder="Enter book ID..."
            className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
          />
          <Link
            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full py-3 px-4 transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
            href={bookId ? `/book/${bookId}` : "#"}
          >
            View the book
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <title>Arrow right</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </Link>
        </div>
      </main>

      {bookHistory.length > 0 && (
        <div className="w-full max-w-3xl bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mt-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-100">
            Your Reading History
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-700">
                  <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Title</th>
                  <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Author</th>
                  <th className="px-4 py-2 text-left text-gray-800 dark:text-gray-200">Last Visited</th>
                </tr>
              </thead>
              <tbody>
                {bookHistory.map((book) => (
                  <tr 
                    key={book.id} 
                    className="border-t border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <td className="px-4 py-3">
                      <Link 
                        href={`/book/${book.id}`}
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {book.title || `Book #${book.id}`}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {book.author || 'Unknown'}
                    </td>
                    <td className="px-4 py-3 text-gray-700 dark:text-gray-300">
                      {formatDate(book.visitedAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BookLookup;