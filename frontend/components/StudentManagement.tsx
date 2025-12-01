import React, { useEffect, useState } from 'react';
import { PageHeader } from './PageHeader';
import { Mail, Phone, Filter, Users, X, Trash2, UserPlus, CheckCircle, Hash, AlertCircle, BookOpen, Calendar, GraduationCap } from 'lucide-react';
import { StudentDetailModal } from './StudentDetailModal';

import { 
  getStudentList, 
  getStudentCandidateList, 
  approveStudent, 
  rejectStudentCandidate, 
  deleteStudent,
  getStudentCandidateDetail
} from '../api/studentApi'; 

type HashtagType = 'ROLE' | 'TRAIT';

interface Hashtag {
  id: string;
  name: string;
  type: HashtagType;
  color?: string;
}

interface HashtagDTO {
  id: string;
  name: string;
  type: string;
  isSystem: boolean;
}

interface StudentCandidateDetailDTO {
  profileId: number;
  name: string;
  email: string;
  phone: string;
  avatar: string;
  experience: string; 
  note: string;
  suggestedRoles: HashtagDTO[];
  suggestedTraits: HashtagDTO[];
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
  hashtag: {
    roles: Hashtag[];
    traits: Hashtag[];
  };
  enrolledDate: string;
  experience: string; 
  totalClasses: number;
  note: string;
  currentLevel: string;
}

