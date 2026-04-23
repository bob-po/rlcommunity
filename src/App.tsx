import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import AIAssistant from '@/components/AIAssistant';
import Dashboard from '@/components/Dashboard';
import LoginModal from '@/components/LoginModal';
import { Toaster } from '@/components/ui/sonner';
import { motion, AnimatePresence } from 'motion/react';

const tabTitles: Record<string, string> = {
  'home': '系统概览',
  'robots': '机器人资产',
  'terrains': '地形库',
  'models': '项目中心',
  'simulation': '实时仿真',
  'community': '社区分享',
  'settings': '系统设置'
};

function AppContent() {
  const { user, isLoginModalOpen, setLoginModalOpen } = useAuth();
  const [isGuest, setIsGuest] = useState(false);
  const [activeTab, setActiveTab] = useState('home');
  const [navKey, setNavKey] = useState(0);
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false);
  const [projects, setProjects] = useState(() => {
    const saved = localStorage.getItem('omnirl_projects');
    return saved ? JSON.parse(saved) : ['Cruiser-v1', 'CartPole-v1', 'MountainCar-v0', 'Acrobot-v1', 'Pendulum-v1', 'BipedalWalker-v3'];
  });
  const [currentProject, setCurrentProject] = useState('Cruiser-v1');

  useEffect(() => {
    localStorage.setItem('omnirl_projects', JSON.stringify(projects));
  }, [projects]);

  const saveProject = (name: string) => {
    if (name && !projects.includes(name)) {
      setProjects(prev => [...prev, name]);
    }
    setCurrentProject(name);
  };

  const handleSetActiveTab = (tab: string) => {
    setActiveTab(tab);
    setNavKey(prev => prev + 1);
  };

  const showSidebar = user || isGuest;

  return (
    <div className="flex flex-col-reverse md:flex-row h-screen bg-nvidia-dark text-white font-sans overflow-hidden">
      {showSidebar && <Sidebar activeTab={activeTab} setActiveTab={handleSetActiveTab} />}
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {showSidebar && <Navbar title={tabTitles[activeTab] || activeTab.toUpperCase()} />}
        
        <div className="flex-1 flex overflow-hidden relative">
          <Dashboard 
            activeTab={activeTab} 
            setActiveTab={handleSetActiveTab} 
            navKey={navKey}
            isGuest={isGuest} 
            setIsGuest={setIsGuest} 
            projects={projects}
            onSaveProject={saveProject}
            currentProject={currentProject}
            onProjectChange={setCurrentProject}
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
      <LoginModal 
        isOpen={isLoginModalOpen} 
        onClose={() => setLoginModalOpen(false)} 
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
