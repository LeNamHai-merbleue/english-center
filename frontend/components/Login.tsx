import React from 'react';
import { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Shield, AlertCircle, Loader2 } from 'lucide-react';
import { loginAdmin } from '../api/authApi'; // Đảm bảo đường dẫn này đúng với file authApi.js của bạn

interface LoginProps {
  onLogin: (userType: 'user' | 'admin') => void;
  onRegisterClick: () => void;
}

export function Login({ onLogin, onRegisterClick }: LoginProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('user');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Trạng thái chờ API
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // 1. Validation cơ bản tại Client
    if (!formData.email || !formData.password) {
      setErrorMessage('Vui lòng điền đầy đủ thông tin!');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setErrorMessage('Email không hợp lệ!');
      return;
    }

    setIsLoading(true); // Bắt đầu gọi API

    try {
      if (activeTab === 'admin') {
        // --- GỌI API THẬT CHO ADMIN ---
        await loginAdmin({
          email: formData.email,
          password: formData.password,
        });

        // Nếu không throw error nghĩa là thành công (token đã được lưu trong authApi)
        onLogin('admin');
      } else {
        // Mock cho User (Nếu bạn chưa viết API cho User)
        if (formData.email === 'user@ec.com' && formData.password === 'user123') {
          onLogin('user');
        } else {
          setErrorMessage('Tài khoản User hoặc mật khẩu không chính xác!');
        }
      }
    } catch (error: any) {
      // Nhận message lỗi từ Backend (ví dụ: "Email hoặc mật khẩu không chính xác")
      setErrorMessage(error || 'Đăng nhập thất bại, vui lòng thử lại!');
    } finally {
      setIsLoading(false); // Kết thúc gọi API
    }
  };

  const handleTabChange = (tab: 'user' | 'admin') => {
    setActiveTab(tab);
    setErrorMessage('');
    setFormData({ email: '', password: '' });
  };

  const handleInputChange = (field: 'email' | 'password', value: string) => {
    setFormData({ ...formData, [field]: value });
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF4ED] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#FF8C42]/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-[#FFB677]/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">EC</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">English Center</h1>
          <p className="text-muted-foreground">Hệ thống quản lý trung tâm Anh ngữ</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          <div className="flex gap-2 mb-8 p-1.5 bg-gray-50 rounded-2xl">
            <button
              type="button"
              onClick={() => handleTabChange('user')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'user' ? 'bg-[#4ECDC4] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <User className="w-5 h-5" />
              <span>User</span>
            </button>
            <button
              type="button"
              onClick={() => handleTabChange('admin')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                activeTab === 'admin' ? 'bg-[#FF8C42] text-white shadow-md' : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Shield className="w-5 h-5" />
              <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  disabled={isLoading}
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full pl-12 pr-4 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all"
                  placeholder={activeTab === 'admin' ? 'admin@ec.com' : 'user@ec.com'}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-600 mb-2">Mật khẩu</label>
              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  disabled={isLoading}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="w-full pl-12 pr-12 py-3 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all"
                  placeholder="Nhập mật khẩu"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-2xl text-white font-medium transition-all shadow-md flex items-center justify-center gap-2 ${
                activeTab === 'admin' ? 'bg-[#FF8C42] hover:bg-[#FF7A2E]' : 'bg-[#4ECDC4] hover:bg-[#45B8AF]'
              } ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Đang xử lý...
                </>
              ) : (
                `Đăng nhập ${activeTab === 'admin' ? 'Admin' : 'User'}`
              )}
            </button>
          </form>

          {errorMessage && (
            <div className="mt-4 p-4 rounded-2xl bg-red-50 border border-red-100 text-red-600 flex items-center gap-2 animate-in fade-in slide-in-from-top-1">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <p className="text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500 mb-3">Chưa có tài khoản?</p>
            <button
              type="button"
              className="w-full py-3 px-6 rounded-2xl border-2 border-[#FF8C42] text-[#FF8C42] font-medium hover:bg-[#FF8C42] hover:text-white transition-all"
              onClick={onRegisterClick}
            >
              Đăng ký tài khoản mới
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}