export function StudentManagement() {
  // --- ĐỒNG BỘ STATE GIỐNG STAFF ---
  const [students, setStudents] = useState<StudentMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<StudentMember[]>([]);
  const [loading, setLoading] = useState(true);

  const [showJoinRequestsList, setShowJoinRequestsList] = useState(false);
  const [reviewingRequest, setReviewingRequest] = useState<number | null>(null);
  const [viewingStudentDetail, setViewingStudentDetail] = useState<number | null>(null);
  
  const [filterHashtags, setFilterHashtags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewForm, setReviewForm] = useState({ hashtags: [] as string[] });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableHashtags, setAvailableHashtags] = useState<Hashtag[]>([]); 
  const [currentCandidate, setCurrentCandidate] = useState<StudentCandidateDetailDTO | null>(null);

  // --- LOGIC LOAD DATA ĐỒNG BỘ (GOM HASHTAG TỪ STUDENT) ---
  const loadData = async () => {
    setLoading(true);
    try {
        const [studentRes, candidateRes] = await Promise.all([
            getStudentList({ search: searchQuery }),
            getStudentCandidateList()
        ]);

        const studentData = (studentRes as any) || [];
        setStudents(studentData);
        setJoinRequests((candidateRes as any) || []);

        // Gom hashtag để lọc (Chỉ lấy hashtag từ danh sách student thực tế)
        const allUniqueTags: Hashtag[] = [];
        const seenIds = new Set();
        studentData.forEach((s: StudentMember) => {
            const tags = [...(s.hashtag?.roles || []), ...(s.hashtag?.traits || [])];
            tags.forEach(t => {
                if (!seenIds.has(t.id)) {
                    seenIds.add(t.id);
                    allUniqueTags.push(t);
                }
            });
        });
        setAvailableHashtags(allUniqueTags);

    } catch (error) {
        console.error("Lỗi tải dữ liệu học viên:", error);
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  // --- LOGIC XỬ LÝ ĐƠN ĐĂNG KÝ (CANDIDATES) ---
const handleOpenReview = async (requestId: number) => {
    try {
        const data = await getStudentCandidateDetail(requestId) as unknown as StudentCandidateDetailDTO;
        if (data) {
            setCurrentCandidate(data);
            setReviewingRequest(requestId);

            // TÌM NHÃN STUDENT CỦA TRUNG TÂM NÀY
            const studentTag = data.suggestedRoles.find(r => r.id.startsWith("STUDENT_"));
            
            // TỰ ĐỘNG GÁN VÀO FORM (Nếu tìm thấy)
            setReviewForm({ 
                hashtags: studentTag ? [studentTag.id] : [] 
            });

            setShowJoinRequestsList(false); 
        }
    } catch (error) {
        console.error("Lỗi tải chi tiết:", error);
    }
};

  const handleApproveRequest = async () => {
    if (!reviewingRequest) return;
    if (reviewForm.hashtags.length === 0) {
      alert('Vui lòng chọn nhãn lớp học cho học viên mới!');
      return;
    }
    try {
      await approveStudent(reviewingRequest, reviewForm.hashtags);
      alert("Phê duyệt thành công!");
      setReviewingRequest(null);
      loadData(); 
    } catch (error) {
      alert("Lỗi khi phê duyệt");
    }
  };

  const handleRejectRequest = async () => {
    if (!reviewingRequest) return;
    if (window.confirm('Bạn có chắc chắn muốn từ chối đơn đăng ký này?')) {
      try {
        await rejectStudentCandidate(reviewingRequest);
        setReviewingRequest(null);
        loadData();
      } catch (error) {
        alert("Lỗi khi từ chối");
      }
    }
  };

  const handleDeleteStudent = async (profileId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hồ sơ học viên này?')) {
      try {
        await deleteStudent(profileId);
        loadData();
      } catch (error) {
        alert("Lỗi khi xóa học viên");
      }
    }
  };

  // --- LOGIC LỌC (FILTER) ---
  const filteredStudents = (students || []).filter(s => {
    const matchesSearch = !searchQuery || 
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase());

    if (filterHashtags.length > 0) {
        const studentTagIds = [...(s.hashtag?.roles || []), ...(s.hashtag?.traits || [])].map(t => t.id);
        return matchesSearch && filterHashtags.some(id => studentTagIds.includes(id));
    }
    return matchesSearch;
  });

  const toggleFilterHashtag = (id: string) => {
    setFilterHashtags(prev => 
        prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
  };

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Quản lý học viên"
        rightContent={
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm học viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 px-4 rounded-2xl bg-white border border-border shadow-sm focus:border-[#4FD1C5] outline-none transition-all"
            />
            <button 
              onClick={() => setShowFilterModal(true)}
              className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
                filterHashtags.length > 0 ? 'bg-[#4FD1C5] border-[#4FD1C5] text-white' : 'bg-white border-border text-muted-foreground'
              }`}
            >
              <Filter className="w-5 h-5" />
            </button>
            <button onClick={() => setShowJoinRequestsList(true)} className="relative h-10 px-5 rounded-2xl bg-[#4FD1C5] text-white font-medium hover:brightness-105 flex items-center gap-2 shadow-md transition-all">
              <UserPlus className="w-4 h-4" />
              <span>Đơn đăng ký ({joinRequests.length})</span>
            </button>
          </div>
        }
      />

      <div className="p-8">
        {loading ? (
          <div className="flex justify-center py-20 text-muted-foreground">Đang tải danh sách học viên...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((member) => (
              <div key={member.profileId} className="bg-white rounded-[2rem] p-6 space-y-4 relative shadow-sm border border-secondary hover:shadow-xl transition-all group">
                {/* STATUS BADGE - MÀU TEAL GIỐNG MOCKUP */}
                <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#4FD1C5] text-white uppercase shadow-sm">
                  {member.status}
                </div>
                
                <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewingStudentDetail(member.profileId)}>
                  <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
                  <div>
                    <h3 className="font-bold text-lg group-hover:text-[#4FD1C5] transition-colors">{member.name}</h3>
                    <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">{member.currentLevel || 'Học viên'}</p>
                  </div>
                </div>

                <div className="min-h-[40px] flex flex-wrap gap-1.5">
                  {member.hashtag?.roles?.map(tag => (
                    <span key={tag.id} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#E6FFFA] text-[#319795] border border-[#B2F5EA]">#{tag.name}</span>
                  ))}
                  {member.hashtag?.traits?.map(tag => (
                    <span key={tag.id} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F0FFF4] text-[#38A169] border border-[#C6F6D5]">#{tag.name}</span>
                  ))}
                </div>

                <div className="pt-4 border-t border-secondary text-sm text-muted-foreground flex justify-between items-center">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 font-medium"><Mail className="w-3.5 h-3.5 text-[#4FD1C5]" /> {member.email}</div>
                    <div className="flex items-center gap-2 font-medium"><BookOpen className="w-3.5 h-3.5 text-[#4FD1C5]" /> {member.totalClasses || 0} lớp học</div>
                  </div>
                  <button onClick={(e) => { e.stopPropagation(); handleDeleteStudent(member.profileId); }} className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL 1: DANH SÁCH ĐƠN ĐĂNG KÝ (CANDIDATES) */}
      {showJoinRequestsList && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
          <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Danh sách đơn đăng ký</h2>
                <p className="text-sm text-muted-foreground">{joinRequests.length} yêu cầu đang chờ duyệt</p>
              </div>
              <button onClick={() => setShowJoinRequestsList(false)}><X className="w-6 h-6" /></button>
            </div>

            {joinRequests.length === 0 ? (
              <div className="py-20 text-center text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed">
                <GraduationCap className="w-16 h-16 mx-auto mb-4 opacity-20" />
                <p>Không có đơn đăng ký nào</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {joinRequests.map(request => (
                  <div key={request.profileId} className="bg-secondary rounded-2xl p-5 space-y-3 hover:bg-[#E6FFFA] transition-all cursor-pointer border border-transparent hover:border-[#4FD1C5]" onClick={() => handleOpenReview(request.profileId)}>
                    <div className="flex items-center gap-3">
                      <img src={request.avatar} className="w-14 h-14 rounded-full" alt="" />
                      <div>
                        <h3 className="font-bold">{request.name}</h3>
                        <p className="text-xs text-muted-foreground">{request.email}</p>
                      </div>
                    </div>
                    <button className="w-full py-2 bg-[#4FD1C5] text-white rounded-xl text-sm font-bold">Xét duyệt</button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* MODAL 2: XÉT DUYỆT CHI TIẾT */}
      {reviewingRequest && currentCandidate && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[110] p-6">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative border border-white overflow-hidden">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Phê duyệt học viên</h2>
              <button onClick={() => { setReviewingRequest(null); setCurrentCandidate(null); }}><X className="w-6 h-6" /></button>
            </div>

            <div className="bg-[#E6FFFA]/50 rounded-[2rem] p-6 mb-8 border border-[#B2F5EA]/50">
              <div className="flex items-center gap-5 mb-6">
                <img src={currentCandidate.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg border-2 border-white" alt="" />
                <div>
                  <h3 className="text-xl font-bold text-gray-800">{currentCandidate.name}</h3>
                  <span className="px-4 py-1.5 bg-[#4FD1C5] rounded-full text-[10px] font-bold text-white shadow-sm inline-block mt-2 tracking-widest uppercase">
                     PENDING
                  </span>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-6 text-sm">
                <div className="space-y-1"><p className="text-[#38B2AC] font-black text-[10px] uppercase tracking-wider">Email</p><p className="font-bold">{currentCandidate.email}</p></div>
                <div className="space-y-1"><p className="text-[#38B2AC] font-black text-[10px] uppercase tracking-wider">Điện thoại</p><p className="font-bold">{currentCandidate.phone}</p></div>
                <div className="col-span-2 space-y-1"><p className="text-[#38B2AC] font-black text-[10px] uppercase tracking-wider">Lời nhắn</p><p className="bg-white p-4 rounded-2xl italic text-gray-600 shadow-inner">"{currentCandidate.note}"</p></div>
              </div>
            </div>

            <div className="space-y-4">
  <label className="font-bold text-gray-700 block">Vai trò & Đặc điểm học viên</label>
  
  <div className="flex flex-wrap gap-2 p-4 min-h-[60px] bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-[#B2F5EA]">
    {reviewForm.hashtags.map(id => {
      const tag = [...currentCandidate.suggestedRoles, ...currentCandidate.suggestedTraits].find(t => t.id === id);
      const isRequired = tag?.id.startsWith("STUDENT_"); // Kiểm tra nhãn bắt buộc

      return (
        <span key={id} className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm ${
          isRequired ? 'bg-[#4FD1C5] text-white' : 'bg-white border border-[#B2F5EA] text-[#319795]'
        }`}>
          #{tag?.name} 
          {/* CHỈ HIỂN THỊ NÚT XÓA NẾU KHÔNG PHẢI NHÃN STUDENT */}
          {!isRequired && (
            <X className="w-3 h-3 cursor-pointer hover:text-red-500" 
               onClick={() => setReviewForm({hashtags: reviewForm.hashtags.filter(h => h !== id)})} 
            />
          )}
        </span>
      );
    })}
  </div>

  {/* DROP-DOWN CHỈ HIỂN THỊ TRAITS */}
  <select 
    className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-[#E6FFFA] focus:border-[#4FD1C5] focus:outline-none transition-all font-bold text-sm"
    onChange={(e) => {
      const val = e.target.value;
      if(val && !reviewForm.hashtags.includes(val)) {
        setReviewForm({hashtags: [...reviewForm.hashtags, val]});
      }
      e.target.value = "";
    }}
  >
    <option value="">+ Chọn thêm đặc điểm (Chăm chỉ, Ngoan, ...)</option>
    {/* Bỏ optgroup Roles, chỉ giữ Traits */}
    <optgroup label="Đặc điểm học viên (Traits)">
      {currentCandidate.suggestedTraits.map(t => (
        <option key={t.id} value={t.id}>#{t.name}</option>
      ))}
    </optgroup>
  </select>
</div>
            <div className="flex gap-4 mt-10">
              <button onClick={handleRejectRequest} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold hover:bg-red-50 hover:text-red-500 transition-all">Hủy đơn</button>
              <button onClick={handleApproveRequest} disabled={reviewForm.hashtags.length === 0} className="flex-[2] py-4 bg-[#4FD1C5] text-white rounded-2xl font-bold hover:brightness-105 disabled:bg-slate-200 transition-all shadow-xl shadow-teal-50">Tiếp nhận học viên</button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: BỘ LỌC (FILTER) */}
      {showFilterModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[120] p-6">
          <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-bold text-gray-800">Bộ lọc thông minh</h2>
              <button onClick={() => setShowFilterModal(false)}><X className="w-6 h-6"/></button>
            </div>

            <div className="space-y-8">
              <div>
                <p className="text-[10px] font-black text-[#4FD1C5] uppercase tracking-[0.2em] mb-4">Vai trò / Phân loại:</p>
                <div className="flex flex-wrap gap-2.5">
                  {availableHashtags.filter(h => h.type === 'ROLE').map(tag => (
                    <button key={tag.id} onClick={() => toggleFilterHashtag(tag.id)} className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all border-2 ${filterHashtags.includes(tag.id) ? 'bg-[#4FD1C5] border-[#4FD1C5] text-white shadow-lg' : 'bg-white border-[#E6FFFA] text-[#4FD1C5] hover:border-[#4FD1C5]'}`}>#{tag.name}</button>
                  ))}
                </div>
              </div>
              <div className="flex gap-4 pt-4">
                <button onClick={() => setFilterHashtags([])} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-2xl font-bold text-sm">Xóa lọc</button>
                <button onClick={() => setShowFilterModal(false)} className="flex-[2] py-4 bg-[#4FD1C5] text-white rounded-2xl font-bold text-sm shadow-xl shadow-teal-50">Áp dụng</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* MODAL CHI TIẾT HỌC VIÊN */}
      {viewingStudentDetail && (
        <StudentDetailModal
          profileId={viewingStudentDetail}
          onClose={() => setViewingStudentDetail(null)}
          onSaveSuccess={loadData}
          availableHashtags={availableHashtags}
        />
      )}
    </div>
  );
}