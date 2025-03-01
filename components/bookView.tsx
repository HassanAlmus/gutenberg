"use client";

import { useState } from "react";
import BookMetadata from "./bookMetadata";
import BookAnalysis from "./bookAnalysis";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { useMediaQuery } from 'react-responsive'

import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "./ui/button";

interface BookViewProps {
  id: string;
  content: string;
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
}

export default function BookView({ id, content, metadata }: BookViewProps) {
  const [metadataOpen, setMetadataOpen] = useState(false);
  const [analysisOpen, setAnalysisOpen] = useState(false);
  const isDesktop = useMediaQuery({query: "(min-width: 768px)"});

  return (
    <div className="flex flex-col md:flex-row h-screen">
      {/* Mobile Metadata Drawer */}
      <Drawer open={metadataOpen} onOpenChange={setMetadataOpen}>
        <DrawerTrigger asChild>
          <button 
            type="button"
            className="md:hidden w-full bg-gray-200 py-2 text-sm font-medium"
          >
            {metadataOpen ? 'Hide Metadata' : 'Show Metadata'}
          </button>
        </DrawerTrigger>
        <DrawerContent>
          <BookMetadata 
            id={id} 
            metadata={metadata} 
            className="p-4 max-h-[80vh] overflow-y-auto"
          />
        </DrawerContent>
      </Drawer>

      {/* Desktop Metadata Sidebar */}
      <BookMetadata 
        id={id} 
        metadata={metadata} 
        className="hidden md:block w-full md:w-1/3 lg:w-1/4 bg-gray-50 p-4 md:p-6 overflow-y-auto md:h-screen md:sticky md:top-0 md:left-0 border-r"
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold md:hidden">
              {metadata.title || 'Untitled Book'}
            </h2>

            <Sheet open={analysisOpen} onOpenChange={setAnalysisOpen}>
              <SheetTrigger>
                <Button className="fixed bottom-6 right-6 w-12 h-12 rounded-full" onClick={()=>setAnalysisOpen(true)}>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <title>AI</title>
                    <path fillRule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clipRule="evenodd" />
                    </svg>
                </Button>
              </SheetTrigger>
            <SheetContent side={isDesktop?"right":"bottom"}>
              <BookAnalysis 
                  content={content}
                  isOpen={analysisOpen}
              />
            </SheetContent>
            </Sheet>
          </div>
          <div className="whitespace-pre-wrap font-mono text-sm">
            {content}
          </div>
        </div>
      </div>
    </div>
  );
}