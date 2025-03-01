"use client";
import { useState } from 'react';

const BookLookup = () => {
  const [bookId, setBookId] = useState('');
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setBookId(e.target.value);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <main className="w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
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
          
          <a
            className="w-full flex items-center justify-center gap-2 bg-black dark:bg-white text-white dark:text-black font-medium rounded-full py-3 px-4 transition-colors hover:bg-gray-800 dark:hover:bg-gray-200"
            href={bookId ? `https://vercel.com/book?id=${bookId}` : "https://vercel.com/new?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"}
            target="_blank"
            rel="noopener noreferrer"
          >
            View the book
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
              <title>Arrow right</title>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
            </svg>
          </a>
        </div>
      </main>
      
    </div>
  );
};

export default BookLookup;