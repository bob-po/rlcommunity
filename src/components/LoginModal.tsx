import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Mail, Github, Chrome, LogIn, UserPlus, Loader2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const { loginWithGoogle, loginWithGithub, loginWithEmail } = useAuth();
  const [mode, setMode] = useState<'select' | 'email'>('select');
  const [emailMode, setEmailMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSocialLogin = async (provider: 'google' | 'github') => {
    setLoading(true);
    setError('');
    try {
      if (provider === 'google') await loginWithGoogle();
      else await loginWithGithub();
      onClose();
    } catch (err: any) {
      setError(err.message || '登录失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    setError('');
    try {
      await loginWithEmail(email, password, emailMode === 'register');
      onClose();
    } catch (err: any) {
      setError(err.message || '操作失败，请检查账号密码');
    } finally {
      setLoading(false);
    }
  };

  const resetState = () => {
    setMode('select');
    setEmailMode('login');
    setEmail('');
    setPassword('');
    setError('');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 h-full w-full">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => !loading && onClose()}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md bg-nvidia-gray border border-nvidia-border rounded-sm shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 border-b border-nvidia-border flex items-center justify-between bg-nvidia-light-gray/30">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <LogIn className="w-5 h-5 text-nvidia-green" />
                {mode === 'select' ? '欢迎回来' : emailMode === 'login' ? '邮箱登录' : '创建账号'}
              </h3>
              <button 
                onClick={onClose}
                disabled={loading}
                className="p-1 hover:bg-nvidia-border rounded-sm text-gray-400 hover:text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-8 space-y-6">
              {error && (
                <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-sm text-red-500 text-xs animate-pulse">
                  {error}
                </div>
              )}

              {mode === 'select' ? (
                <div className="space-y-3">
                  <button
                    onClick={() => handleSocialLogin('google')}
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-white text-black font-bold rounded-sm hover:bg-gray-200 transition-colors disabled:opacity-50"
                  >
                    <Chrome className="w-5 h-5" />
                    Google 账号登录
                  </button>
                  <button
                    onClick={() => handleSocialLogin('github')}
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-[#24292e] text-white font-bold rounded-sm hover:bg-[#2c3238] transition-colors disabled:opacity-50"
                  >
                    <Github className="w-5 h-5" />
                    GitHub 账号登录
                  </button>
                  <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-nvidia-border"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-nvidia-gray px-2 text-gray-500 font-bold tracking-widest">或者</span>
                    </div>
                  </div>
                  <button
                    onClick={() => setMode('email')}
                    disabled={loading}
                    className="w-full h-12 flex items-center justify-center gap-3 bg-nvidia-light-gray border border-nvidia-border text-white font-bold rounded-sm hover:bg-nvidia-border transition-colors disabled:opacity-50"
                  >
                    <Mail className="w-5 h-5 text-nvidia-green" />
                    使用邮箱登录
                  </button>
                </div>
              ) : (
                <form onSubmit={handleEmailAuth} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">电子邮箱</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@example.com"
                      className="w-full bg-nvidia-dark border border-nvidia-border rounded-sm px-4 py-3 focus:outline-none focus:border-nvidia-green transition-colors text-sm"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">密码</label>
                    <input
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full bg-nvidia-dark border border-nvidia-border rounded-sm px-4 py-3 focus:outline-none focus:border-nvidia-green transition-colors text-sm"
                    />
                  </div>
                  
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-12 bg-nvidia-green text-black font-bold rounded-sm hover:bg-nvidia-green/90 transition-colors flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      emailMode === 'login' ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />
                    )}
                    {emailMode === 'login' ? '登录' : '注册'}
                  </button>

                  <div className="flex flex-col items-center gap-4 mt-6">
                    <button
                      type="button"
                      onClick={() => setEmailMode(emailMode === 'login' ? 'register' : 'login')}
                      className="text-xs text-gray-400 hover:text-nvidia-green transition-colors underline underline-offset-4"
                    >
                      {emailMode === 'login' ? '还没有账号？立即注册' : '已有账号？返回登录'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setMode('select')}
                      className="text-xs text-gray-500 hover:text-white transition-colors flex items-center gap-1"
                    >
                      返回其他登录方式
                    </button>
                  </div>
                </form>
              )}
            </div>

            <div className="p-4 bg-black/40 text-center">
              <p className="text-[10px] text-gray-500 leading-relaxed uppercase tracking-widest px-8">
                登录即表示您同意我们的服务条款和隐私政策。所有计算由 NVIDIA 虚拟加速核心支持。
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
