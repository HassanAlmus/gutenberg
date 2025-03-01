"use client";

interface BookMetadataProps {
  id: string;
  metadata: {
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
  };
  className?: string;
}

export default function BookMetadata({ id, metadata, className = '' }: BookMetadataProps) {
  return (
    <div className={className}>
      <h1 className="text-xl md:text-2xl font-bold mb-3 line-clamp-2">
        {metadata.title || 'Untitled Book'}
      </h1>
      
      {metadata.alternativeTitle && (
        <p className="text-gray-600 italic mb-4 text-sm">
          Also known as: {metadata.alternativeTitle}
        </p>
      )}
      
      <div className="space-y-4">
        {metadata.author && (
          <div>
            <h3 className="font-semibold text-gray-700">Author</h3>
            <p>{metadata.author}</p>
          </div>
        )}
        
        {metadata.editor && (
          <div>
            <h3 className="font-semibold text-gray-700">Editor</h3>
            <p>{metadata.editor}</p>
          </div>
        )}
        
        {metadata.illustrator && (
          <div>
            <h3 className="font-semibold text-gray-700">Illustrator</h3>
            <p>{metadata.illustrator}</p>
          </div>
        )}
        
        {metadata.language && (
          <div>
            <h3 className="font-semibold text-gray-700">Language</h3>
            <p>{metadata.language}</p>
          </div>
        )}
        
        {metadata.releaseDate && (
          <div>
            <h3 className="font-semibold text-gray-700">Release Date</h3>
            <p>{metadata.releaseDate}</p>
          </div>
        )}
        
        {metadata.copyright && (
          <div>
            <h3 className="font-semibold text-gray-700">Copyright</h3>
            <p>{metadata.copyright}</p>
          </div>
        )}
        
        {metadata.downloads && (
          <div>
            <h3 className="font-semibold text-gray-700">Downloads</h3>
            <p>{metadata.downloads}</p>
          </div>
        )}
      </div>
      
      {metadata.subjects && metadata.subjects.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold text-gray-700 mb-2">Subjects</h3>
          <div className="flex flex-wrap gap-2">
            {metadata.subjects.map((subject) => (
              <span 
                key={subject} 
                className="bg-gray-200 text-gray-800 text-xs px-2 py-1 rounded"
              >
                {subject}
              </span>
            ))}
          </div>
        </div>
      )}
      
      <div className="mt-6 pt-4 border-t text-xs text-gray-500">
        <p>Project Gutenberg eBook #{id}</p>
        <p className="mt-1">This eBook is for the use of anyone anywhere in the United States and most other parts of the world at no cost.</p>
      </div>
    </div>
  );
} 