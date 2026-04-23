import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Brain, Mountain, Bot, Zap, Heart, MessageCircle, UploadCloud, MoreVertical, ChevronDown, Save, Layers, ArrowLeft, Calendar, User, Star, Share2, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import AssetCard from './AssetCard';
import RLVisualizer3D from './RLVisualizer3D';
import { Button } from '@/components/ui/button';
import { MoreVertical as MoreIcon, Trash2, Edit3 } from 'lucide-react';

interface ProjectCenterCardProps {
  project: any;
  onAction: (action: string, item: any) => void;
  onModelSelect: (robot: string, terrain: string, model: string) => void;
}

const ProjectCenterCard = ({ project, onAction, onModelSelect }: ProjectCenterCardProps) => {
  const [pressProgress, setPressProgress] = useState(0);
  const [showActions, setShowActions] = useState(false);
  const progressIntervalRef = React.useRef<NodeJS.Timeout | null>(null);
  const cardRef = React.useRef<HTMLDivElement>(null);

  // Handle click outside and Esc key
  React.useEffect(() => {
    if (!showActions) return;

    const handleGlobalInteraction = (e: MouseEvent) => {
      if (cardRef.current && !cardRef.current.contains(e.target as Node)) {
        setShowActions(false);
        setPressProgress(0);
      }
    };

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setShowActions(false);
        setPressProgress(0);
      }
    };

    window.addEventListener('mousedown', handleGlobalInteraction);
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('mousedown', handleGlobalInteraction);
      window.removeEventListener('keydown', handleEsc);
    };
  }, [showActions]);

  const handleMouseDown = () => {
    if (showActions) return;
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
    if (!showActions) setPressProgress(0);
  };

  return (
    <div 
      ref={cardRef}
      className={cn(
        "bg-nvidia-gray border rounded-sm overflow-hidden flex flex-col lg:flex-row nvidia-card-hover group relative transition-all duration-300",
        showActions ? "border-nvidia-green ring-1 ring-nvidia-green/20" : "border-nvidia-border"
      )}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Progress Bar */}
      <div 
        className="absolute top-0 left-0 h-0.5 bg-nvidia-green transition-all duration-75 z-20"
        style={{ width: `${pressProgress}%` }}
      />

      {/* Overlay Actions */}
      {showActions && (
        <div 
          className="absolute inset-0 bg-black/80 backdrop-blur-sm z-30 flex items-center justify-center gap-6 animate-in fade-in zoom-in duration-200 cursor-default"
          onMouseDown={(e) => {
            e.stopPropagation();
            setShowActions(false);
            setPressProgress(0);
          }}
        >
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAction('edit', project); setShowActions(false); }} 
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-nvidia-border flex items-center justify-center hover:border-nvidia-green">
              <Edit3 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">编辑项目</span>
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAction('share', project); setShowActions(false); }} 
            className="flex flex-col items-center gap-2 text-gray-400 hover:text-white transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-nvidia-border flex items-center justify-center hover:border-nvidia-green">
              <Share2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">分享</span>
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); onAction('delete', project); setShowActions(false); }} 
            className="flex flex-col items-center gap-2 text-red-500 hover:text-red-400 transition-colors"
          >
            <div className="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center hover:border-red-500">
              <Trash2 className="w-5 h-5" />
            </div>
            <span className="text-[10px] font-bold uppercase tracking-wider">删除</span>
          </button>
          <button 
            onMouseDown={(e) => e.stopPropagation()}
            onClick={(e) => { e.stopPropagation(); setShowActions(false); }} 
            className="absolute top-4 right-4 text-gray-500 hover:text-white"
          >
            <ChevronDown className="w-6 h-6 rotate-180" />
          </button>
        </div>
      )}

      {/* Project Visual */}
      <div className="lg:w-1/3 aspect-video lg:aspect-auto relative overflow-hidden bg-[#050505]">
        <img src={project.img} className="w-full h-full object-cover opacity-60 group-hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-nvidia-gray hidden lg:block" />
        <div className="absolute inset-0 bg-gradient-to-t from-nvidia-gray via-transparent to-transparent lg:hidden" />
        
        <div className="absolute bottom-6 left-6 right-6">
          <div className="flex items-center gap-3 mb-2">
            <div className="px-2 py-0.5 bg-nvidia-green text-black text-[10px] font-bold uppercase tracking-widest rounded-sm">Project Active</div>
            <div className="text-xs font-mono text-gray-400">ID: {project.id}</div>
          </div>
          <h3 className="text-2xl font-bold italic tracking-tight">{project.name}</h3>
        </div>
      </div>

      {/* Project Info */}
      <div className="flex-1 p-6 lg:p-8 flex flex-col md:flex-row gap-8">
        <div className="flex-1 space-y-6">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500">关联资产</h4>
              <button 
                onClick={(e) => { e.stopPropagation(); setShowActions(true); }}
                className="text-gray-600 hover:text-white transition-colors lg:hidden"
              >
                <MoreIcon className="w-4 h-4" />
              </button>
            </div>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-3 bg-nvidia-light-gray/50 border border-nvidia-border p-3 rounded-sm flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-sm bg-nvidia-green/10 flex items-center justify-center text-nvidia-green">
                  <Bot className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[8px] uppercase text-gray-500 font-bold">机器人</div>
                  <div className="text-sm font-bold">{project.robot}</div>
                </div>
              </div>
              <div className="flex items-center gap-3 bg-nvidia-light-gray/50 border border-nvidia-border p-3 rounded-sm flex-1 min-w-[200px]">
                <div className="w-10 h-10 rounded-sm bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <Mountain className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-[8px] uppercase text-gray-500 font-bold">地形</div>
                  <div className="text-sm font-bold">{project.terrain}</div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">基本描述</h4>
            <p className="text-sm text-gray-400 leading-relaxed italic line-clamp-2">
              {project.desc}
            </p>
          </div>
        </div>

        <div className="md:w-64 space-y-6">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-500 mb-4">历史模型 ({project.models.length})</h4>
          <div className="space-y-2 max-h-[180px] overflow-y-auto custom-scrollbar pr-2">
            {project.models.map((m: any, idx: number) => (
              <div 
                key={idx} 
                onDoubleClick={(e) => {
                  e.stopPropagation();
                  onModelSelect(project.robot, project.terrain, m.name);
                }}
                className="flex flex-col p-3 bg-nvidia-light-gray/30 border border-nvidia-border rounded-sm hover:border-nvidia-green/50 transition-colors group/model cursor-pointer"
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs font-bold text-gray-300 group-hover/model:text-nvidia-green transition-colors">{m.name}</span>
                  <span className="text-[8px] font-mono text-nvidia-green">{m.reward}</span>
                </div>
                <span className="text-[9px] text-gray-600 font-mono">{m.date}</span>
                <span className="text-[8px] text-nvidia-green/40 opacity-0 group-hover/model:opacity-100 transition-opacity">双击加载此权重仿真</span>
              </div>
            ))}
          </div>
          <button className="w-full py-2 bg-transparent border border-nvidia-border text-gray-500 hover:border-nvidia-green hover:text-nvidia-green transition-all text-[10px] font-bold uppercase tracking-widest">
            管理权重文件
          </button>
        </div>
      </div>
    </div>
  );
};

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  navKey?: number;
  isGuest: boolean;
  setIsGuest: (v: boolean) => void;
  projects: string[];
  onSaveProject: (name: string) => void;
  currentProject: string;
  onProjectChange: (name: string) => void;
}

