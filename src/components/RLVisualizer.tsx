import { useEffect, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Play, Pause, RotateCcw, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface CartPoleState {
  x: number;
  x_dot: number;
  theta: number;
  theta_dot: number;
}

export default function RLVisualizer() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<CartPoleState>({ x: 0, x_dot: 0, theta: 0.1, theta_dot: 0 });
  const [isRunning, setIsRunning] = useState(false);
  const [steps, setSteps] = useState(0);
  const [reward, setReward] = useState(0);

  // Constants for CartPole physics
  const gravity = 9.8;
  const masscart = 1.0;
  const masspole = 0.1;
  const total_mass = masspole + masscart;
  const length = 0.5; // actually half the pole's length
  const polemass_length = masspole * length;
  const force_mag = 10.0;
  const tau = 0.02; // seconds between state updates

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

    // Check if failed
    if (Math.abs(next_x) > 2.4 || Math.abs(next_theta) > 0.209) {
      setIsRunning(false);
    }
  };

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      // Simple "AI" policy: balance the pole
      const action = state.theta > 0 ? 1 : 0;
      step(action);
    }, 20);

    return () => clearInterval(interval);
  }, [isRunning, state]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Drawing logic
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    const worldWidth = 4.8;
    const scale = canvas.width / worldWidth;
    const cartWidth = 50;
    const cartHeight = 30;
    
    const centerX = canvas.width / 2 + state.x * scale;
    const centerY = canvas.height - 100;

    // Draw track
    ctx.strokeStyle = '#2D2D2D';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, centerY + cartHeight / 2);
    ctx.lineTo(canvas.width, centerY + cartHeight / 2);
    ctx.stroke();

    // Draw cart
    ctx.fillStyle = '#76B900';
    ctx.fillRect(centerX - cartWidth / 2, centerY - cartHeight / 2, cartWidth, cartHeight);

    // Draw pole
    const poleLen = 100;
    const poleX = centerX + Math.sin(state.theta) * poleLen;
    const poleY = centerY - Math.cos(state.theta) * poleLen;

    ctx.strokeStyle = '#FFFFFF';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(poleX, poleY);
    ctx.stroke();

    // Draw pivot
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    ctx.arc(centerX, centerY, 4, 0, Math.PI * 2);
    ctx.fill();

  }, [state]);

  const reset = () => {
    setState({ x: 0, x_dot: 0, theta: (Math.random() - 0.5) * 0.1, theta_dot: 0 });
    setSteps(0);
    setReward(0);
    setIsRunning(false);
  };

  return (
    <Card className="nvidia-card overflow-hidden">
      <CardHeader className="border-b border-nvidia-light-gray flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-nvidia-green flex items-center gap-2">
            <Zap className="w-5 h-5" />
            CartPole-v1 Simulation
          </CardTitle>
          <p className="text-sm text-gray-400">NVIDIA Isaac Gym Style Visualization</p>
        </div>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="icon" 
            className="border-nvidia-light-gray hover:bg-nvidia-light-gray"
            onClick={() => setIsRunning(!isRunning)}
          >
            {isRunning ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </Button>
          <Button 
            variant="outline" 
            size="icon" 
            className="border-nvidia-light-gray hover:bg-nvidia-light-gray"
            onClick={reset}
          >
            <RotateCcw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0 bg-black relative">
        <canvas 
          ref={canvasRef} 
          width={800} 
          height={400} 
          className="w-full h-auto"
        />
        <div className="absolute top-4 left-4 flex gap-4">
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-nvidia-light-gray">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Steps</p>
            <p className="text-xl font-mono text-nvidia-green">{steps}</p>
          </div>
          <div className="bg-black/60 backdrop-blur-md p-3 rounded-lg border border-nvidia-light-gray">
            <p className="text-[10px] uppercase tracking-wider text-gray-500 font-mono">Reward</p>
            <p className="text-xl font-mono text-nvidia-green">{reward.toFixed(0)}</p>
          </div>
        </div>
        {!isRunning && steps > 0 && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center"
            >
              <h3 className="text-2xl font-bold text-white mb-2">Episode Finished</h3>
              <Button onClick={reset} className="bg-nvidia-green hover:bg-nvidia-green/80 text-black font-bold">
                Try Again
              </Button>
            </motion.div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
