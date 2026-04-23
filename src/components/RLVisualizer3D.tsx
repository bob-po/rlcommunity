import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Zap, Box, Layers, Save, ChevronDown, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface CartPoleState {
  x: number;
  x_dot: number;
  theta: number;
  theta_dot: number;
}

function CartPoleScene({ state, viewMode }: { state: CartPoleState, viewMode: '3d' | '2d' }) {
  const cartRef = useRef<THREE.Group>(null);
  const poleRef = useRef<THREE.Mesh>(null);
  const { camera } = useThree();

  useFrame((_, delta) => {
    // Smooth camera follow without using lastX delta calculation which can jitter
    const lerpFactor = 0.1; 
    const targetCamX = viewMode === '3d' ? state.x + 5 : state.x;
    camera.position.x = THREE.MathUtils.lerp(camera.position.x, targetCamX, lerpFactor);
  });

  // Constants for visual representation
  const poleLength = 2.0;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[state.x + 10, 10, 10]} intensity={1} />
      <spotLight position={[state.x - 10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

      {/* Track - long and static to show relative motion */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]} receiveShadow>
        <planeGeometry args={[5000, 0.5]} />
        <meshStandardMaterial color="#1A1A1A" />
      </mesh>

      {/* Cart */}
      <group position={[state.x, 0, 0]} ref={cartRef}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[0.6, 0.3, 0.4]} />
          <meshStandardMaterial color="#76B900" emissive="#76B900" emissiveIntensity={0.2} />
        </mesh>
        
        {/* Wheels */}
        <mesh position={[-0.2, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.2, -0.2, 0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-0.2, -0.2, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.2, -0.2, -0.2]} rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.05, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>

        {/* Pole Pivot - Only show if not Cruiser */}
        {state.theta !== -999 && (
          <group rotation={[0, 0, state.theta]}>
            <mesh position={[0, poleLength / 2, 0]} castShadow ref={poleRef}>
              <cylinderGeometry args={[0.04, 0.04, poleLength, 16]} />
              <meshStandardMaterial color="#FFFFFF" />
            </mesh>
            {/* Joint */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.06, 0.06, 0.45, 16]} />
              <meshStandardMaterial color="#888" />
            </mesh>
          </group>
        )}
      </group>

      <Grid 
        infiniteGrid 
        fadeDistance={300} 
        sectionColor="#76B900" 
        sectionThickness={1} 
        cellColor="#2D2D2D" 
        cellSize={1} 
      />
      
      <Environment preset="city" />
    </>
  );
}

interface RLVisualizer3DProps {
  initialProjectName?: string;
  projects?: string[];
  onSaveProject?: (name: string) => void;
  onSelectProject?: (name: string) => void;
}