interface DetailItem {
  id?: string;
  name: string;
  title?: string;
  desc: string;
  author?: string;
  date?: string;
  reward?: string;
  algo?: string;
  type?: string;
  img?: string;
  likes?: number;
  comments?: number;
  dataType: 'project' | 'robot' | 'terrain';
}

const tabTitles: Record<string, string> = {
  'home': '系统概览',
  'robots': '机器人资产',
  'terrains': '地形库',
  'models': '项目中心',
  'simulation': '实时仿真',
  'community': '社区分享',
  'settings': '系统设置'
};

const robots = [
  { name: 'Unitree Go1', desc: '高性能四足机器人，适用于复杂地形。', type: 'quadruped' },
  { name: 'ANYmal C', desc: '工业级四足机器人，具备极强的环境适应性。', type: 'quadruped' },
  { name: 'Spot', desc: '波士顿动力出品，灵活且功能强大的移动平台。', type: 'quadruped' },
];

const terrains = [
  { name: 'Rough Stairs', desc: '不规则楼梯环境，挑战平衡算法。' },
  { name: 'Forest Trail', desc: '模拟森林小径，包含障碍物与软土。' },
  { name: 'Industrial Pipe', desc: '复杂的工业管道环境，测试狭窄空间通过性。' },
];

const models = [
  { id: '1', name: 'PPO_Walker_v2', algo: 'PPO', date: '2024-03-10', reward: '1240.5' },
  { id: '2', name: 'SAC_Climber_v1', algo: 'SAC', date: '2024-03-08', reward: '890.2' },
  { id: '3', name: 'DDPG_Runner_v3', algo: 'DDPG', date: '2024-03-05', reward: '1560.8' },
  { id: '4', name: 'TD3_Bipedal_v4', algo: 'TD3', date: '2024-03-01', reward: '1120.3' },
];

const recentProjects = [
  { id: 'p1', name: '四足机器人楼梯穿越', status: '训练中', progress: 65, type: 'quadruped' },
  { id: 'p2', name: '机械臂精准抓取测试', status: '已完成', progress: 100, type: 'arm' },
  { id: 'p3', name: '无人机室内避障', status: '已暂停', progress: 42, type: 'drone' },
];

