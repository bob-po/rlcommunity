import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AIAssistantProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function AIAssistant({ isOpen, setIsOpen }: AIAssistantProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', role: 'assistant', content: '你好！我是 OmniRL AI 助手。我可以帮你优化模型参数、解释仿真数据或协助你配置训练环境。有什么我可以帮你的吗？', timestamp: new Date() }
  ]);
  const [inputValue, setInputValue] = useState('');
  const chatEndRef = useRef<HTMLDivElement>(null);
  const isDragging = useRef(false);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (!inputValue.trim()) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    setTimeout(() => {
      const aiMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '收到您的消息。目前 AI 功能正在维护中，请稍后再试。',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, aiMsg]);
    }, 500);
  };

  const toggleOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Draggable Logo / Trigger */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            drag
            dragMomentum={false}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onDragStart={() => {
              isDragging.current = true;
            }}
            onDragEnd={() => {
              // Use a small timeout to ensure the tap event fires before we reset the flag
              setTimeout(() => {
                isDragging.current = false;
              }, 100);
            }}
            onTap={() => {
              if (!isDragging.current) {
                toggleOpen();
              }
            }}
            className="fixed bottom-20 md:bottom-10 right-4 md:right-10 z-50 cursor-grab active:cursor-grabbing"
          >
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-nvidia-green to-blue-500 rounded-full blur opacity-40 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-pulse"></div>
              <div className="relative flex items-center justify-center w-12 h-12 md:w-14 md:h-14 bg-nvidia-dark border border-nvidia-green/50 rounded-full shadow-[0_0_20px_rgba(118,185,0,0.3)]">
                <Bot className="w-6 h-6 md:w-8 md:h-8 text-nvidia-green" />
                <div className="absolute -top-1 -right-1 w-3 h-3 md:w-4 md:h-4 bg-nvidia-green rounded-full border-2 border-nvidia-dark animate-bounce" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Assistant Interface */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed z-50 bg-nvidia-gray border-nvidia-border flex flex-col shadow-2xl overflow-hidden top-0 md:top-14 right-0 w-full md:w-80 h-full md:h-[calc(100vh-56px)] border-l"
          >
            {/* Header */}
            <div className="p-4 border-b border-nvidia-border flex items-center justify-between bg-nvidia-light-gray/50">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-nvidia-green/20 flex items-center justify-center">
                  <Sparkles className="w-4 h-4 text-nvidia-green" />
                </div>
                <div>
                  <h3 className="text-sm font-bold">OmniRL AI Assistant</h3>
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-nvidia-green animate-pulse" />
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 hover:bg-nvidia-border rounded-sm text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 custom-scrollbar">
              {messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={cn(
                    "flex flex-col max-w-[85%]",
                    msg.role === 'user' ? "ml-auto items-end" : "items-start"
                  )}
                >
                  <div className={cn(
                    "p-3 rounded-sm text-sm leading-relaxed",
                    msg.role === 'user' 
                      ? "bg-nvidia-green text-black font-medium" 
                      : "bg-nvidia-light-gray border border-nvidia-border text-gray-200"
                  )}>
                    {msg.content}
                  </div>
                  <span className="text-[9px] text-gray-500 mt-1">
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-nvidia-border bg-nvidia-light-gray/30">
              <div className="relative">
                <input 
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="询问 AI 助手..."
                  className="w-full bg-nvidia-dark border border-nvidia-border rounded-sm py-2 pl-3 pr-10 text-sm focus:outline-none focus:border-nvidia-green transition-colors"
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-nvidia-green hover:text-white disabled:text-gray-600 transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
              <p className="text-[10px] text-gray-500 mt-2 text-center">
                Powered by NVIDIA AI Foundation Models
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
