import { parse } from 'node-html-parser';
import BookView from '@/components/bookView';
import UpdateBookHistory from '@/components/updateCookie'

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

export default async function Page({ params }:{params: Promise<{id: string}>}) {
  const { id } = await params;
  
  const content_response = await fetch(`https://www.gutenberg.org/files/${id}/${id}-0.txt`);
  const content = await content_response.text();
  
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
  
  return (
    <>
      <BookView id={id} content={content} metadata={metadata} />
      <UpdateBookHistory id={id} metadata={metadata} />
    </>
  );
}