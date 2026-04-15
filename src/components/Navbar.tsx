import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { LogIn, LogOut, User as UserIcon, Share2, MessageSquare } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface NavbarProps {
  title: string;
}

export default function Navbar({ title }: NavbarProps) {
  const { user, login, logout } = useAuth();

  return (
    <header className="h-14 bg-nvidia-dark border-b border-nvidia-border flex items-center justify-between px-6 z-40">
      <h1 className="text-lg md:text-xl font-medium text-white truncate max-w-[150px] md:max-w-none">{title}</h1>

      <div className="flex items-center gap-3 md:gap-6">
        <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
          <Share2 className="w-5 h-5" />
        </button>
        <button className="text-gray-400 hover:text-white transition-colors hidden sm:block">
          <MessageSquare className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-2 md:gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="flex items-center gap-2 cursor-pointer group">
                  <div className="h-8 w-8 rounded-full border border-nvidia-border p-0 overflow-hidden group-hover:border-nvidia-green transition-colors">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName || ''} className="h-full w-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <UserIcon className="h-5 w-5 m-1.5 text-gray-400" />
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-300 group-hover:text-white hidden sm:inline-block">{user.displayName || '用户'}</span>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 bg-nvidia-gray border-nvidia-border text-white">
                <DropdownMenuLabel>
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user.displayName}</p>
                    <p className="text-xs leading-none text-gray-400">{user.email}</p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-nvidia-border" />
                <DropdownMenuItem onClick={logout} className="text-red-400 focus:bg-red-400/10 focus:text-red-400 cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>退出登录</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <button 
              onClick={login}
              className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors"
            >
              <UserIcon className="w-5 h-5" />
              <span className="text-sm font-medium">登录</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