const communityPosts = [
  { title: '多足机器人复杂地形穿越', author: 'RL_Master', likes: 1204, comments: 89, img: 'https://picsum.photos/seed/share1/600/400', dataType: 'project' as const },
  { title: 'Spot 机器人定制传感器组', author: 'SensorsLab', likes: 654, comments: 23, img: 'https://picsum.photos/seed/share_robot/600/400', dataType: 'robot' as const, name: 'Spot Custom' },
  { title: '极地冰原复杂地形', author: 'Arctic_Sim', likes: 2341, comments: 156, img: 'https://picsum.photos/seed/share_terrain/600/400', dataType: 'terrain' as const, name: 'Polar Ice' },
  { title: '机械臂精准抓取与放置', author: 'RobotArm_Dev', likes: 2341, comments: 156, img: 'https://picsum.photos/seed/share3/600/400', dataType: 'project' as const },
  { title: '基于 PPO 的无人机避障模型', author: 'DroneTech', likes: 856, comments: 42, img: 'https://picsum.photos/seed/share2/600/400', dataType: 'project' as const },
  { title: 'Unitree Go1 步态优化', author: 'QuadrupedLover', likes: 432, comments: 12, img: 'https://picsum.photos/seed/go1/600/400', dataType: 'robot' as const, name: 'Go1 Optimized' },
];

const projectsCenterData = [
  {
    id: 'p1',
    name: '四足机器人楼梯穿越',
    robot: 'Unitree Go1',
    terrain: 'Rough Stairs',
    desc: '利用深度强化学习优化机器人在极端楼梯环境下的步态。通过 PPO 算法，机器人能够感知楼梯高度并自动调整落足点。',
    models: [
      { name: 'PPO_Stairs_v1', date: '2024-03-10', reward: '1240.5' },
      { name: 'PPO_Stairs_Final', date: '2024-03-15', reward: '1560.8' },
      { name: 'SAC_Stairs_Experimental', date: '2024-03-12', reward: '1120.3' }
    ],
    img: 'https://picsum.photos/seed/p1_proj/800/450'
  },
  {
    id: 'p2',
    name: '工业机械臂精准抓取',
    robot: 'ANYmal C (Arm)',
    terrain: 'Industrial Pipe',
    desc: '在复杂的工业环境下实现对细小物件的精准识别与抓取。该项目结合了视觉检测与触觉反馈。',
    models: [
      { name: 'Arm_Grasp_v3', date: '2024-03-08', reward: '890.2' },
      { name: 'Arm_Grasp_Refined', date: '2024-03-20', reward: '980.5' }
    ],
    img: 'https://picsum.photos/seed/p2_proj/800/450'
  },
  {
    id: 'p3',
    name: '无人机避障与搜索',
    robot: 'DJI Matrice',
    terrain: 'Forest Trail',
    desc: '在城市废墟环境中进行自主飞行与目标搜索，重点解决动态障碍物避让问题。',
    models: [
      { name: 'Drone_Urban_v1', date: '2024-03-05', reward: '1560.8' }
    ],
    img: 'https://picsum.photos/seed/p3_proj/800/450'
  }
];

