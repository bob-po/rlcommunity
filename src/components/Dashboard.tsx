import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Brain, Mountain, Bot, Zap, Heart, MessageCircle, UploadCloud, MoreVertical } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import AssetCard from './AssetCard';
import RLVisualizer3D from './RLVisualizer3D';

interface DashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isGuest: boolean;
  setIsGuest: (v: boolean) => void;
}

const tabTitles: Record<string, string> = {
  'home': '系统概览',
  'robots': '机器人资产',
  'terrains': '地形库',
  'models': '模型库',
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

export default function Dashboard({ activeTab, setActiveTab, isGuest, setIsGuest }: DashboardProps) {
  const { user, login } = useAuth();
  const [selectedRobot, setSelectedRobot] = useState<string | null>(null);
  const [selectedTerrain, setSelectedTerrain] = useState<string | null>(null);
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const handleStartSimulation = (robot?: string, terrain?: string, model?: string) => {
    if (robot) setSelectedRobot(robot);
    if (terrain) setSelectedTerrain(terrain);
    if (model) setSelectedModel(model);
    setActiveTab('simulation');
  };

  const handleAction = (action: string, item: any) => {
    console.log(`Action: ${action} on ${item.name}`);
  };

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
          <div className="space-y-12 max-w-7xl mx-auto">
            {/* Hero Section */}
            <section className="relative min-h-[300px] md:h-[380px] rounded-sm overflow-hidden bg-[#0a0a0a] border border-nvidia-border group flex flex-col md:flex-row">
              <div className="flex-1 flex flex-col justify-center p-6 md:p-12 z-20">
                <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight tracking-tight">OmniRL Training Ready</h2>
                <p className="text-gray-400 text-sm md:text-base lg:text-lg mb-8 max-w-md">
                  Get your reinforcement learning models ready for the most complex simulation environments.
                </p>
                <div className="flex items-center gap-6 mb-8 md:mb-16">
                  <button 
                    onClick={() => handleStartSimulation()}
                    className="nvidia-btn-primary px-8 py-3 w-full md:w-auto"
                  >
                    开始训练
                  </button>
                </div>
                
                <div className="absolute bottom-8 left-12 flex gap-2">
                  <div className="w-8 h-1 bg-gray-700 rounded-full" />
                  <div className="w-8 h-1 bg-gray-700 rounded-full" />
                  <div className="w-8 h-1 bg-nvidia-green rounded-full" />
                </div>
              </div>
              
              <div className="flex-1 relative hidden md:flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#0a0a0a] z-10" />
                <div className="relative z-0 w-full h-full flex items-center justify-center">
                  <div className="w-64 h-64 bg-nvidia-green/10 rounded-full flex items-center justify-center animate-pulse">
                    <div className="w-48 h-48 bg-nvidia-green/20 rounded-full flex items-center justify-center">
                      <div className="w-32 h-32 bg-nvidia-green rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(118,185,0,0.6)]">
                        <Brain className="text-black w-16 h-16" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Library Section */}
            <section>
              <h3 className="text-2xl font-bold mb-6">推荐项目</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {models.map((model) => (
                  <div key={model.id} className="bg-nvidia-gray border border-nvidia-border nvidia-card-hover group cursor-pointer overflow-hidden rounded-sm">
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
                <button className="text-nvidia-green text-xs font-bold hover:underline">查看全部</button>
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold">实时仿真演示</h3>
                <div className="flex items-center gap-2 text-xs text-nvidia-green font-mono">
                  <span className="w-2 h-2 rounded-full bg-nvidia-green animate-pulse" />
                  KERNEL ACTIVE
                </div>
              </div>
              <RLVisualizer3D />
            </section>
          </div>
        );
      case 'robots':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">机器人资产库</h2>
                <p className="text-gray-400 text-sm">双击应用资产，长按进行管理。</p>
              </div>
              <button className="nvidia-btn-primary w-full sm:w-auto">导入新模型</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {robots.map((robot, i) => (
                <AssetCard 
                  key={i} 
                  item={robot} 
                  type="robot" 
                  onApply={(r) => handleStartSimulation(r.name)} 
                  onAction={handleAction} 
                />
              ))}
            </div>
          </div>
        );
      case 'terrains':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">地形资产库</h2>
                <p className="text-gray-400 text-sm">双击应用地形，长按进行管理。</p>
              </div>
              <button className="nvidia-btn-primary w-full sm:w-auto">导入新地形</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {terrains.map((terrain, i) => (
                <AssetCard 
                  key={i} 
                  item={terrain} 
                  type="terrain" 
                  onApply={(t) => handleStartSimulation(undefined, t.name)} 
                  onAction={handleAction} 
                />
              ))}
            </div>
          </div>
        );
      case 'simulation':
        return (
          <div className="max-w-7xl mx-auto space-y-6">
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
                        {selectedModel || 'PPO_CartPole_v1'}
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
            <RLVisualizer3D />
          </div>
        );
      case 'models':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold mb-2">模型库</h2>
                <p className="text-gray-400 text-sm">双击应用模型，长按进行管理。</p>
              </div>
              <button className="nvidia-btn-primary flex items-center justify-center gap-2 w-full sm:w-auto">
                <UploadCloud className="w-4 h-4" />
                上传新模型
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {models.map((m, i) => (
                <AssetCard 
                  key={i} 
                  item={m} 
                  type="model" 
                  onApply={(mod) => handleStartSimulation(undefined, undefined, mod.name)} 
                  onAction={handleAction} 
                />
              ))}
            </div>
          </div>
        );
      case 'community':
        return (
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h2 className="text-2xl md:text-3xl font-bold">社区分享</h2>
              <div className="flex gap-2 w-full sm:w-auto">
                <button className="flex-1 sm:flex-none bg-nvidia-light-gray px-4 py-2 text-xs font-bold border border-nvidia-border hover:bg-nvidia-border transition-colors">最新发布</button>
                <button className="flex-1 sm:flex-none bg-nvidia-green text-black px-4 py-2 text-xs font-bold hover:bg-nvidia-green/90 transition-colors">热门推荐</button>
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {[
                { title: '多足机器人复杂地形穿越', author: 'RL_Master', likes: 1204, comments: 89, img: 'https://picsum.photos/seed/share1/600/400' },
                { title: '基于 PPO 的无人机避障模型', author: 'DroneTech', likes: 856, comments: 42, img: 'https://picsum.photos/seed/share2/600/400' },
                { title: '机械臂精准抓取与放置', author: 'RobotArm_Dev', likes: 2341, comments: 156, img: 'https://picsum.photos/seed/share3/600/400' },
              ].map((post, i) => (
                <div key={i} className="bg-nvidia-gray border border-nvidia-border rounded-sm overflow-hidden nvidia-card-hover group">
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
                    <h4 className="text-lg font-bold mb-4 line-clamp-1">{post.title}</h4>
                    <div className="flex items-center justify-between text-gray-400">
                      <div className="flex items-center gap-4">
                        <span className="flex items-center gap-1 text-xs"><Heart className="w-4 h-4 text-nvidia-green" /> {post.likes}</span>
                        <span className="flex items-center gap-1 text-xs"><MessageCircle className="w-4 h-4" /> {post.comments}</span>
                      </div>
                      <button className="text-nvidia-green hover:underline text-xs font-bold">查看详情</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      case 'settings':
        return (
          <div className="max-w-3xl mx-auto space-y-8">
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
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <main className="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar">
        {renderContent()}
      </main>
    </div>
  );
}
