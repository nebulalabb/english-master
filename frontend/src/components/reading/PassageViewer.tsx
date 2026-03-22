'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Volume2, Bookmark, Share2, Type, Maximize2, X, Sparkles, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import axios from 'axios';

interface PassageViewerProps {
  content: string;
}

const PassageViewer: React.FC<PassageViewerProps> = ({ content }) => {
  const [fontSize, setFontSize] = useState(18);
  const [selectedWord, setSelectedWord] = useState<string | null>(null);
  const [definition, setDefinition] = useState<any>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [popupPos, setPopupPos] = useState({ x: 0, y: 0 });
  
  const containerRef = useRef<HTMLDivElement>(null);

  const handleWordClick = async (event: React.MouseEvent) => {
    const selection = window.getSelection();
    const word = selection?.toString().trim();

    if (word && word.length > 1 && /^[a-zA-Z]+$/.test(word)) {
      setSelectedWord(word);
      setPopupPos({ x: event.clientX, y: event.clientY });
      
      try {
        setIsSearching(true);
        const response = await axios.get(`https://api.dictionaryapi.dev/api/v2/entries/en/${word.toLowerCase()}`);
        setDefinition(response.data[0]);
      } catch (err) {
        setDefinition(null);
      } finally {
        setIsSearching(false);
      }
    } else {
      setSelectedWord(null);
    }
  };

  const playPronunciation = () => {
    if (definition?.phonetics?.[0]?.audio) {
      new Audio(definition.phonetics[0].audio).play();
    } else {
      const auth = new SpeechSynthesisUtterance(selectedWord!);
      auth.lang = 'en-US';
      window.speechSynthesis.speak(auth);
    }
  };

  const addToVocab = async () => {
    // Logic to add to user's vocab list
    alert(`Đã thêm "${selectedWord}" vào danh sách từ vựng!`);
  };

  return (
    <div className="space-y-6 relative" ref={containerRef}>
      <div className="flex items-center justify-between border-b border-border/40 pb-4">
         <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => setFontSize(Math.max(14, fontSize - 2))}>
               <Type className="h-3 w-3" />
            </Button>
            <span className="text-[10px] font-black uppercase text-muted-foreground">{fontSize}px</span>
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0" onClick={() => setFontSize(Math.min(24, fontSize + 2))}>
               <Type className="h-4 w-4" />
            </Button>
         </div>
         <div className="flex gap-2">
            <Badge variant="outline" className="rounded-full border-primary/20 text-primary uppercase text-[10px]">Tiêu chuẩn</Badge>
            <Badge variant="outline" className="rounded-full border-border text-muted-foreground uppercase text-[10px]">Tối giản</Badge>
         </div>
      </div>

      <div 
        className="prose prose-slate max-w-none leading-relaxed select-text cursor-pointer selection:bg-primary/20"
        style={{ fontSize: `${fontSize}px` }}
        onMouseUp={handleWordClick}
      >
        {content}
      </div>

      <AnimatePresence>
        {selectedWord && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 10 }}
            className="fixed z-50 w-72 bg-card border border-border/60 shadow-2xl rounded-3xl overflow-hidden backdrop-blur-xl"
            style={{ 
              top: Math.min(window.innerHeight - 300, popupPos.y + 10), 
              left: Math.min(window.innerWidth - 300, popupPos.x - 30) 
            }}
          >
            <div className="p-6 space-y-4">
              <div className="flex justify-between items-start">
                 <div>
                    <h4 className="text-2xl font-black text-primary">{selectedWord}</h4>
                    {definition?.phonetic && <p className="text-xs font-medium text-muted-foreground italic">{definition.phonetic}</p>}
                 </div>
                 <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={() => setSelectedWord(null)}>
                    <X className="h-4 w-4" />
                 </Button>
              </div>

              {isSearching ? (
                <div className="py-4 flex justify-center">
                   <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                </div>
              ) : definition ? (
                <div className="space-y-3">
                   <div className="text-xs font-black uppercase tracking-widest text-primary/40 flex items-center gap-1">
                      <Languages className="h-3 w-3" /> Nghĩa của từ
                   </div>
                   <p className="text-sm font-medium leading-relaxed line-clamp-3">
                      {definition.meanings[0].definitions[0].definition}
                   </p>
                   <div className="flex gap-2 pt-2">
                      <Button size="sm" className="flex-1 rounded-xl h-9 gap-1.5 font-bold" onClick={playPronunciation}>
                         <Volume2 className="h-3.5 w-3.5" /> Nghe
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1 rounded-xl h-9 gap-1.5 font-bold border-primary/20 text-primary" onClick={addToVocab}>
                         <Bookmark className="h-3.5 w-3.5" /> Lưu từ
                      </Button>
                   </div>
                </div>
              ) : (
                <div className="py-2 text-xs text-muted-foreground italic text-center">
                   Không tìm thấy định nghĩa cho từ này.
                </div>
              )}
            </div>
            <div className="bg-primary/5 p-3 flex items-center justify-center gap-2">
               <Sparkles className="h-3 w-3 text-primary" />
               <span className="text-[10px] font-black uppercase text-primary/60">AI Dictionary Enabled</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PassageViewer;