export default function Dashboard({ 
  activeTab, 
  setActiveTab, 
  navKey,
  isGuest, 
  setIsGuest, 
  projects, 
  onSaveProject,
  currentProject,
  onProjectChange
}: DashboardProps) {
  const { user, login } = useAuth();
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const [currentHeroSlide, setCurrentHeroSlide] = useState(0);
  const [selectedDetailItem, setSelectedDetailItem] = useState<DetailItem | null>(null);
  const [communitySearch, setCommunitySearch] = useState('');
  const [communityFilter, setCommunityFilter] = useState<'all' | 'project' | 'robot' | 'terrain'>('all');

  const heroSlides = [
    {
      title: "OmniRL Training Ready",
      desc: "Get your reinforcement learning models ready for the most complex simulation environments.",
      btnText: "开始训练",
      color: "nvidia-green",
      icon: <Brain className="text-black w-16 h-16" />
    },
    {
      title: "Real-time Multi-agent Lab",
      desc: "Simulate complex interactions between multiple robots with zero-latency hardware acceleration.",
      btnText: "探索实验室",
      color: "blue-500",
      icon: <Bot className="text-black w-16 h-16" />
    },
    {
      title: "Cloud Physics Engine",
      desc: "Harness the power of distributed GPU training to solve high-dimensional control problems.",
      btnText: "查看文档",
      color: "yellow-500",
      icon: <Layers className="text-black w-16 h-16" />
    }
  ];

  React.useEffect(() => {
    setSelectedDetailItem(null);
    if (activeTab === 'home') {
      const timer = setInterval(() => {
        setCurrentHeroSlide(prev => (prev + 1) % heroSlides.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [activeTab, navKey]);

  const handleStartSimulation = (robot?: string, terrain?: string, model?: string) => {
    if (robot) setSelectedRobot(robot);
    if (terrain) setSelectedTerrain(terrain);
    if (model) setSelectedModel(model);
    setActiveTab('simulation');
  };

  const handleAction = (action: string, item: any) => {
    console.log(`Action: ${action} on ${item.name}`);
  };

  const openDetail = (item: any, dataType: 'project' | 'robot' | 'terrain') => {
    setSelectedDetailItem({ ...item, dataType });
  };

  if (selectedDetailItem) {
    return (
      <motion.div 
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        className="max-w-5xl mx-auto space-y-8"
      >
        <button 
          onClick={() => setSelectedDetailItem(null)}
          className="flex items-center gap-2 text-gray-500 hover:text-nvidia-green transition-colors mb-6 group"
        >
          <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold uppercase tracking-widest">返回列表</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left: Image/Visual */}
          <div className="space-y-6">
            <div className="aspect-video bg-nvidia-gray border border-nvidia-border rounded-sm overflow-hidden relative shadow-2xl">
              <img 
                src={selectedDetailItem.img || `https://picsum.photos/seed/${selectedDetailItem.id || selectedDetailItem.name}/800/450`} 
                className="w-full h-full object-cover" 
                referrerPolicy="no-referrer" 
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-nvidia-gray/50 border border-nvidia-border p-4 rounded-sm text-center">
                <div className="flex items-center justify-center gap-2 text-nvidia-green mb-1">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-widest">Rating</span>
                </div>
                <div className="text-lg font-mono font-bold italic">4.9/5.0</div>
              </div>
              <div className="bg-nvidia-gray/50 border border-nvidia-border p-4 rounded-sm text-center">
                <div className="flex items-center justify-center gap-2 text-blue-400 mb-1">
                  <Share2 className="w-4 h-4" />
                  <span className="text-xs font-bold uppercase tracking-widest">Shares</span>
                </div>
                <div className="text-lg font-mono font-bold italic">2.4k</div>
              </div>
              <div className="bg-nvidia-gray/50 border border-nvidia-border p-4 rounded-sm text-center">
                <div className="flex items-center justify-center gap-2 text-yellow-500 mb-1">
                  <Heart className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold uppercase tracking-widest">Likes</span>
                </div>
                <div className="text-lg font-mono font-bold italic">{selectedDetailItem.likes || '---'}</div>
              </div>
            </div>
          </div>

          {/* Right: Info */}
          <div className="flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn(
                "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest border",
                selectedDetailItem.dataType === 'project' ? "bg-nvidia-green/10 text-nvidia-green border-nvidia-green/20" :
                selectedDetailItem.dataType === 'robot' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
              )}>
                {selectedDetailItem.dataType}
              </span>
              <div className="h-px flex-1 bg-nvidia-border" />
            </div>

            <h2 className="text-4xl font-bold mb-6 italic tracking-tight">{selectedDetailItem.title || selectedDetailItem.name}</h2>
            
            <p className="text-gray-400 text-lg leading-relaxed mb-8">
              {selectedDetailItem.desc || "此项目展示了基于 OmniRL 框架的深度强化学习成果。通过对环境物理特性的高精度模拟，模型在极短的时间内收敛，并展现出了卓越的泛化能力。"}
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-full bg-nvidia-gray border border-nvidia-border flex items-center justify-center text-nvidia-green">
                  <User className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Creator</div>
                  <div className="font-bold">{selectedDetailItem.author || "NVIDIA Foundation"}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-full bg-nvidia-gray border border-nvidia-border flex items-center justify-center text-blue-400">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Created Date</div>
                  <div className="font-bold">{selectedDetailItem.date || "2024-04-20"}</div>
                </div>
              </div>
              <div className="flex items-center gap-4 text-sm">
                <div className="w-10 h-10 rounded-full bg-nvidia-gray border border-nvidia-border flex items-center justify-center text-yellow-500">
                  <Zap className="w-5 h-5" />
                </div>
                <div>
                  <div className="text-gray-500 text-[10px] uppercase font-bold tracking-widest">Performance</div>
                  <div className="font-bold">{selectedDetailItem.reward ? `${selectedDetailItem.reward} Total Reward` : (selectedDetailItem.type || "Industrial Spec")}</div>
                </div>
              </div>
            </div>

            <div className="mt-auto pt-8 border-t border-nvidia-border flex gap-4">
              <Button 
                onClick={() => {
                  handleStartSimulation(
                    selectedDetailItem.dataType === 'robot' ? selectedDetailItem.name : undefined,
                    selectedDetailItem.dataType === 'terrain' ? selectedDetailItem.name : undefined,
                    selectedDetailItem.dataType === 'project' ? selectedDetailItem.name : undefined
                  );
                  setSelectedDetailItem(null);
                }}
                className="nvidia-btn-primary flex-1 py-6 text-base"
              >
                立即在仿真中应用
              </Button>
              <Button variant="outline" className="border-nvidia-border hover:bg-nvidia-border text-gray-300 py-6 px-8">
                转发分享
              </Button>
            </div>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
          {[
            { t: 'High Fidelity', d: '物理精度对齐现实世界，误差率低于 1%。' },
            { t: 'Real-time Compute', d: '支持 RTX 硬件加速，毫秒级响应。' },
            { t: 'Seamless Integration', d: '一键同步至 Edge 设备，即刻部署。' }
          ].map((f, i) => (
            <div key={i} className="bg-nvidia-gray/30 border border-nvidia-border p-6 rounded-sm">
              <h4 className="font-bold text-nvidia-green mb-2 uppercase tracking-widest text-xs">{f.t}</h4>
              <p className="text-gray-500 text-sm italic">{f.d}</p>
            </div>
          ))}
        </div>
      </motion.div>
    );
  }

  if (!user && !isGuest) {
    return (
      <div className="flex-1 flex items-center justify-center bg-nvidia-dark relative overflow-hidden">
        {/* Background decorative elements */}
        <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-nvidia-green rounded-full blur-[120px]" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full blur-[120px]" />
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center z-10 max-w-2xl px-6"
        >
          <div className="mb-8 flex justify-center">
            <div className="w-20 h-20 bg-nvidia-green/10 rounded-full flex items-center justify-center border border-nvidia-green/30">
              <Zap className="text-nvidia-green w-10 h-10" />
            </div>
          </div>
          <h1 className="text-5xl font-bold mb-6 tracking-tight">OmniRL Foundation</h1>
          <p className="text-gray-400 text-lg mb-10 leading-relaxed">
            欢迎使用 NVIDIA OmniRL 强化学习开发平台。请登录您的 NVIDIA 账户以访问完整的资产库、云端训练资源及社区分享功能。
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button 
              onClick={login}
              className="nvidia-btn-primary px-10 h-12 text-sm font-bold uppercase tracking-wide w-full sm:w-auto"
            >
              立即登录
            </button>
            <button 
              onClick={() => setIsGuest(true)}
              className="border border-nvidia-border hover:bg-nvidia-light-gray text-white font-bold px-10 h-12 transition-colors uppercase text-sm tracking-wide w-full sm:w-auto"
            >
              游客访问
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'home':
        return (
          <motion.div 
            key="home"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="space-y-12 max-w-7xl mx-auto"
          >
            {/* Hero Section */}
            <section className="relative min-h-[300px] md:h-[380px] rounded-sm overflow-hidden bg-[#0a0a0a] border border-nvidia-border group flex flex-col md:flex-row">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={currentHeroSlide}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="flex-1 flex flex-col justify-center p-6 md:p-12 z-20"
                >
                  <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">
                    {heroSlides[currentHeroSlide].title}
                  </h2>
                  <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-8 max-w-md">
                    {heroSlides[currentHeroSlide].desc}
                  </p>
                  <div className="flex items-center gap-6 mb-8 md:mb-16">
                    <button 
                      onClick={() => handleStartSimulation()}
                      className={cn(
                        "nvidia-btn-primary px-8 py-3 w-full md:w-auto transition-all",
                        currentHeroSlide === 1 && "bg-blue-600 hover:bg-blue-500",
                        currentHeroSlide === 2 && "bg-yellow-600 hover:bg-yellow-500 text-black"
                      )}
                    >
                      {heroSlides[currentHeroSlide].btnText}
                    </button>
                  </div>
                  
                  <div className="absolute bottom-8 left-12 flex gap-2">
                    {heroSlides.map((_, idx) => (
                      <button 
                        key={idx}
                        onClick={() => setCurrentHeroSlide(idx)}
                        className={cn(
                          "w-8 h-1 rounded-full transition-all duration-300",
                          currentHeroSlide === idx 
                            ? (idx === 0 ? "bg-nvidia-green" : idx === 1 ? "bg-blue-500" : "bg-yellow-500") 
                            : "bg-gray-700 hover:bg-gray-600"
                        )} 
                      />
                    ))}
                  </div>
                </motion.div>
              </AnimatePresence>
              
              <div className="flex-1 relative hidden md:flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a0a0a] z-10" />
                <div className="relative z-0 w-full h-full flex items-center justify-center">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentHeroSlide}
                      initial={{ opacity: 0, scale: 0.8, rotate: -10 }}
                      animate={{ opacity: 1, scale: 1, rotate: 0 }}
                      exit={{ opacity: 0, scale: 0.8, rotate: 10 }}
                      transition={{ duration: 0.5 }}
                      className={cn(
                        "w-64 h-64 rounded-full flex items-center justify-center animate-pulse",
                        currentHeroSlide === 0 ? "bg-nvidia-green/10" :
                        currentHeroSlide === 1 ? "bg-blue-500/10" :
                        "bg-yellow-500/10"
                      )}
                    >
                      <div className={cn(
                        "w-48 h-48 rounded-full flex items-center justify-center",
                        currentHeroSlide === 0 ? "bg-nvidia-green/20" :
                        currentHeroSlide === 1 ? "bg-blue-500/20" :
                        "bg-yellow-500/20"
                      )}>
                        <div className={cn(
                          "w-32 h-32 rounded-full flex items-center justify-center shadow-2xl transition-all duration-500",
                          currentHeroSlide === 0 ? "bg-nvidia-green shadow-nvidia-green/60" :
                          currentHeroSlide === 1 ? "bg-blue-500 shadow-blue-500/60" :
                          "bg-yellow-500 shadow-yellow-500/60"
                        )}>
                          {heroSlides[currentHeroSlide].icon}
                        </div>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
              </div>
            </section>

            {/* Library Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">推荐项目</h3>
                <button 
                  onClick={() => setActiveTab('community')}
                  className="text-nvidia-green text-xs font-bold hover:underline"
                >
                  查看更多
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {models.map((model) => (
                  <div 
                    key={model.id} 
                    onDoubleClick={() => openDetail(model, 'project')}
                    className="bg-nvidia-gray border border-nvidia-border nvidia-card-hover group cursor-pointer overflow-hidden rounded-sm"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={`https://picsum.photos/seed/project${model.id}/400/225`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-black/20 group-hover:bg-black/0 transition-colors" />
                    </div>
                    <div className="p-4 bg-nvidia-light-gray flex items-center justify-between">
                      <div>
                        <h4 className="font-bold text-sm">{model.name}</h4>
                        <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">{model.algo}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Recent Projects Section */}
            <section>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">最近的项目</h3>
                <button 
                  onClick={() => setActiveTab('models')}
                  className="text-nvidia-green text-xs font-bold hover:underline"
                >
                  查看全部
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {recentProjects.map((project) => (
                  <div key={project.id} className="bg-nvidia-gray border border-nvidia-border p-5 rounded-sm nvidia-card-hover cursor-pointer group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-10 h-10 bg-nvidia-light-gray rounded-sm flex items-center justify-center">
                        {project.type === 'quadruped' && <Bot className="text-nvidia-green w-6 h-6" />}
                        {project.type === 'arm' && <Zap className="text-blue-400 w-6 h-6" />}
                        {project.type === 'drone' && <Mountain className="text-yellow-500 w-6 h-6" />}
                      </div>
                      <span className={cn(
                        "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                        project.status === '训练中' ? "bg-nvidia-green/10 text-nvidia-green border border-nvidia-green/20" :
                        project.status === '已完成' ? "bg-blue-500/10 text-blue-400 border border-blue-500/20" :
                        "bg-gray-500/10 text-gray-400 border border-gray-500/20"
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <h4 className="font-bold mb-4">{project.name}</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest text-gray-500">
                        <span>训练进度</span>
                        <span>{project.progress}%</span>
                      </div>
                      <div className="h-1 bg-nvidia-light-gray rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${project.progress}%` }}
                          className={cn(
                            "h-full transition-all duration-1000",
                            project.status === '训练中' ? "bg-nvidia-green" :
                            project.status === '已完成' ? "bg-blue-500" :
                            "bg-gray-500"
                          )}
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Simulation Section (Active) */}
            <section>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-2xl font-bold">实时仿真演示</h3>
                  <div className="relative">
                    <select 
                      value={currentProject}
                      onChange={(e) => onProjectChange(e.target.value)}
                      className="bg-nvidia-light-gray border border-nvidia-border rounded-sm px-3 py-1 text-xs focus:outline-none focus:border-nvidia-green transition-colors appearance-none pr-8"
                    >
                      {projects.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">
                      <ChevronDown className="w-3 h-3" />
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs text-nvidia-green font-mono">
                  <span className="w-2 h-2 rounded-full bg-nvidia-green animate-pulse" />
                  KERNEL ACTIVE
                </div>
              </div>
              <RLVisualizer3D 
                key={`overview-${currentProject}`}
                initialProjectName={currentProject} 
                projects={projects} 
                onSaveProject={onSaveProject} 
                onSelectProject={onProjectChange}
              />
            </section>
          </motion.div>
        );
      case 'robots':
        return (
          <motion.div 
            key="robots"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">机器人资产库</h2>
                <p className="text-gray-400 text-sm">提供多种预定义的机器人底座与传感器配置。</p>
              </div>
              <button className="nvidia-btn-primary px-6 py-2 flex items-center gap-2">
                <UploadCloud className="w-4 h-4" />
                <span>导入 URDF</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {robots.map((robot) => (
                <AssetCard 
                  key={robot.name} 
                  item={robot} 
                  type="robot"
                  onApply={(item) => handleStartSimulation(item.name)}
                  onAction={handleAction}
                  onViewDetail={(item) => openDetail(item, 'robot')}
                />
              ))}
            </div>
          </motion.div>
        );
      case 'terrains':
        return (
          <motion.div 
            key="terrains"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">地形资产库</h2>
                <p className="text-gray-400 text-sm">从平坦的地面到复杂的工业管道，应有尽有。</p>
              </div>
              <button className="nvidia-btn-primary px-6 py-2 flex items-center gap-2">
                <Mountain className="w-4 h-4" />
                <span>生成随机地形</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {terrains.map((terrain) => (
                <AssetCard 
                  key={terrain.name} 
                  item={terrain} 
                  type="terrain"
                  onApply={(item) => handleStartSimulation(undefined, item.name)}
                  onAction={handleAction}
                  onViewDetail={(item) => openDetail(item, 'terrain')}
                />
              ))}
            </div>
          </motion.div>
        );
      case 'simulation':
        return (
          <motion.div 
            key="simulation"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-6"
          >
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 bg-nvidia-gray/30 border border-nvidia-border p-4 rounded-sm">
              <div className="flex flex-col md:flex-row items-start md:items-center gap-4 w-full lg:w-auto">
                <h2 className="text-xl font-bold whitespace-nowrap">仿真训练中</h2>
                <div className="w-px h-6 bg-nvidia-border hidden md:block" />
                <div className="flex flex-col sm:flex-row flex-wrap items-start sm:items-center gap-4 sm:gap-6">
                  {/* Robot Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">当前加载资产:</span>
                    <div className="relative group">
                      <button className="text-nvidia-green font-mono text-sm flex items-center gap-1 hover:bg-nvidia-green/10 px-2 py-1 rounded-sm transition-colors">
                        {selectedRobot || 'Default Robot'}
                        <MoreVertical className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-nvidia-gray border border-nvidia-border rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {robots.map((r) => (
                          <button key={r.name} onClick={() => setSelectedRobot(r.name)} className={cn("w-full text-left px-4 py-2 text-xs hover:bg-nvidia-light-gray transition-colors", selectedRobot === r.name ? "text-nvidia-green font-bold" : "text-gray-300")}>
                            {r.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-nvidia-border hidden lg:block" />

                  {/* Terrain Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">当前加载地形:</span>
                    <div className="relative group">
                      <button className="text-blue-400 font-mono text-sm flex items-center gap-1 hover:bg-blue-400/10 px-2 py-1 rounded-sm transition-colors">
                        {selectedTerrain || 'Flat Ground'}
                        <MoreVertical className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-nvidia-gray border border-nvidia-border rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {terrains.map((t) => (
                          <button key={t.name} onClick={() => setSelectedTerrain(t.name)} className={cn("w-full text-left px-4 py-2 text-xs hover:bg-nvidia-light-gray transition-colors", selectedTerrain === t.name ? "text-blue-400 font-bold" : "text-gray-300")}>
                            {t.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="w-px h-4 bg-nvidia-border hidden lg:block" />

                  {/* Model Selection */}
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500 text-[10px] uppercase font-bold tracking-wider">当前加载模型:</span>
                    <div className="relative group">
                      <button className="text-yellow-500 font-mono text-sm flex items-center gap-1 hover:bg-yellow-500/10 px-2 py-1 rounded-sm transition-colors">
                        {selectedModel || (currentProject === 'Cruiser-v1' ? 'Cruiser_Policy_v1' : 'PPO_CartPole_v1')}
                        <MoreVertical className="w-3 h-3 rotate-90" />
                      </button>
                      <div className="absolute top-full left-0 mt-1 w-48 bg-nvidia-gray border border-nvidia-border rounded-sm shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50">
                        {models.map((m) => (
                          <button key={m.name} onClick={() => setSelectedModel(m.name)} className={cn("w-full text-left px-4 py-2 text-xs hover:bg-nvidia-light-gray transition-colors", selectedModel === m.name ? "text-yellow-500 font-bold" : "text-gray-300")}>
                            {m.name}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="bg-nvidia-gray border border-nvidia-border px-3 py-1.5 rounded-sm">
                    <p className="text-[8px] text-gray-500 uppercase font-bold">GPU</p>
                    <p className="text-sm font-mono text-nvidia-green">42%</p>
                  </div>
                  <div className="bg-nvidia-gray border border-nvidia-border px-3 py-1.5 rounded-sm">
                    <p className="text-[8px] text-gray-500 uppercase font-bold">FPS</p>
                    <p className="text-sm font-mono text-nvidia-green">120</p>
                  </div>
                </div>
              </div>
            </div>
            <RLVisualizer3D 
              key={`simulation-${currentProject}`}
              initialProjectName={currentProject} 
              projects={projects} 
              onSaveProject={onSaveProject} 
              onSelectProject={onProjectChange}
            />
          </motion.div>
        );
      case 'models':
        return (
          <motion.div 
            key="models"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">项目中心</h2>
                <p className="text-gray-400 text-sm">管理您的训练项目，每个项目包含特定的机器人、地形及多个训练模型。</p>
              </div>
              <button className="nvidia-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                <UploadCloud className="w-4 h-4" />
                新建项目
              </button>
            </div>

            <div className="grid grid-cols-1 gap-8">
              {projectsCenterData.map((project) => (
                <ProjectCenterCard 
                  key={project.id} 
                  project={project} 
                  onAction={handleAction}
                  onModelSelect={(r, t, m) => handleStartSimulation(r, t, m)}
                />
              ))}
            </div>
          </motion.div>
        );
      case 'community':
        const filteredPosts = communityPosts.filter(post => {
          const matchesSearch = post.title.toLowerCase().includes(communitySearch.toLowerCase()) || 
                               post.author.toLowerCase().includes(communitySearch.toLowerCase());
          const matchesFilter = communityFilter === 'all' || post.dataType === communityFilter;
          return matchesSearch && matchesFilter;
        });

        return (
          <motion.div 
            key="community"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-7xl mx-auto space-y-8"
          >
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <h2 className="text-2xl md:text-3xl font-bold">社区分享</h2>
              
              <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                {/* Search Bar */}
                <div className="relative group flex-1 sm:w-64">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-nvidia-green transition-colors" />
                  <input 
                    type="text" 
                    placeholder="搜索项目、作者..." 
                    value={communitySearch}
                    onChange={(e) => setCommunitySearch(e.target.value)}
                    className="w-full bg-nvidia-gray border border-nvidia-border rounded-sm py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-nvidia-green transition-all"
                  />
                </div>

                {/* Filter Icons/Buttons */}
                <div className="flex bg-nvidia-gray border border-nvidia-border rounded-sm p-1">
                  {(['all', 'project', 'robot', 'terrain'] as const).map((filter) => (
                    <button
                      key={filter}
                      onClick={() => setCommunityFilter(filter)}
                      className={cn(
                        "px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest rounded-sm transition-all",
                        communityFilter === filter 
                          ? "bg-nvidia-green text-black" 
                          : "text-gray-500 hover:text-white"
                      )}
                    >
                      {filter === 'all' ? '全部' : 
                       filter === 'project' ? '项目' : 
                       filter === 'robot' ? '机器人' : '地形'}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                {filteredPosts.map((post, i) => (
                  <div 
                    key={i} 
                    onDoubleClick={() => openDetail(post, post.dataType)}
                    className="bg-nvidia-gray border border-nvidia-border rounded-sm overflow-hidden nvidia-card-hover group cursor-pointer"
                  >
                    <div className="aspect-video relative overflow-hidden">
                      <img src={post.img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-nvidia-green/20 border border-nvidia-green flex items-center justify-center text-[10px] font-bold">
                            {post.author[0]}
                          </div>
                          <span className="text-sm font-medium">{post.author}</span>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={cn(
                          "px-2 py-0.5 rounded-full text-[8px] font-bold uppercase tracking-tighter border",
                          post.dataType === 'project' ? "bg-nvidia-green/10 text-nvidia-green border-nvidia-green/20" :
                          post.dataType === 'robot' ? "bg-blue-500/10 text-blue-400 border-blue-500/20" :
                          "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                        )}>
                          {post.dataType}
                        </span>
                      </div>
                      <h4 className="text-lg font-bold mb-4 line-clamp-1">{post.title}</h4>
                      <div className="flex items-center justify-between text-gray-400">
                        <div className="flex items-center gap-4">
                          <span className="flex items-center gap-1 text-xs"><Heart className="w-4 h-4 text-nvidia-green" /> {post.likes}</span>
                          <span className="flex items-center gap-1 text-xs"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                        </div>
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            openDetail(post, post.dataType);
                          }}
                          className="text-nvidia-green hover:underline text-xs font-bold"
                        >
                          查看详情
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center space-y-4 bg-nvidia-gray/20 border border-dashed border-nvidia-border rounded-sm">
                <Search className="w-12 h-12 text-gray-700 mx-auto" />
                <p className="text-gray-500 italic">未找到匹配的结果，请尝试其他关键词...</p>
                <button 
                  onClick={() => { setCommunitySearch(''); setCommunityFilter('all'); }}
                  className="text-nvidia-green text-xs font-bold hover:underline"
                >
                  重置筛选条件
                </button>
              </div>
            )}
          </motion.div>
        );
      case 'settings':
        return (
          <motion.div 
            key="settings"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="max-w-3xl mx-auto space-y-8"
          >
            <h2 className="text-2xl md:text-3xl font-bold">系统配置</h2>
            <div className="space-y-6">
              <div className="bg-nvidia-gray border border-nvidia-border p-4 md:p-6 rounded-sm space-y-4">
                <h4 className="font-bold border-b border-nvidia-border pb-2 mb-4">计算资源</h4>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm text-gray-400">默认 GPU 加速器</span>
                  <span className="text-nvidia-green font-mono text-xs md:text-sm">NVIDIA RTX 4090 (24GB)</span>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm text-gray-400">并行仿真线程</span>
                  <span className="font-mono text-xs md:text-sm">128 Threads</span>
                </div>
              </div>
              <div className="bg-nvidia-gray border border-nvidia-border p-4 md:p-6 rounded-sm space-y-4">
                <h4 className="font-bold border-b border-nvidia-border pb-2 mb-4">存储与同步</h4>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-400">自动保存 Checkpoints</span>
                  <div className="w-10 h-5 bg-nvidia-green rounded-full relative">
                    <div className="absolute right-1 top-1 w-3 h-3 bg-black rounded-full" />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <span className="text-sm text-gray-400">云端同步路径</span>
                  <span className="text-[10px] md:text-xs text-gray-500 font-mono truncate max-w-full">/omni-rl/cloud/backups/</span>
                </div>
              </div>
              <button className="nvidia-btn-primary w-full py-3">保存所有更改</button>
            </div>
          </motion.div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </main>
    </div>
  );
}
