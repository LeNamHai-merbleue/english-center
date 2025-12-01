import React, { useEffect, useState } from 'react';
import { X, Mail, Phone, Calendar,Star, BookOpen, GraduationCap, FileText, Award, Cake, Edit2, Save, Hash, Info,CheckCircle } from 'lucide-react';
import { getStudentDetail, updateStudent } from '../api/studentApi'; 

interface HashtagDTO {
  id: string;
  name: string;
  type: string;
  isSystem: boolean;
}

interface StudentMember {
  profileId: number;
  userId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  birthday: string;
  status: string;
  enrolledDate: string; // Ngày nhập học
  experience: string;   // Học vấn/Trình độ cũ
  totalClasses: number;
  currentLevel: string; // Trình độ hiện tại
  note: string;
  hashtag: {
    roles: HashtagDTO[];
    traits: HashtagDTO[];
  };
}

interface StudentDetailModalProps {
  profileId: number;
  onClose: () => void;
  onSaveSuccess: () => void;
  availableHashtags: { id: string, name: string, type: string }[]; 
}

export function StudentDetailModal({ profileId, onClose, onSaveSuccess, availableHashtags }: StudentDetailModalProps) {
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [member, setMember] = useState<StudentMember | null>(null);
  const [editedMember, setEditedMember] = useState<StudentMember | null>(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        const data = await getStudentDetail(profileId) as unknown as StudentMember;
        if (data) {
          setMember(data);
          setEditedMember(data);
        }
      } catch (error) {
        console.error("Lỗi lấy chi tiết học viên:", error);
        alert("Không thể tải thông tin hồ sơ");
        onClose();
      } finally {
        setLoading(false);
      }
    };
    if (profileId) fetchDetail();
  }, [profileId]);

  const handleSave = async () => {
    if (!editedMember) return;
    try {
      // Logic kiểm tra: Không được xóa nhãn ROLE "STUDENT"
      const hasStudentRole = editedMember.hashtag.roles.some(r => r.id.startsWith('STUDENT_'));
      if (!hasStudentRole) {
          alert("Lỗi: Không thể xóa nhãn vai trò Học sinh của hồ sơ này.");
          return;
      }

      const updateData = {
        note: editedMember.note,
        status: editedMember.status,
        experience: editedMember.experience,
        currentLevel: editedMember.currentLevel,
        hashtagIds: [
          ...editedMember.hashtag.roles.map(r => r.id),
          ...editedMember.hashtag.traits.map(t => t.id)
        ]
      };

      await updateStudent(profileId, updateData);
      setEditMode(false);
      onSaveSuccess();
      onClose();
    } catch (error: any) {
      alert(error.response?.data?.message || "Lỗi khi cập nhật hồ sơ");
    }
  };

  const handleCancel = () => {
    setEditedMember(member);
    setEditMode(false);
  };

  const handleAddHashtag = (hashtagId: string) => {
    if (!editedMember || !hashtagId) return;
    const selected = availableHashtags.find(h => h.id === hashtagId);
    if (!selected) return;

    const isExist = [...editedMember.hashtag.roles, ...editedMember.hashtag.traits].some(h => h.id === hashtagId);
    if (isExist) return;

    const newTag: HashtagDTO = { ...selected, isSystem: false };
    const updatedHashtag = { ...editedMember.hashtag };

    if (selected.type.toUpperCase() === 'ROLE') {
      updatedHashtag.roles = [...updatedHashtag.roles, newTag];
    } else {
      updatedHashtag.traits = [...updatedHashtag.traits, newTag];
    }
    
    setEditedMember({ ...editedMember, hashtag: updatedHashtag });
  };

  const handleRemoveHashtag = (hashtagId: string) => {
    if (!editedMember) return;
    // Chặn xóa nhãn STUDENT_X
    if (hashtagId.startsWith('STUDENT_')) {
        alert("Không thể xóa nhãn định danh Học sinh.");
        return;
    }

    setEditedMember({
      ...editedMember,
      hashtag: {
        roles: editedMember.hashtag.roles.filter(h => h.id !== hashtagId),
        traits: editedMember.hashtag.traits.filter(h => h.id !== hashtagId)
      }
    });
  };
