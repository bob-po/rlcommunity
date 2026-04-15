import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { MoreVertical, Trash2, Edit3, Share2, Heart, MessageCircle, Bot, Mountain, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AssetCardProps {
  item: any;
  type: 'robot' | 'terrain' | 'model';
  onApply: (item: any) => void;
  onAction: (action: string, item: any) => void;
}

export default function AssetCard({ item, type, onApply, onAction }: AssetCardProps) {
  const [pressProgress, setPressProgress] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (showActions && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setShowActions(false);
        setPressProgress(0);
      }
    };

    if (showActions) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showActions]);

  const handleMouseDown = (e: React.MouseEvent) => {
    if (showActions) return;
    setPressProgress(0);
    const startTime = Date.now();
    const duration = 800; 

    progressIntervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setPressProgress(progress);
      
      if (progress >= 100) {
        if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
        setShowActions(true);
      }
    }, 10);
  };

  const handleMouseUp = () => {
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (!showActions) {
      setPressProgress(0);
    }
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "relative bg-nvidia-gray border border-nvidia-border rounded-sm overflow-hidden group select-none",
        type === 'model' ? "p-4" : "p-6"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      onDoubleClick={() => onApply(item)}
    >
      {/* Progress Bar for Long Press */}
      <div 
        className="absolute top-0 left-0 h-0.5 bg-nvidia-green transition-all duration-75 z-20"
        style={{ width: `${pressProgress}%` }}
      />

      {/* Quick Actions Overlay */}
      {showActions && (
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center gap-6 animate-in fade-in zoom-in duration-200">
          <button onClick={() => onAction('edit', item)} className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full border border-nvidia-border flex items-center justify-center hover:border-nvidia-green">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">编辑</span>
          </button>
          <button onClick={() => onAction('share', item)} className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors">
            <div className="w-10 h-10 rounded-full border border-nvidia-border flex items-center justify-center hover:border-nvidia-green">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">分享</span>
          </button>
          <button onClick={() => onAction('delete', item)} className="flex flex-col items-center gap-2 text-red-500 hover:text-red-400 transition-colors">
            <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center hover:border-red-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">删除</span>
          </button>
        </div>
      )}

      <div className="flex items-start justify-between mb-4">
        <div className={cn(
          "bg-nvidia-light-gray p-3 rounded-sm",
          type === 'model' ? "p-2" : "p-3"
        )}>
          {type === 'robot' && <Bot className="text-nvidia-green w-6 h-6" />}
          {type === 'terrain' && <Mountain className="text-blue-400 w-6 h-6" />}
          {type === 'model' && <Brain className="text-yellow-500 w-4 h-4" />}
        </div>
        <div className="flex items-center gap-2">
          {type === 'model' && (
            <div className="text-right mr-2">
              <p className="text-[8px] text-gray-500 uppercase font-bold">Reward</p>
              <p className="text-xs font-mono text-nvidia-green">{item.reward}</p>
            </div>
          )}
          <button className="text-gray-600 hover:text-white transition-colors">
            <MoreVertical className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1">
        <h4 className={cn(
          "font-bold truncate",
          type === 'model' ? "text-sm max-w-[120px]" : "text-lg"
        )}>{item.name}</h4>
        <p className={cn(
          "text-gray-500 truncate",
          type === 'model' ? "text-[10px] max-w-[120px]" : "text-sm"
        )}>
          {type === 'model' ? item.algo : item.desc}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <div className="flex -space-x-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="w-6 h-6 rounded-full border-2 border-nvidia-gray bg-nvidia-light-gray flex items-center justify-center text-[8px] font-bold">
              {String.fromCharCode(64 + i)}
            </div>
          ))}
        </div>
        <button 
          onClick={() => onApply(item)}
          className="text-[10px] font-bold text-nvidia-green uppercase tracking-widest hover:text-white transition-colors"
        >
          应用资产
        </button>
      </div>
    </div>
  );
}
