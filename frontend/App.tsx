import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';
import { ClassManagement } from './components/ClassManagement';
import { StaffManagement } from './components/StaffManagement';
import { StudentManagement } from './components/StudentManagement';
import { Posts } from './components/Posts';
import { TuitionManagement } from './components/TuitionManagement';
import { ScheduleEvents } from './components/ScheduleEvents';
import { Profile } from './components/Profile';
import { Settings } from './components/Settings';
import { Login } from './components/Login';
import { Register } from './components/Register';
import { logout } from './api/authApi';

export default function App() {
  // --- STATES QUẢN LÝ ĐĂNG NHẬP ---
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [userType, setUserType] = useState<'user' | 'admin'>('admin');
  
  // Thông tin người dùng hiển thị trên UI
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    centerId: ''
  });

  // --- STATES QUẢN LÝ ĐIỀU HƯỚNG ---
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showRegister, setShowRegister] = useState(false);

  // --- 1. KHỞI TẠO ỨNG DỤNG (CHECK SESSION) ---
  useEffect(() => {
    const initializeAuth = () => {
      const token = localStorage.getItem('admin_token');
      const role = localStorage.getItem('user_role');
      const name = localStorage.getItem('admin_name');
      const email = localStorage.getItem('admin_email');
      const centerId = localStorage.getItem('center_id');

      if (token) {
        setIsAuthenticated(true);
        setUserType(role === 'ADMIN' ? 'admin' : 'user');
        setUserInfo({
          name: name || 'Quản trị viên',
          email: email || '',
          centerId: centerId || ''
        });
      }
      setIsInitializing(false);
    };

    initializeAuth();

    // Lắng nghe sự kiện Logout từ hệ thống (ví dụ khi Token hết hạn ở các file API khác)
    const handleGlobalLogout = () => handleLogout();
    window.addEventListener('force-logout', handleGlobalLogout);
    
    return () => window.removeEventListener('force-logout', handleGlobalLogout);
  }, []);

  // --- 2. CÁC HÀM XỬ LÝ SỰ KIỆN ---
  const handleLogin = (type: 'user' | 'admin') => {
    // Sau khi Login thành công, cập nhật lại state từ LocalStorage
    setUserInfo({
      name: localStorage.getItem('admin_name') || '',
      email: localStorage.getItem('admin_email') || '',
      centerId: localStorage.getItem('center_id') || ''
    });
    setUserType(type);
    setIsAuthenticated(true);
    setActiveTab('dashboard');
    setShowRegister(false);
  };

  const handleLogout = () => {
    logout(); // Hàm xóa sạch localStorage từ authApi.js
    setIsAuthenticated(false);
    setUserInfo({ name: '', email: '', centerId: '' });
    setActiveTab('dashboard');
    setShowRegister(false);
  };

  const handleRegisterSuccess = () => {
    setShowRegister(false); // Quay lại trang Login để người dùng đăng nhập tài khoản vừa tạo
  };

  // --- 3. RENDER LOGIC ---
  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'classes': return <ClassManagement />;
      case 'students': return <StudentManagement />;
      case 'staff': return <StaffManagement />;
      case 'tuition': return <TuitionManagement />;
      case 'posts': return <Posts />;
      case 'schedule': return <ScheduleEvents />;
      case 'profile': return <Profile />;
      case 'settings': return <Settings />;
      default: return <Dashboard />;
    }
  };

  // Màn hình Splash khi đang check token
  if (isInitializing) {
    return (
      <div className="min-h-screen bg-[#FFF4ED] flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-[#FF8C42] border-t-transparent rounded-full animate-spin mb-4"></div>
        <p className="text-[#FF8C42] font-medium animate-pulse">Đang kết nối hệ thống EC...</p>
      </div>
    );
  }

  // Luồng chưa đăng nhập
  if (!isAuthenticated) {
    if (showRegister) {
      return (
        <Register 
          onRegisterSuccess={handleRegisterSuccess} 
          onBackToLogin={() => setShowRegister(false)} 
        />
      );
    }
    return (
      <Login 
        onLogin={handleLogin} 
        onRegisterClick={() => setShowRegister(true)} 
      />
    );
  }

  // Luồng đã đăng nhập thành công
  return (
    <div className="min-h-screen bg-[#FDFCFB]">
      {/* Header đồng bộ dữ liệu thật */}
      <Header 
        onNavigate={setActiveTab} 
        onLogout={handleLogout} 
        userType={userType}
        userName={userInfo.name}
        userEmail={userInfo.email}
      />

      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />

      <main className="ml-28 pt-20 px-8 pb-8 transition-all duration-300">
        <div className="max-w-[1600px] mx-auto">
          {renderContent()}
        </div>
      </main>
    </div>
  );
}