if (loading || !editedMember) {
    return (
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70]">
        <div className="bg-white p-6 rounded-2xl flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-[#4FD1C5]"></div>
            <span>Đang tải thông tin học viên...</span>
        </div>
      </div>
    );
}

return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[70] p-4 md:p-6">
      <div className="bg-white rounded-3xl p-8 max-w-5xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative">
        {/* Header - Sticky */}
        <div className="flex items-center justify-between mb-6 sticky top-0 bg-white pb-2 z-10 border-b border-slate-50">
          <h2 className="text-2xl font-bold text-gray-800">Hồ sơ học viên chi tiết</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X className="w-6 h-6 text-gray-500" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột trái: Avatar & Trạng thái */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-teal-50/50 border border-teal-100 rounded-3xl p-8 text-center">
              <div className="relative inline-block mb-4">
                <img src={editedMember.avatar} alt={editedMember.name} className="w-40 h-40 rounded-full object-cover border-4 border-white shadow-lg" />
                {/* STATUS BADGE - MÀU TEAL GIỐNG MOCKUP */}
                <div className={`absolute bottom-2 right-2 w-7 h-7 rounded-full border-4 border-white flex items-center justify-center ${editedMember.status === 'ACTIVE' ? 'bg-[#4FD1C5]' : 'bg-gray-400'}`}>
                    {editedMember.status === 'ACTIVE' && <CheckCircle className="w-3 h-3 text-white" />}
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-800 mb-1">{editedMember.name}</h3>
              <p className="text-sm font-medium text-[#4FD1C5] mb-4">Mã học viên: #{editedMember.profileId}</p>
              
              <div className={`inline-flex items-center px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${editedMember.status === 'ACTIVE' ? 'bg-[#E6FFFA] text-[#319795]' : 'bg-gray-100 text-gray-600'}`}>
                {editedMember.status === 'ACTIVE' ? 'Đang hoạt động' : editedMember.status}
              </div>
            </div>

            {/* Thông tin cá nhân */}
            <div className="bg-gray-50 rounded-3xl p-6 space-y-5">
              <h4 className="font-bold text-gray-700 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-[#4FD1C5]" />
                <span>Thông tin cá nhân</span>
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-gray-400 mt-1" />
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Email học viên</p><p className="text-sm font-semibold text-gray-700 break-all">{editedMember.email}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-gray-400 mt-1" />
                  <div><p className="text-[10px] uppercase font-bold text-gray-400">Số điện thoại</p><p className="text-sm font-semibold text-gray-700">{editedMember.phone}</p></div>
                </div>
                <div className="flex items-start gap-3">
                  <Cake className="w-5 h-5 text-gray-400 mt-1" />
                  <div>
                    <p className="text-[10px] uppercase font-bold text-gray-400">Ngày sinh</p>
                    <p className="text-sm font-semibold text-gray-700">{editedMember.birthday ? new Date(editedMember.birthday).toLocaleDateString('vi-VN') : 'Chưa cập nhật'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Cột phải: Học tập & Nhãn */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm">
              <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <Star className="w-5 h-5 text-[#4FD1C5]" />
                <span>Lớp học & Trình độ</span>
              </h4>
              
              <div className="space-y-6">
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Vai trò / Phân loại:</p>
                  <div className="flex flex-wrap gap-2">
                    {editedMember.hashtag.roles.map(tag => (
                      <div key={tag.id} className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-[#E6FFFA] text-[#319795] border border-[#B2F5EA]">
                        #{tag.name}
                        {editMode && !tag.id.startsWith('STUDENT_') && <button onClick={() => handleRemoveHashtag(tag.id)} className="hover:text-red-500"><X className="w-3 h-3" /></button>}
                      </div>
                    ))}
                    {editMode && (
                      <select 
                        className="text-xs font-bold bg-gray-50 border-none rounded-xl px-3 focus:ring-0 cursor-pointer"
                        onChange={(e) => { if (e.target.value) { handleAddHashtag(e.target.value); e.target.value = ''; } }}
                      >
                        <option value="">+ Thêm</option>
                        {availableHashtags.filter(h => h.type.toUpperCase() === 'ROLE' && !editedMember.hashtag.roles.some(r => r.id === h.id)).map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase mb-3 tracking-widest">Đặc điểm học viên:</p>
                  <div className="flex flex-wrap gap-2">
                    {editedMember.hashtag.traits.map(tag => (
                      <div key={tag.id} className="px-4 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 bg-teal-50 text-teal-600 border border-teal-100">
                        #{tag.name}
                        {editMode && <button onClick={() => handleRemoveHashtag(tag.id)} className="hover:text-red-500"><X className="w-3 h-3" /></button>}
                      </div>
                    ))}
                    {editMode && (
                      <select 
                        className="text-xs font-bold bg-gray-50 border-none rounded-xl px-3 focus:ring-0 cursor-pointer"
                        onChange={(e) => { if (e.target.value) { handleAddHashtag(e.target.value); e.target.value = ''; } }}
                      >
                        <option value="">+ Thêm</option>
                        {availableHashtags.filter(h => h.type.toUpperCase() === 'TRAIT' && !editedMember.hashtag.traits.some(t => t.id === h.id)).map(h => (
                          <option key={h.id} value={h.id}>{h.name}</option>
                        ))}
                      </select>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6">
              <h4 className="font-bold text-gray-700 mb-6 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#4FD1C5]" />
                <span>Tiến trình học tập</span>
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Ngày nhập học</p>
                  <p className="font-bold text-gray-700">{editedMember.enrolledDate ? new Date(editedMember.enrolledDate).toLocaleDateString('vi-VN') : '---'}</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Trình độ hiện tại</p>
                  {editMode ? (
                    <input type="text" value={editedMember.currentLevel} className="w-full font-bold text-[#4FD1C5] outline-none" onChange={(e) => setEditedMember({ ...editedMember, currentLevel: e.target.value })} />
                  ) : (
                    <div className="flex items-center gap-1.5 font-bold text-[#4FD1C5]">{editedMember.currentLevel || 'Chưa cập nhật'} <Award className="w-4 h-4 text-[#4FD1C5]" /></div>
                  )}
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Tổng khóa học tham gia</p>
                  <p className="font-bold text-gray-700">{editedMember.totalClasses} khóa học</p>
                </div>
                <div className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm">
                  <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Trình độ đầu vào</p>
                  {editMode ? (
                    <input type="text" className="w-full font-bold text-teal-600 outline-none" value={editedMember.experience} onChange={(e) => setEditedMember({ ...editedMember, experience: e.target.value })} />
                  ) : (
                    <p className="font-bold text-teal-600">{editedMember.experience || 'Không có dữ liệu'}</p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-3xl p-6">
              <h4 className="font-bold text-gray-700 mb-3">Ghi chú học tập</h4>
              {editMode ? (
                <textarea 
                  value={editedMember.note} 
                  className="w-full p-4 rounded-2xl border-none focus:ring-2 focus:ring-[#4FD1C5] text-sm h-24 shadow-inner" 
                  onChange={(e) => setEditedMember({ ...editedMember, note: e.target.value })}
                />
              ) : (
                <p className="text-sm text-gray-600 italic">"{editedMember.note || 'Không có ghi chú nào cho học viên này.'}"</p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 flex gap-4 sticky bottom-0 bg-white pt-4">
          {editMode ? (
            <>
              <button onClick={handleCancel} className="flex-1 py-4 rounded-2xl bg-gray-100 text-gray-600 font-bold hover:bg-gray-200 transition-all">Hủy bỏ</button>
              <button onClick={handleSave} className="flex-2 py-4 rounded-2xl bg-[#4FD1C5] text-white font-bold hover:brightness-110 shadow-lg shadow-teal-100 transition-all flex items-center justify-center gap-2">
                <Save className="w-5 h-5" /> Lưu hồ sơ
              </button>
            </>
          ) : (
            <button onClick={() => setEditMode(true)} className="w-full py-4 rounded-2xl bg-gray-800 text-white font-bold hover:bg-gray-900 transition-all flex items-center justify-center gap-2">
              <Edit2 className="w-5 h-5" /> Chỉnh sửa hồ sơ học viên
            </button>
          )}
        </div>
      </div>
    </div>
);
}