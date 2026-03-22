'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, RotateCcw, Volume2, FastForward, Rewind, ListMusic, Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Badge } from '@/components/ui/badge';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { motion, AnimatePresence } from 'framer-motion';

interface AudioPlayerProps {
  src: string;
  transcript?: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, transcript }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [volume, setVolume] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSliderChange = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${String(seconds).padStart(2, '0')}`;
  };

  const skip = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime += seconds;
    }
  };

  const speeds = [0.75, 1, 1.25, 1.5];

  return (
    <div className="space-y-6">
      <audio 
        ref={audioRef}
        src={src}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />

      <div className="bg-card/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/10 shadow-2xl space-y-8 relative overflow-hidden group">
        {/* Decorative background flare */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-primary/10 rounded-full blur-3xl opacity-50 group-hover:opacity-80 transition-opacity" />

        <div className="flex flex-col md:flex-row items-center gap-8 relative z-10">
           {/* Visualizer placeholder */}
           <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-primary to-purple-600 p-0.5 shadow-xl shadow-primary/20">
              <div className="w-full h-full bg-background rounded-[1.4rem] flex items-center justify-center">
                 <div className="flex items-end gap-1 h-12">
                    {[1,2,3,4,5].map(i => (
                      <motion.div 
                        key={i}
                        animate={isPlaying ? { height: [10, 30, 15, 40, 20] } : { height: 10 }}
                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }}
                        className="w-1.5 bg-primary rounded-full"
                      />
                    ))}
                 </div>
              </div>
           </div>

           <div className="flex-1 w-full space-y-4">
              <div className="flex justify-between items-end">
                 <div>
                    <h3 className="text-2xl font-black tracking-tight">Trình phát bài nghe</h3>
                    <p className="text-sm text-muted-foreground font-medium flex items-center gap-2">
                       <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                       Đang xử lý âm thanh chuẩn Studio
                    </p>
                 </div>
                 <div className="flex gap-2">
                    {speeds.map(s => (
                      <Button 
                        key={s} 
                        variant={playbackRate === s ? 'default' : 'outline'}
                        size="sm"
                        className="rounded-full h-8 px-3 text-[10px] font-black border-none bg-muted/50 hover:bg-primary/20"
                        onClick={() => setPlaybackRate(s)}
                      >
                        {s}x
                      </Button>
                    ))}
                 </div>
              </div>

              <div className="space-y-2">
                 <Slider 
                   value={[currentTime]} 
                   max={duration || 100} 
                   step={0.1} 
                   onValueChange={handleSliderChange}
                   className="cursor-pointer"
                 />
                 <div className="flex justify-between text-[10px] font-black tracking-widest text-muted-foreground uppercase">
                    <span>{formatTime(currentTime)}</span>
                    <span>{formatTime(duration)}</span>
                 </div>
              </div>
           </div>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 relative z-10">
           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/10" onClick={() => skip(-10)}>
              <Rewind className="h-6 w-6" />
           </Button>
           
           <Button 
              size="icon" 
              className="h-20 w-20 rounded-full shadow-2xl shadow-primary/40 bg-primary hover:scale-105 active:scale-95 transition-all"
              onClick={togglePlay}
           >
              {isPlaying ? <Pause className="h-10 w-10 fill-current" /> : <Play className="h-10 w-10 fill-current translate-x-0.5" />}
           </Button>

           <Button variant="ghost" size="icon" className="h-12 w-12 rounded-full hover:bg-primary/10" onClick={() => skip(10)}>
              <FastForward className="h-6 w-6" />
           </Button>

           <div className="absolute right-0 flex gap-4">
              <Button 
                variant={showTranscript ? 'default' : 'ghost'} 
                size="icon" 
                className="h-12 w-12 rounded-full"
                onClick={() => setShowTranscript(!showTranscript)}
              >
                 <Languages className="h-5 w-5" />
              </Button>
           </div>
        </div>
      </div>

      <AnimatePresence>
        {showTranscript && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <Card className="rounded-[2rem] border-primary/20 bg-primary/5 overflow-hidden">
               <CardHeader className="bg-primary/10 border-b border-primary/10">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-[0.2em] text-primary">
                     <ListMusic className="h-4 w-4" /> Bản ghi lời thoại (Transcript)
                  </div>
               </CardHeader>
               <CardContent className="p-8">
                  <div className="prose prose-lg dark:prose-invert max-w-none">
                     <p className="text-xl leading-relaxed italic text-muted-foreground whitespace-pre-wrap">
                        {transcript || 'Không có transcript cho bài nghe này.'}
                     </p>
                  </div>
               </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AudioPlayer;