export default function RLVisualizer3D({ 
  initialProjectName = 'Cruiser-v1',
  projects = [],
  onSaveProject,
  onSelectProject
}: RLVisualizer3DProps) {
  const [projectName, setProjectName] = useState(initialProjectName);
  const [isEditingProject, setIsEditingProject] = useState(false);
  const [isManualEditing, setIsManualEditing] = useState(false);
  const [isCanvasLoaded, setIsCanvasLoaded] = useState(false);
  const [isContextLost, setIsContextLost] = useState(false);
  
  // Long press for editing project name
  const [longPressProgress, setLongPressProgress] = useState(0);
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);
  const progressTimer = useRef<NodeJS.Timeout | null>(null);
  
  const handleLongPressStart = () => {
    if (isManualEditing) return;
    
    setLongPressProgress(0);
    const startTime = Date.now();
    const duration = 800; // 0.8s
    
    progressTimer.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);
      setLongPressProgress(progress);
      
      if (progress >= 100) {
        if (progressTimer.current) clearInterval(progressTimer.current);
      }
    }, 16);
    
    longPressTimer.current = setTimeout(() => {
      setIsEditingProject(true);
      setLongPressProgress(0);
      if (progressTimer.current) clearInterval(progressTimer.current);
    }, duration);
  };
  
  const handleLongPressEnd = () => {
    if (longPressTimer.current) clearTimeout(longPressTimer.current);
    if (progressTimer.current) clearInterval(progressTimer.current);
    setLongPressProgress(0);
  };

  const [state, setState] = useState<CartPoleState>(() => ({
    x: 0,
    x_dot: 0,
    theta: initialProjectName === 'Cruiser-v1' ? -999 : 0.1,
    theta_dot: 0
  }));
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [reward, setReward] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsEditingProject(false);
        setIsManualEditing(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    setProjectName(initialProjectName);
  }, [initialProjectName]);

  // Physics constants
  const gravity = 9.8;
  const masscart = 1.0;
  const masspole = 0.1;
  const total_mass = masspole + masscart;
  const length = 0.5;
  const polemass_length = masspole * length;
  const force_mag = 10.0;
  const tau = 0.02;

  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const projectNameRef = useRef(projectName);

  useEffect(() => {
    projectNameRef.current = projectName;
  }, [projectName]);

  const step = () => {
    setState(prev => {
      const { x, x_dot, theta, theta_dot } = prev;
      const currentProject = projectNameRef.current;
      
      // Cruiser logic: constant forward force, no theta updates
      if (currentProject === 'Cruiser-v1') {
        const cruiserForce = 0.8; 
        const maxSpeed = 3.5; 
        
        let next_x_dot = x_dot + tau * (cruiserForce / masscart);
        if (next_x_dot > maxSpeed) next_x_dot = maxSpeed;
        
        const next_x = x + tau * next_x_dot;
        
        setSteps(s => s + 1);
        setReward(r => r + 1);

        return {
          x: next_x,
          x_dot: next_x_dot,
          theta: -999, 
          theta_dot: 0
        };
      }

      // Simple "AI" policy: balance the pole
      const action = theta > 0 ? 1 : 0;
      const force = action === 1 ? force_mag : -force_mag;
      const costheta = Math.cos(theta);
      const sintheta = Math.sin(theta);

      const temp = (force + polemass_length * theta_dot * theta_dot * sintheta) / total_mass;
      const thetaacc = (gravity * sintheta - costheta * temp) / (length * (4.0 / 3.0 - masspole * costheta * costheta / total_mass));
      const xacc = temp - polemass_length * thetaacc * costheta / total_mass;

      const next_x = x + tau * x_dot;
      const next_x_dot = x_dot + tau * xacc;
      const next_theta = theta + tau * theta_dot;
      const next_theta_dot = theta_dot + tau * thetaacc;

      setSteps(s => s + 1);
      setReward(r => r + 1);

      return {
        x: next_x,
        x_dot: next_x_dot,
        theta: next_theta,
        theta_dot: next_theta_dot
      };
    });
  };

  // Termination check effect
  useEffect(() => {
    if (!isRunning) return;
    
    const isCruiser = projectName === 'Cruiser-v1';
    if (isCruiser) {
      if (Math.abs(state.x) > 2000) setIsRunning(false);
    } else {
      if (Math.abs(state.x) > 2.4 || Math.abs(state.theta) > 0.209) {
        setIsRunning(false);
      }
    }
  }, [state.x, state.theta, isRunning, projectName]);

  // Simulation loop
  useEffect(() => {
    if (isRunning) {
      intervalRef.current = setInterval(step, 20);
    } else {
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [isRunning]);

  const reset = () => {
    if (projectName === 'Cruiser-v1') {
      setState({ x: 0, x_dot: 0, theta: -999, theta_dot: 0 });
    } else {
      setState({ x: 0, x_dot: 0, theta: (Math.random() - 0.5) * 0.1, theta_dot: 0 });
    }
    setSteps(0);
    setReward(0);
    setIsRunning(false);
  };

  // Initialize state based on project
  useEffect(() => {
    if (projectName === 'Cruiser-v1') {
      setState({ x: 0, x_dot: 0, theta: -999, theta_dot: 0 });
    } else {
      setState({ x: 0, x_dot: 0, theta: 0.1, theta_dot: 0 });
    }
  }, [projectName]);

  return (
    <div className="flex flex-col gap-4 bg-nvidia-gray border border-nvidia-border rounded-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col relative" ref={dropdownRef}>
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Environment</span>
            <div 
              className="flex items-center gap-1 cursor-pointer select-none group min-h-[28px]"
            >
              {isManualEditing ? (
                <input
                  autoFocus
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  onBlur={() => setIsManualEditing(false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      setIsManualEditing(false);
                      setIsEditingProject(false);
                    }
                  }}
                  className="bg-nvidia-dark border-b border-nvidia-green text-base md:text-lg font-bold outline-none text-white w-full max-w-[200px]"
                />
              ) : (
                <div 
                  className="relative flex flex-col"
                  onMouseDown={handleLongPressStart}
                  onMouseUp={handleLongPressEnd}
                  onMouseLeave={handleLongPressEnd}
                  onTouchStart={handleLongPressStart}
                  onTouchEnd={handleLongPressEnd}
                  onDoubleClick={() => setIsEditingProject(true)}
                >
                  <span 
                    onClick={() => {
                      if (isEditingProject) setIsManualEditing(true);
                    }}
                    className={cn(
                      "text-base md:text-lg font-bold transition-colors",
                      isEditingProject ? "text-nvidia-green" : "group-hover:text-nvidia-green"
                    )}
                  >
                    {projectName}
                  </span>
                  {longPressProgress > 0 && (
                    <div className="absolute -bottom-1 left-0 h-0.5 bg-nvidia-green transition-all" style={{ width: `${longPressProgress}%` }} />
                  )}
                </div>
              )}
              
              {isEditingProject && (
                <div className="absolute top-10 left-0 z-[60] w-48 bg-nvidia-dark border border-nvidia-border rounded-sm shadow-xl overflow-hidden animate-in fade-in zoom-in duration-200">
                  {projects.map(opt => (
                    <button
                      key={opt}
                      onClick={() => {
                        setProjectName(opt);
                        if (onSelectProject) onSelectProject(opt);
                        setIsEditingProject(false);
                        setIsManualEditing(false);
                      }}
                      className={cn(
                        "w-full text-left px-4 py-2 text-xs hover:bg-nvidia-green/10 hover:text-white transition-colors",
                        projectName === opt ? "text-nvidia-green bg-nvidia-green/5" : "text-gray-400"
                      )}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => {
              if (onSaveProject) {
                onSaveProject(projectName);
                setIsEditingProject(false);
                setIsManualEditing(false);
              }
            }}
            className="bg-nvidia-light-gray border-nvidia-border hover:bg-nvidia-border hover:text-white text-gray-300 text-[10px] md:text-xs h-8 px-3 md:px-4 shrink-0"
          >
            <Save className="w-3 h-3 md:w-4 md:h-4 mr-1 md:mr-2" />
            保存项目
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setViewMode(viewMode === '3d' ? '2d' : '3d')}
            className="bg-nvidia-light-gray border-nvidia-border hover:bg-nvidia-border hover:text-white text-gray-300 text-[10px] md:text-xs h-8 px-3 md:px-4 shrink-0"
          >
            {viewMode === '3d' ? '切换 2D' : '切换 3D'}
          </Button>
          <Button 
            variant="outline" 
            size="sm"
            onClick={reset}
            className="bg-nvidia-light-gray border-nvidia-border hover:bg-nvidia-border hover:text-white text-gray-300 text-[10px] md:text-xs h-8 px-3 md:px-4 shrink-0"
          >
            重新开始
          </Button>
          <Button 
            onClick={() => setIsRunning(!isRunning)}
            className="nvidia-btn-primary h-8 px-4 md:px-6 shrink-0 text-[10px] md:text-xs"
          >
            {isRunning ? '暂停' : (steps > 0 ? '继续' : '开始')}
          </Button>
        </div>
      </div>

      <div className="relative h-[300px] md:h-[500px] w-full bg-black rounded-sm overflow-hidden border border-nvidia-border group">
        {!isCanvasLoaded && !isContextLost && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-nvidia-dark animate-pulse">
            <Zap className="w-8 h-8 text-nvidia-green mb-2 animate-bounce" />
            <span className="text-nvidia-green font-mono text-[10px] uppercase tracking-widest">
              Initializing Engine...
            </span>
          </div>
        )}

        {isContextLost && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center bg-black/80 backdrop-blur-md">
            <AlertTriangle className="w-10 h-10 text-yellow-500 mb-2" />
            <p className="text-white text-sm font-bold mb-1">WebGL 上下文丢失</p>
            <p className="text-gray-400 text-xs mb-4 text-center px-6">GPU 资源紧张或设备休眠导致，请尝试刷新页面。</p>
            <Button onClick={() => window.location.reload()} className="nvidia-btn-primary h-8 px-4 text-xs font-bold">
              刷新页面
            </Button>
          </div>
        )}
        
        <Canvas 
          shadows={{ type: 1 }} // Use PCFShadowMap explicitly to avoid deprecation warning
          onCreated={(state) => {
            setIsCanvasLoaded(true);
            const gl = state.gl.getContext();
            const handleContextLost = (e: Event) => {
              e.preventDefault();
              setIsContextLost(true);
              setIsRunning(false);
            };
            gl.canvas.addEventListener('webglcontextlost', handleContextLost, false);
          }}
          gl={{ 
            antialias: true, 
            powerPreference: "high-performance",
            preserveDrawingBuffer: true
          }}
        >
          <PerspectiveCamera 
            makeDefault 
            position={viewMode === '3d' ? [5, 3, 8] : [0, 1, 10]} 
            fov={45} 
          />
          <CartPoleScene state={state} viewMode={viewMode} />
          <OrbitControls 
            makeDefault
            target={[state.x, 0, 0]}
            enablePan={viewMode === '3d'} 
            enableZoom={true} 
            minPolarAngle={0} 
            maxPolarAngle={Math.PI / 2.1} 
          />
        </Canvas>

        {/* Overlay Stats */}
        <div className="absolute top-2 md:top-4 left-2 md:left-4 flex flex-col gap-2 pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md border border-nvidia-border p-2 md:p-3 rounded-sm min-w-[100px] md:min-w-[140px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold">Steps</span>
              <span className="text-xs md:text-sm font-mono text-nvidia-green">{steps}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold">Reward</span>
              <span className="text-xs md:text-sm font-mono text-nvidia-green">{reward.toFixed(0)}</span>
            </div>
          </div>
          
          <div className="bg-black/60 backdrop-blur-md border border-nvidia-border p-2 md:p-3 rounded-sm min-w-[100px] md:min-w-[140px]">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold">Theta</span>
              <span className="text-xs md:text-sm font-mono text-white">{(state.theta * 180 / Math.PI).toFixed(2)}°</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[8px] md:text-[10px] text-gray-400 uppercase font-bold">Position</span>
              <span className="text-xs md:text-sm font-mono text-white">{state.x.toFixed(2)}m</span>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-4 right-4 text-[10px] text-gray-500 font-mono">
          NVIDIA OMNIRL KERNEL v1.0.4
        </div>
      </div>
    </div>
  );
}

// Default export remains as RLVisualizer3D
