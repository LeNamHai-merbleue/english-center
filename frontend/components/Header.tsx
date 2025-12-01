import React from 'react';
import { useState } from 'react';
import { User, LogOut, Settings, UserCircle } from 'lucide-react';

interface HeaderProps {
  onNavigate?: (tab: string) => void;
  onLogout?: (userType: 'user' | 'admin') => void; // Cập nhật để nhận tham số nếu cần
  userType?: 'user' | 'admin';
  userName?: string;  // Thêm prop userName
  userEmail?: string; // Thêm prop userEmail để hiển thị trong menu
}

export function Header({ 
  onNavigate, 
  onLogout, 
  userType = 'admin', 
  userName = 'Người dùng', 
  userEmail = '' 
}: HeaderProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleProfileClick = () => {
    setShowMenu(false);
    if (onNavigate) onNavigate('profile');
  };

  const handleSettingsClick = () => {
    setShowMenu(false);
    if (onNavigate) onNavigate('settings');
  };

  const handleLogout = () => {
    setShowMenu(false);
    if (window.confirm('Bạn có chắc chắn muốn đăng xuất?')) {
      if (onLogout) onLogout(userType);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 h-16 bg-white z-50" style={{ boxShadow: 'var(--shadow-softer)' }}>
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] flex items-center justify-center">
            <span className="text-white font-bold">EC</span>
          </div>
          <span className="text-xl font-semibold text-foreground">English Center</span>
        </div>

        {/* User Avatar & Menu */}
        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="w-10 h-10 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] flex items-center justify-center hover:scale-105 transition-transform shadow-sm"
          >
            <User className="w-5 h-5 text-white" />
          </button>

          {showMenu && (
            <>
              {/* Backdrop */}
              <div className="fixed inset-0 z-40" onClick={() => setShowMenu(false)} />
              
              {/* Menu Dropdown */}
              <div 
                className="absolute right-0 mt-2 w-64 rounded-3xl overflow-hidden z-50 animate-in fade-in zoom-in duration-200"
                style={{
                  background: 'rgba(255, 255, 255, 0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12)',
                  border: '1px solid rgba(255, 140, 66, 0.1)'
                }}
              >
                <div className="p-4">
                  {/* User Info Section */}
                  <div className="flex items-center gap-3 pb-4 border-b border-black/5">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] flex items-center justify-center shrink-0">
                      <User className="w-6 h-6 text-white" />
                    </div>
                    <div className="overflow-hidden">
                      {/* HIỂN THỊ TÊN THẬT TỪ DATABASE */}
                      <div className="font-semibold text-foreground truncate">{userName}</div>
                      {/* HIỂN THỊ EMAIL THẬT TỪ DATABASE */}
                      <div className="text-xs text-muted-foreground truncate">{userEmail}</div>
                      <div className="mt-1">
                         <span className="px-2 py-0.5 rounded-full bg-[#FF8C42]/10 text-[#FF8C42] text-[10px] font-bold uppercase">
                           {userType}
                         </span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 space-y-1">
                    <button 
                      onClick={handleProfileClick} 
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-black/5 transition-colors text-foreground text-sm"
                    >
                      <UserCircle className="w-4 h-4 text-muted-foreground" />
                      <span>Hồ sơ cá nhân</span>
                    </button>
                    <button 
                      onClick={handleSettingsClick} 
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-black/5 transition-colors text-foreground text-sm"
                    >
                      <Settings className="w-4 h-4 text-muted-foreground" />
                      <span>Cài đặt hệ thống</span>
                    </button>
                    <div className="pt-1 mt-1 border-t border-black/5">
                      <button 
                        onClick={handleLogout} 
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl hover:bg-red-50 transition-colors text-[#FF3B30] font-medium text-sm"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Đăng xuất</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}