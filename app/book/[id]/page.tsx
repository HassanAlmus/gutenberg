import { parse } from 'node-html-parser'; // Install with: npm install node-html-parser
import { cookies } from 'next/headers';
import BookView from '@/components/bookView';

interface BookHistoryItem {
  id: string;
  title: string | null;
  author: string | null;
  visitedAt: string; // ISO date string
}

export default async function Page({ params }: { params: { id: string } }) {
  const { id } = params;
  
  const content_response = await fetch(`https://www.gutenberg.org/files/${id}/${id}-0.txt`)
  const content = await content_response.text()
  
  const metadata_response = await fetch(`https://www.gutenberg.org/ebooks/${id}`);
  const html = await metadata_response.text();
  const root = parse(html);
  const bibrec = root.querySelector('#bibrec');
  
  if (!bibrec) {
    return <div>Could not find bibliographic information</div>;
  }
  
  const getField = (fieldName: string) => {
    const row = bibrec.querySelectorAll('tr').find(tr => {
      const th = tr.querySelector('th');
      return th && th.text.trim() === fieldName;
    });
    const td = row?.querySelector('td');
    return td?.text.trim() ?? null;
  };
  
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
  
  const metadata: Metadata = {
    title: getField('Title'),
    alternativeTitle: getField('Alternate Title'),
    author: getField('Author')?.replace(/\n/g, '').trim() ?? null,
    editor: getField('Editor')?.replace(/\n/g, '').trim() ?? null,
    illustrator: getField('Illustrator')?.replace(/\n/g, '').trim() ?? null,
    language: getField('Language'),
    releaseDate: getField('Release Date'),
    downloads: getField('Downloads'),
    copyright: getField('Copyright Status'),
    subjects: []
  };
  
  const subjects: string[] = [];
  for (const tr of bibrec.querySelectorAll('tr')) {
    const th = tr.querySelector('th');
    if (th?.text.trim() !== 'Subject') continue;
    const td = tr.querySelector('td');
    if (!td) continue;
    subjects.push(td.text.trim());
  }
  metadata.subjects = subjects;
  
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
  
  // Update the cookie with the new history
  cookieStore.set('book_history', JSON.stringify(bookHistory), {
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: '/',
  });
  
  // Store current book info in separate cookies (for current session use)
  cookieStore.set('current_book_id', id, {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  cookieStore.set('current_book_metadata', JSON.stringify(metadata), {
    maxAge: 60 * 60 * 24 * 7, // 1 week
    path: '/',
  });
  
  return (
    <BookView id={id} content={content} metadata={metadata} />
  );
}
//75485