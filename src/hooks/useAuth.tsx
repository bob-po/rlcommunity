import React, { useState, useEffect, createContext, useContext, ReactNode } from 'react';
import { auth, onAuthStateChanged, User, signInWithPopup, googleProvider, githubProvider, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from '@/lib/firebase';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: () => void;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  loginWithEmail: (email: string, pass: string, isRegister?: boolean) => Promise<void>;
  logout: () => Promise<void>;
  isLoginModalOpen: boolean;
  setLoginModalOpen: (open: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const login = () => setLoginModalOpen(true);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google login failed", error);
      throw error;
    }
  };

  const loginWithGithub = async () => {
    try {
      await signInWithPopup(auth, githubProvider);
    } catch (error) {
      console.error("Github login failed", error);
      throw error;
    }
  };

  const loginWithEmail = async (email: string, pass: string, isRegister: boolean = false) => {
    try {
      if (isRegister) {
        await createUserWithEmailAndPassword(auth, email, pass);
      } else {
        await signInWithEmailAndPassword(auth, email, pass);
      }
    } catch (error) {
      console.error("Email login failed", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      login,
      loginWithGoogle, 
      loginWithGithub, 
      loginWithEmail, 
      logout,
      isLoginModalOpen,
      setLoginModalOpen
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
