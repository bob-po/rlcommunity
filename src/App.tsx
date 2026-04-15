import React, { useState } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import Dashboard from '@/components/Dashboard';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';

const tabTitles: Record<string, string> = {
  'home': '系统概览',
  'robots': '机器人资产',
  'terrains': '地形库',
  'models': '模型库',
  'simulation': '实时仿真',
  'community': '社区分享',
  'settings': '系统设置'
};

function AppContent() {
  const { user } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);

  const showSidebar = user || isGuest;

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen bg-nvidia-dark text-white font-sans overflow-hidden">
      {showSidebar && <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showSidebar && <Navbar title={tabTitles[activeTab] || activeTab.toUpperCase()} />}
        
        <div className="flex-1 flex overflow-hidden relative">
          <Dashboard 
            activeTab={activeTab} 
            setActiveTab={setActiveTab} 
            isGuest={isGuest} 
            setIsGuest={setIsGuest} 
          />
          
          {/* Squeeze Placeholder for AI Assistant Sidebar */}
          <AnimatePresence mode="wait">
            {isAIAssistantOpen && (
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: 320 }}
                exit={{ width: 0 }}
                transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                className="shrink-0 border-l border-nvidia-border bg-nvidia-gray hidden lg:block"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AIAssistant 
        isOpen={isAIAssistantOpen} 
        setIsOpen={setIsAIAssistantOpen} 
      />
      <Toaster theme="dark" position="top-right" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
