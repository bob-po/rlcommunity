import React, { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera, Environment, Grid, Float } from '@react-three/drei';
import * as THREE from 'three';
import { Play, Pause, RotateCcw, Zap, Box, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartPoleState {
  x: number;
  x_dot: number;
  theta: number;
  theta_dot: number;
}

function CartPoleScene({ state }: { state: CartPoleState }) {
  const cartRef = useRef<THREE.Group>(null);
  const poleRef = useRef<THREE.Mesh>(null);

  // Constants for visual representation
  const poleLength = 2.0;

  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <spotLight position={[-10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />

      {/* Track */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.26, 0]} receiveShadow>
        <planeGeometry args={[20, 0.5]} />
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

        {/* Pole Pivot */}
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
      </group>

      <Grid 
        infiniteGrid 
        fadeDistance={20} 
        sectionColor="#76B900" 
        sectionThickness={1} 
        cellColor="#2D2D2D" 
        cellSize={1} 
      />
      
      <Environment preset="city" />
    </>
  );
}

export default function RLVisualizer3D() {
  const [state, setState] = useState<CartPoleState>({ x: 0, x_dot: 0, theta: 0.1, theta_dot: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [reward, setReward] = useState(0);
  const [viewMode, setViewMode] = useState<'3d' | '2d'>('3d');

  // Physics constants
  const gravity = 9.8;
  const masscart = 1.0;
  const masspole = 0.1;
  const total_mass = masspole + masscart;
  const length = 0.5;
  const polemass_length = masspole * length;
  const force_mag = 10.0;
  const tau = 0.02;

  const step = (action: number) => {
    const { x, x_dot, theta, theta_dot } = state;
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

    setState({
      x: next_x,
      x_dot: next_x_dot,
      theta: next_theta,
      theta_dot: next_theta_dot
    });

    setSteps(s => s + 1);
    setReward(r => r + 1);

    if (Math.abs(next_x) > 2.4 || Math.abs(next_theta) > 0.209) {
      setIsRunning(false);
    }
  };

  // Simulation loop
  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simple "AI" policy: balance the pole
      const action = state.theta > 0 ? 1 : 0;
      step(action);
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning, state]);

  const reset = () => {
    setState({ x: 0, x_dot: 0, theta: (Math.random() - 0.5) * 0.1, theta_dot: 0 });
    setSteps(0);
    setReward(0);
    setIsRunning(false);
  };

  return (
    <div className="flex flex-col gap-4 bg-nvidia-gray border border-nvidia-border rounded-sm p-4 md:p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Environment</span>
            <span className="text-base md:text-lg font-bold">CartPole-v1</span>
          </div>
        </div>
        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar pb-1 sm:pb-0">
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
            重置
          </Button>
          <Button 
            onClick={() => setIsRunning(!isRunning)}
            className="nvidia-btn-primary h-8 px-4 md:px-6 shrink-0 text-[10px] md:text-xs"
          >
            {isRunning ? '暂停' : '开始'}
          </Button>
        </div>
      </div>

      <div className="relative h-[300px] md:h-[500px] w-full bg-black rounded-sm overflow-hidden border border-nvidia-border group">
        <Canvas shadows>
          <PerspectiveCamera 
            makeDefault 
            position={viewMode === '3d' ? [5, 3, 8] : [0, 1, 10]} 
            fov={45} 
          />
          <CartPoleScene state={state} />
          <OrbitControls 
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

        {!isRunning && steps > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-10">
            <div className="text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Episode Finished</h3>
              <Button onClick={reset} className="nvidia-btn-primary">
                Try Again
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Wrapper to provide useFrame context
export function RLVisualizer3DWrapper() {
  return (
    <div className="w-full">
      <RLVisualizer3D />
    </div>
  );
}
