import { Home, Brain, Settings, Bot, Users, Cpu, PlayCircle, Mountain } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const items = [
    { id: 'home', icon: Home, label: '概览' },
    { id: 'robots', icon: Bot, label: '机器人' },
    { id: 'terrains', icon: Mountain, label: '地形' },
    { id: 'models', icon: Brain, label: '项目' },
    { id: 'simulation', icon: PlayCircle, label: '仿真' },
    { id: 'community', icon: Users, label: '社区' },
    { id: 'settings', icon: Settings, label: '设置' },
  ];

  return (
    <aside className="w-full md:w-20 bg-nvidia-dark border-t md:border-t-0 md:border-r border-nvidia-border flex flex-row md:flex-col items-center py-2 md:py-4 z-50">
      <div className="hidden md:block mb-8">
        <div className="w-8 h-8 bg-nvidia-green rounded-sm flex items-center justify-center">
          <Cpu className="text-black w-5 h-5" />
        </div>
      </div>
      
      <nav className="flex-1 flex flex-row md:flex-col w-full justify-around md:justify-start overflow-x-auto no-scrollbar">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={cn(
              "nvidia-sidebar-item flex-1 md:flex-none py-2 md:py-4",
              activeTab === item.id && "active"
            )}
          >
            <item.icon className="w-5 h-5 md:w-6 md:h-6" />
            <span className="text-[9px] md:text-[10px] font-medium mt-1">{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
