'use client';

import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Volume2, Plus, Share2, Bookmark } from 'lucide-react';

interface WordDetailModalProps {
  word: any;
  isOpen: boolean;
  onClose: () => void;
  onAddToSet?: (wordId: string) => void;
}

const WordDetailModal: React.FC<WordDetailModalProps> = ({ word, isOpen, onClose, onAddToSet }) => {
  if (!word) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl overflow-hidden p-0 rounded-3xl border-none shadow-2xl">
        <div className="relative h-48 bg-gradient-to-br from-primary via-primary/80 to-purple-600 p-8 flex flex-col justify-end">
          <div className="absolute top-4 right-4 flex gap-2">
             <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-md">
                <Share2 className="h-5 w-5" />
             </Button>
             <Button variant="secondary" size="icon" className="h-10 w-10 rounded-full bg-white/20 border-white/20 text-white hover:bg-white/30 backdrop-blur-md">
                <Bookmark className="h-5 w-5" />
             </Button>
          </div>
          <div className="space-y-1 relative z-10">
             <div className="flex items-center gap-4">
                <h2 className="text-5xl font-black text-white tracking-tighter">{word.word}</h2>
                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full text-white hover:bg-white/20 mt-2">
                   <Volume2 className="h-8 w-8" />
                </Button>
             </div>
             {word.phonetic && (
               <p className="text-xl text-white/80 font-medium italic translate-x-1">{word.phonetic}</p>
             )}
          </div>
          
          {/* Decorative shapes */}
          <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        </div>

        <div className="p-8 space-y-8">
           <div className="space-y-3">
              <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Định nghĩa & Ý nghĩa</span>
              <div className="p-6 bg-muted/30 rounded-2xl border border-border/50">
                 <p className="text-2xl font-bold leading-tight">{word.definition}</p>
              </div>
           </div>

           {word.examplesJson && (word.examplesJson as string[]).length > 0 && (
             <div className="space-y-4">
                <span className="text-xs font-black uppercase tracking-[0.3em] text-primary/60">Ví dụ minh họa</span>
                <ul className="space-y-3">
                   {(word.examplesJson as string[]).map((ex, i) => (
                     <li key={i} className="flex gap-4 group">
                        <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0 group-hover:scale-150 transition-transform" />
                        <p className="text-lg italic text-muted-foreground leading-relaxed">"{ex}"</p>
                     </li>
                   ))}
                </ul>
             </div>
           )}

           <div className="pt-4 flex gap-4">
              <Button 
                className="flex-1 h-14 rounded-2xl text-lg font-black shadow-xl shadow-primary/20 gap-2"
                onClick={() => onAddToSet && onAddToSet(word.id)}
              >
                <Plus className="h-5 w-5" /> Thêm vào bộ Flashcard
              </Button>
              <Button variant="outline" className="h-14 rounded-2xl font-bold px-8">Tìm từ liên quan</Button>
           </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WordDetailModal;
