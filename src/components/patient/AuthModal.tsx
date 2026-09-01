import React from 'react';
import { AuthScreen } from './AuthScreen';

interface AuthModalProps {
  onClose: () => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, initialMode = 'login' }) => {
  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-md h-[90vh] sm:h-[820px] rounded-t-[36px] sm:rounded-[36px] shadow-2xl overflow-hidden border border-slate-700/50 flex flex-col bg-slate-900 animate-in slide-in-from-bottom duration-300">
        <AuthScreen
          initialMode={initialMode}
          onClose={onClose}
          onSuccess={onClose}
        />
      </div>
    </div>
  );
};
