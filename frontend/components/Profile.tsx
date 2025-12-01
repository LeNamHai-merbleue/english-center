import React from 'react';
import { PageHeader } from './PageHeader';
import { Building2, Mail, Phone, Shield, Camera, Save, MapPin, Globe } from 'lucide-react';
import { useState } from 'react';

export function Profile() {
  const [isEditing, setIsEditing] = useState(false);

  const [profileData, setProfileData] = useState({
    centerName: 'English Center Premium',
    email: 'contact@englishcenter.com',
    phone: '0901234567',
    address: '123 Nguyễn Huệ, Quận 1, TP.HCM',
    website: 'www.englishcenter.com',
    avatar: '🏫',
    centerCode: 'EC-VN-2024-001',
    establishedDate: '01/01/2020',
  });

  const handleSaveProfile = () => {
    // Simulate saving
    setIsEditing(false);
    alert('Đã lưu thông tin trung tâm!');
  };

  return (
    <div>
      <PageHeader 
        title="Hồ sơ trung tâm" 
        showSearch={false}
        showFilter={false}
        showAdd={false}
      />

      <div className="px-6 pb-6">
        <div className="max-w-4xl mx-auto">
          <div 
            className="bg-white rounded-3xl p-8"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-xl font-semibold text-foreground">Thông tin trung tâm</h2>
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  className="px-6 py-2 rounded-2xl bg-[#FF8C42] text-white hover:bg-[#FF7A2E] transition-colors font-medium"
                >
                  Chỉnh sửa
                </button>
              ) : (
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="px-6 py-2 rounded-2xl bg-secondary text-foreground hover:bg-[#E8E8EA] transition-colors font-medium"
                  >
                    Hủy
                  </button>
                  <button
                    onClick={handleSaveProfile}
                    className="px-6 py-2 rounded-2xl bg-[#34C759] text-white hover:bg-[#2FB350] transition-colors font-medium flex items-center gap-2"
                  >
                    <Save className="w-4 h-4" />
                    Lưu
                  </button>
                </div>
              )}
            </div>

            {/* Avatar Section */}
            <div className="flex items-center gap-6 mb-8 pb-8 border-b border-border">
              <div className="relative">
                <div className="w-32 h-32 rounded-full bg-gradient-to-br from-[#FF8C42] to-[#FFB677] flex items-center justify-center text-5xl shadow-lg">
                  {profileData.avatar}
                </div>
                {isEditing && (
                  <button className="absolute bottom-0 right-0 w-10 h-10 rounded-full bg-white border-2 border-[#FF8C42] flex items-center justify-center hover:bg-[#FFF4ED] transition-colors shadow-lg">
                    <Camera className="w-5 h-5 text-[#FF8C42]" />
                  </button>
                )}
              </div>
              <div>
                <h3 className="text-2xl font-semibold text-foreground mb-1">{profileData.centerName}</h3>
                <p className="text-lg text-muted-foreground mb-2">Trung tâm Anh ngữ</p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="px-3 py-1 rounded-full bg-[#34C759]/10 text-[#34C759] font-medium">
                    Đang hoạt động
                  </span>
                  <span className="text-muted-foreground">
                    Mã TT: {profileData.centerCode}
                  </span>
                  <span className="text-muted-foreground">•</span>
                  <span className="text-muted-foreground">
                    Thành lập: {profileData.establishedDate}
                  </span>
                </div>
              </div>
            </div>

            {/* Profile Form */}
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Tên trung tâm <span className="text-[#FF3B30]">*</span>
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.centerName}
                      onChange={(e) => setProfileData({ ...profileData, centerName: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all ${
                        isEditing
                          ? 'border-transparent bg-secondary focus:border-[#FF8C42] focus:bg-white focus:outline-none'
                          : 'border-transparent bg-secondary/50 text-foreground cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Email liên hệ <span className="text-[#FF3B30]">*</span>
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all ${
                        isEditing
                          ? 'border-transparent bg-secondary focus:border-[#FF8C42] focus:bg-white focus:outline-none'
                          : 'border-transparent bg-secondary/50 text-foreground cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Số điện thoại <span className="text-[#FF3B30]">*</span>
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="tel"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all ${
                        isEditing
                          ? 'border-transparent bg-secondary focus:border-[#FF8C42] focus:bg-white focus:outline-none'
                          : 'border-transparent bg-secondary/50 text-foreground cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Địa chỉ <span className="text-[#FF3B30]">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all ${
                        isEditing
                          ? 'border-transparent bg-secondary focus:border-[#FF8C42] focus:bg-white focus:outline-none'
                          : 'border-transparent bg-secondary/50 text-foreground cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Website
                  </label>
                  <div className="relative">
                    <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.website}
                      onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                      disabled={!isEditing}
                      className={`w-full pl-12 pr-4 py-3 rounded-2xl border-2 transition-all ${
                        isEditing
                          ? 'border-transparent bg-secondary focus:border-[#FF8C42] focus:bg-white focus:outline-none'
                          : 'border-transparent bg-secondary/50 text-foreground cursor-not-allowed'
                      }`}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-muted-foreground mb-2">
                    Mã số trung tâm
                  </label>
                  <div className="relative">
                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <input
                      type="text"
                      value={profileData.centerCode}
                      disabled
                      className="w-full pl-12 pr-4 py-3 rounded-2xl border-2 border-transparent bg-secondary/50 text-foreground cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              {/* Stats Section */}
              <div className="pt-8 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Thống kê hoạt động</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-5 rounded-2xl bg-[#FF8C42]/5">
                    <div className="text-3xl font-semibold text-[#FF8C42] mb-1">1,247</div>
                    <div className="text-sm text-muted-foreground">Tổng học viên</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#4ECDC4]/5">
                    <div className="text-3xl font-semibold text-[#4ECDC4] mb-1">45</div>
                    <div className="text-sm text-muted-foreground">Lớp đang hoạt động</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#34C759]/5">
                    <div className="text-3xl font-semibold text-[#34C759] mb-1">28</div>
                    <div className="text-sm text-muted-foreground">Giáo viên</div>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#9B59B6]/5">
                    <div className="text-3xl font-semibold text-[#9B59B6] mb-1">5</div>
                    <div className="text-sm text-muted-foreground">Năm hoạt động</div>
                  </div>
                </div>
              </div>

              {/* Additional Info Section */}
              <div className="pt-8 border-t border-border">
                <h3 className="font-semibold text-foreground mb-4">Thông tin bổ sung</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-5 rounded-2xl bg-[#FFF4ED] border border-[#FF8C42]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#FF8C42]/10 flex items-center justify-center">
                        <Building2 className="w-5 h-5 text-[#FF8C42]" />
                      </div>
                      <h4 className="font-semibold text-foreground">Chương trình đào tạo</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">IELTS, TOEIC, General English</p>
                  </div>
                  <div className="p-5 rounded-2xl bg-[#F0F9FF] border border-[#4ECDC4]/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center">
                        <Shield className="w-5 h-5 text-[#4ECDC4]" />
                      </div>
                      <h4 className="font-semibold text-foreground">Giấy phép hoạt động</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">Số: 123/GP-UBND ngày 01/01/2020</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}