import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Shield, AlertCircle, Building2, Phone, MapPin, CheckCircle, Loader2 } from 'lucide-react';
import { registerAdmin } from '../api/authApi'; // Import hàm API đã viết

interface RegisterProps {
  onRegisterSuccess: () => void;
  onBackToLogin: () => void;
}

export function Register({ onRegisterSuccess, onBackToLogin }: RegisterProps) {
  const [activeTab, setActiveTab] = useState<'user' | 'admin'>('admin'); // Mặc định để Admin cho bạn test
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Admin form data - Đồng bộ hoàn toàn với AdminRegisterDTO ở Backend
  const [adminForm, setAdminForm] = useState({
    name: '',           // Tên cá nhân quản trị
    email: '',          // Email dùng để đăng nhập
    password: '',
    confirmPassword: '',
    phone: '',
    centerName: '',     // Tên trung tâm
    centerEmail: '',    // Email liên hệ trung tâm
    centerAddress: '',  // Địa chỉ trung tâm
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setSuccessMessage('');

    if (activeTab === 'admin') {
      // 1. Validation cơ bản tại Client
      if (!adminForm.name || !adminForm.centerName || !adminForm.email || !adminForm.password) {
        setErrorMessage('Vui lòng điền các thông tin bắt buộc!');
        return;
      }

      if (adminForm.password !== adminForm.confirmPassword) {
        setErrorMessage('Mật khẩu xác nhận không khớp!');
        return;
      }

      setIsLoading(true);

      try {
        // --- GỌI API THẬT CHO ADMIN ---
        const response = await registerAdmin({
          name: adminForm.name,
          email: adminForm.email,
          password: adminForm.password,
          phone: adminForm.phone,
          centerName: adminForm.centerName,
          centerEmail: adminForm.centerEmail || adminForm.email, // Backup nếu ko nhập email riêng
          centerAddress: adminForm.centerAddress,
        });

        setSuccessMessage(response.message || 'Đăng ký trung tâm thành công!');
        
        // Chờ 2 giây để user đọc thông báo rồi quay về Login
        setTimeout(() => {
          onRegisterSuccess();
        }, 2000);

      } catch (error: any) {
        setErrorMessage(error || 'Đăng ký thất bại, email có thể đã tồn tại.');
      } finally {
        setIsLoading(false);
      }

    } else {
      // Mock User - Giữ nguyên như ý bạn
      setSuccessMessage('Đăng ký User thành công (Mock)!');
      setTimeout(() => onRegisterSuccess(), 2000);
    }
  };

  const handleAdminInputChange = (field: keyof typeof adminForm, value: string) => {
    setAdminForm({ ...adminForm, [field]: value });
    if (errorMessage) setErrorMessage('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FFF4ED] via-white to-[#FFF4ED] flex items-center justify-center p-6">
      <div className="relative w-full max-w-2xl">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] mb-4 shadow-lg">
            <span className="text-white text-3xl font-bold">EC</span>
          </div>
          <h1 className="text-3xl font-semibold text-foreground mb-2">Đăng ký tài khoản</h1>
          <p className="text-muted-foreground">Tạo tài khoản quản trị trung tâm mới</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)]">
          {/* Tab Switcher */}
          <div className="flex gap-2 mb-8 p-1.5 bg-gray-50 rounded-2xl">
            <button
              type="button"
              onClick={() => setActiveTab('user')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'user' ? 'bg-[#4ECDC4] text-white shadow-md' : 'text-gray-500'}`}
            >
              <User className="w-5 h-5" /> <span>User</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('admin')}
              className={`flex-1 py-3 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'bg-[#FF8C42] text-white shadow-md' : 'text-gray-500'}`}
            >
              <Shield className="w-5 h-5" /> <span>Admin</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === 'admin' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tên cá nhân & Email */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Họ tên quản trị <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={adminForm.name} onChange={(e) => handleAdminInputChange('name', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="Nguyễn Văn Hải" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Email đăng nhập <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="email" value={adminForm.email} onChange={(e) => handleAdminInputChange('email', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="admin@example.com" />
                    </div>
                  </div>
                </div>

                {/* Thông tin Trung tâm */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Tên trung tâm <span className="text-red-500">*</span></label>
                    <div className="relative">
                      <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={adminForm.centerName} onChange={(e) => handleAdminInputChange('centerName', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="SKII Academy" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-600 mb-1">Địa chỉ trung tâm</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input type="text" value={adminForm.centerAddress} onChange={(e) => handleAdminInputChange('centerAddress', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="Từ Sơn, Bắc Ninh" />
                    </div>
                  </div>
                </div>

                {/* Phone & Email Center */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Số điện thoại</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="tel" value={adminForm.phone} onChange={(e) => handleAdminInputChange('phone', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="0987..." />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Email liên hệ trung tâm</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="email" value={adminForm.centerEmail} onChange={(e) => handleAdminInputChange('centerEmail', e.target.value)} className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" placeholder="contact@center.com" />
                  </div>
                </div>

                {/* Mật khẩu */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Mật khẩu <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type={showPassword ? "text" : "password"} value={adminForm.password} onChange={(e) => handleAdminInputChange('password', e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Xác nhận mật khẩu <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input type="password" value={adminForm.confirmPassword} onChange={(e) => handleAdminInputChange('confirmPassword', e.target.value)} className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-gray-50 border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all" />
                  </div>
                </div>
              </div>
            )}

            {/* Error/Success Messages */}
            {errorMessage && <div className="p-3 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm flex items-center gap-2"><AlertCircle className="w-4 h-4" /> {errorMessage}</div>}
            {successMessage && <div className="p-3 rounded-xl bg-green-50 border border-green-100 text-green-600 text-sm flex items-center gap-2"><CheckCircle className="w-4 h-4" /> {successMessage}</div>}

            <button type="submit" disabled={isLoading || !!successMessage} className={`w-full py-3 rounded-2xl text-white font-medium transition-all shadow-md flex items-center justify-center gap-2 ${activeTab === 'admin' ? 'bg-[#FF8C42] hover:bg-[#FF7A2E]' : 'bg-[#4ECDC4]'} ${isLoading ? 'opacity-70' : ''}`}>
              {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : `Đăng ký ${activeTab === 'admin' ? 'Hệ thống Admin' : 'User'}`}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản? <button onClick={onBackToLogin} className="text-[#FF8C42] font-semibold hover:underline">Đăng nhập ngay</button>
          </div>
        </div>
      </div>
    </div>
  );
}