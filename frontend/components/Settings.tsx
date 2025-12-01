import React from 'react';
import { PageHeader } from './PageHeader';
import { Lock, Bell, Globe, Eye, EyeOff, Save, Mail, User, Shield } from 'lucide-react';
import { useState } from 'react';

export function Settings() {
  const [activeSection, setActiveSection] = useState<'security' | 'notifications' | 'system'>('security');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    classReminders: true,
    studentUpdates: true,
    staffUpdates: false,
    systemAlerts: true,
    weeklyReports: true,
  });

  const [systemSettings, setSystemSettings] = useState({
    language: 'vi',
    theme: 'light',
    timezone: 'Asia/Ho_Chi_Minh',
    dateFormat: 'DD/MM/YYYY',
    twoFactorAuth: false,
  });

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      alert('Mật khẩu mới không khớp!');
      return;
    }
    if (!passwordData.currentPassword || !passwordData.newPassword) {
      alert('Vui lòng điền đầy đủ thông tin!');
      return;
    }
    // Simulate password change
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
    alert('Đổi mật khẩu thành công!');
  };

  const sections = [
    { id: 'security' as const, label: 'Bảo mật', icon: Shield },
    { id: 'notifications' as const, label: 'Thông báo', icon: Bell },
    { id: 'system' as const, label: 'Hệ thống', icon: Globe },
  ];

  return (
    <div>
      <PageHeader 
        title="Cài đặt" 
        showSearch={false}
        showFilter={false}
        showAdd={false}
      />

      <div className="px-6 pb-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Navigation Sidebar */}
          <div 
            className="lg:col-span-1 bg-white rounded-3xl p-6 h-fit"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="space-y-2">
              {sections.map((section) => {
                const Icon = section.icon;
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl transition-all font-medium ${
                      activeSection === section.id
                        ? 'bg-[#FF8C42] text-white'
                        : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span>{section.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Content Area */}
          <div className="lg:col-span-3">
            {/* Security Section */}
            {activeSection === 'security' && (
              <div 
                className="bg-white rounded-3xl p-8"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-6">Bảo mật</h2>

                {/* Change Password */}
                <div className="mb-8">
                  <h3 className="font-semibold text-foreground mb-4">Đổi mật khẩu</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Mật khẩu hiện tại <span className="text-[#FF3B30]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showCurrentPassword ? 'text' : 'password'}
                          value={passwordData.currentPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                          className="w-full pl-12 pr-12 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all"
                          placeholder="Nhập mật khẩu hiện tại"
                        />
                        <button
                          type="button"
                          onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showCurrentPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Mật khẩu mới <span className="text-[#FF3B30]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showNewPassword ? 'text' : 'password'}
                          value={passwordData.newPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                          className="w-full pl-12 pr-12 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all"
                          placeholder="Nhập mật khẩu mới (tối thiểu 8 ký tự)"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showNewPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-muted-foreground mb-2">
                        Xác nhận mật khẩu mới <span className="text-[#FF3B30]">*</span>
                      </label>
                      <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                        <input
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={passwordData.confirmPassword}
                          onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                          className="w-full pl-12 pr-12 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none transition-all"
                          placeholder="Nhập lại mật khẩu mới"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                        </button>
                      </div>
                    </div>

                    <button
                      onClick={handleChangePassword}
                      className="px-6 py-3 rounded-2xl bg-[#FF8C42] text-white hover:bg-[#FF7A2E] transition-colors font-medium"
                    >
                      Cập nhật mật khẩu
                    </button>
                  </div>
                </div>

                {/* Two-Factor Authentication */}
                <div className="pt-8 border-t border-border">
                  <h3 className="font-semibold text-foreground mb-4">Xác thực hai yếu tố (2FA)</h3>
                  <div className="flex items-center justify-between p-6 rounded-2xl bg-secondary/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8C42]/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[#FF8C42]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Bật xác thực hai yếu tố</p>
                        <p className="text-sm text-muted-foreground mt-1">
                          Tăng cường bảo mật tài khoản với mã xác thực bổ sung qua email hoặc SMS
                        </p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0 ml-4">
                      <input
                        type="checkbox"
                        checked={systemSettings.twoFactorAuth}
                        onChange={(e) => setSystemSettings({ ...systemSettings, twoFactorAuth: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>
                </div>

                {/* Security Tips */}
                <div className="mt-8 p-6 rounded-2xl bg-[#FFF4ED] border-2 border-[#FF8C42]/20">
                  <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
                    <Shield className="w-5 h-5 text-[#FF8C42]" />
                    Mẹo bảo mật
                  </h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Sử dụng mật khẩu mạnh ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt</li>
                    <li>• Không chia sẻ mật khẩu với bất kỳ ai</li>
                    <li>• Thay đổi mật khẩu định kỳ mỗi 3-6 tháng</li>
                    <li>• Bật xác thực hai yếu tố để tăng cường bảo mật</li>
                  </ul>
                </div>
              </div>
            )}

            {/* Notifications Section */}
            {activeSection === 'notifications' && (
              <div 
                className="bg-white rounded-3xl p-8"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-6">Cài đặt thông báo</h2>

                <div className="space-y-4">
                  {/* Email Notifications */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF8C42]/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#FF8C42]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Thông báo qua Email</p>
                        <p className="text-sm text-muted-foreground">Nhận thông báo quan trọng qua email</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.emailNotifications}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, emailNotifications: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>

                  {/* Class Reminders */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[#4ECDC4]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Nhắc nhở lịch học</p>
                        <p className="text-sm text-muted-foreground">Thông báo trước 30 phút khi có lớp học</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.classReminders}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, classReminders: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>

                  {/* Student Updates */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#95E1D3]/10 flex items-center justify-center">
                        <User className="w-6 h-6 text-[#95E1D3]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Cập nhật học viên</p>
                        <p className="text-sm text-muted-foreground">Học viên mới, điểm danh, thanh toán</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.studentUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, studentUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>

                  {/* Staff Updates */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FFB677]/10 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-[#FFB677]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Cập nhật nhân sự</p>
                        <p className="text-sm text-muted-foreground">Nghỉ phép, thay đổi lịch dạy</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.staffUpdates}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, staffUpdates: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>

                  {/* System Alerts */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#FF6B6B]/10 flex items-center justify-center">
                        <Bell className="w-6 h-6 text-[#FF6B6B]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Cảnh báo hệ thống</p>
                        <p className="text-sm text-muted-foreground">Lỗi, bảo trì, cập nhật quan trọng</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.systemAlerts}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, systemAlerts: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>

                  {/* Weekly Reports */}
                  <div className="flex items-center justify-between p-5 rounded-2xl hover:bg-secondary/30 transition-colors">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-[#9B59B6]/10 flex items-center justify-center">
                        <Mail className="w-6 h-6 text-[#9B59B6]" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">Báo cáo hàng tuần</p>
                        <p className="text-sm text-muted-foreground">Tổng hợp hoạt động trung tâm</p>
                      </div>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={notificationSettings.weeklyReports}
                        onChange={(e) => setNotificationSettings({ ...notificationSettings, weeklyReports: e.target.checked })}
                        className="sr-only peer"
                      />
                      <div className="w-14 h-8 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-6 after:content-[''] after:absolute after:top-1 after:left-1 after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-[#34C759]"></div>
                    </label>
                  </div>
                </div>

                {/* Save Button */}
                <div className="mt-6 pt-6 border-t border-border">
                  <button
                    onClick={() => alert('Đã lưu cài đặt thông báo!')}
                    className="px-6 py-3 rounded-2xl bg-[#34C759] text-white hover:bg-[#2FB350] transition-colors font-medium flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    Lưu cài đặt
                  </button>
                </div>
              </div>
            )}

            {/* System Section */}
            {activeSection === 'system' && (
              <div 
                className="bg-white rounded-3xl p-8"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <h2 className="text-xl font-semibold text-foreground mb-6">Cài đặt hệ thống</h2>

                <div className="space-y-6">
                  {/* Language */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Ngôn ngữ
                    </label>
                    <select
                      value={systemSettings.language}
                      onChange={(e) => setSystemSettings({ ...systemSettings, language: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none text-foreground transition-all"
                    >
                      <option value="vi">🇻🇳 Tiếng Việt</option>
                      <option value="en">🇬🇧 English</option>
                    </select>
                  </div>

                  {/* Theme */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Giao diện
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setSystemSettings({ ...systemSettings, theme: 'light' })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          systemSettings.theme === 'light'
                            ? 'bg-[#FF8C42] border-[#FF8C42] text-white'
                            : 'bg-white border-border text-foreground hover:border-[#FF8C42]'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">☀️</div>
                          <div className="font-medium">Sáng</div>
                        </div>
                      </button>
                      <button
                        onClick={() => setSystemSettings({ ...systemSettings, theme: 'dark' })}
                        className={`p-4 rounded-2xl border-2 transition-all ${
                          systemSettings.theme === 'dark'
                            ? 'bg-[#FF8C42] border-[#FF8C42] text-white'
                            : 'bg-white border-border text-foreground hover:border-[#FF8C42]'
                        }`}
                      >
                        <div className="text-center">
                          <div className="text-2xl mb-2">🌙</div>
                          <div className="font-medium">Tối</div>
                        </div>
                      </button>
                    </div>
                  </div>

                  {/* Timezone */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Múi giờ
                    </label>
                    <select
                      value={systemSettings.timezone}
                      onChange={(e) => setSystemSettings({ ...systemSettings, timezone: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none text-foreground transition-all"
                    >
                      <option value="Asia/Ho_Chi_Minh">GMT+7 (Hồ Chí Minh)</option>
                      <option value="Asia/Bangkok">GMT+7 (Bangkok)</option>
                      <option value="Asia/Singapore">GMT+8 (Singapore)</option>
                      <option value="Asia/Tokyo">GMT+9 (Tokyo)</option>
                    </select>
                  </div>

                  {/* Date Format */}
                  <div>
                    <label className="block text-sm font-medium text-muted-foreground mb-2">
                      Định dạng ngày
                    </label>
                    <select
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings({ ...systemSettings, dateFormat: e.target.value })}
                      className="w-full px-4 py-3 rounded-2xl bg-secondary border-2 border-transparent focus:border-[#FF8C42] focus:bg-white focus:outline-none text-foreground transition-all"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY (25/12/2024)</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY (12/25/2024)</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD (2024-12-25)</option>
                    </select>
                  </div>

                  {/* Save Button */}
                  <div className="pt-4">
                    <button
                      onClick={() => alert('Đã lưu cài đặt hệ thống!')}
                      className="px-6 py-3 rounded-2xl bg-[#34C759] text-white hover:bg-[#2FB350] transition-colors font-medium flex items-center gap-2"
                    >
                      <Save className="w-5 h-5" />
                      Lưu cài đặt
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
