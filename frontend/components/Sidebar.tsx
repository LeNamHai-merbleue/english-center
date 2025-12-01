import React from 'react';
import { LayoutDashboard, Users, GraduationCap, FileText, DollarSign, UserCheck, Briefcase, Calendar } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'schedule', icon: Calendar, label: 'Lịch trình' },
    { id: 'posts', icon: FileText, label: 'Bài đăng' },
    { id: 'classes', icon: GraduationCap, label: 'Quản lý lớp' },
    { id: 'students', icon: UserCheck, label: 'Học viên' },
    { id: 'staff', icon: Briefcase, label: 'Nhân sự' },
    { id: 'tuition', icon: DollarSign, label: 'Học phí' },
  ];

  return (
    <aside 
      className="fixed left-4 top-20 bottom-4 w-20 bg-white rounded-3xl p-4 flex flex-col items-center gap-6 z-40"
      style={{ boxShadow: 'var(--shadow-float)' }}
    >
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeTab === item.id;
        
        return (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className="relative group"
            title={item.label}
          >
            {/* Pill Background */}
            {isActive && (
              <div 
                className="absolute inset-0 bg-[#FF8C42] rounded-2xl"
                style={{
                  transform: 'scale(1.2)',
                  zIndex: -1,
                }}
              />
            )}
            
            {/* Icon */}
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all
              ${isActive 
                ? 'text-white' 
                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
              }
            `}>
              <Icon className="w-6 h-6" />
            </div>
            
            {/* Tooltip */}
            <div className="absolute left-full ml-4 px-3 py-2 bg-foreground text-white rounded-xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
              {item.label}
            </div>
          </button>
        );
      })}
    </aside>
  );
}