import React, { useEffect, useState } from 'react';
import { PageHeader } from './PageHeader';
import { Mail, Phone, Filter, Users, X, Trash2, UserPlus, CheckCircle, Hash, AlertCircle, Briefcase, GraduationCap, Award } from 'lucide-react';
import { StaffDetailModal } from './StaffDetailModal';

import { 
  getStaffList, 
  getCandidateList, 
  approveCandidate, 
  rejectCandidate, 
  deleteStaff,
  getCandidateDetail
} from '../api/staffApi'; 

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

interface CandidateDetailResponseDTO {
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

// Interface
interface StaffMember {
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
  joinDate: string;
  experience: string; 
  rating: number;
  totalClasses: number;
  note: string; 
  baseSalary: number;
  education?: string;
  skills?: string[];
}

export function StaffManagement() {
  const [staff, setStaff] = useState<StaffMember[]>([]);
  const [joinRequests, setJoinRequests] = useState<StaffMember[]>([]); // Dùng chung interface
  const [loading, setLoading] = useState(true);

  const [showJoinRequestsList, setShowJoinRequestsList] = useState(false);
  const [reviewingRequest, setReviewingRequest] = useState<number | null>(null);
  const [viewingStaffDetail, setViewingStaffDetail] = useState<number | null>(null);
  
  const [filterHashtags, setFilterHashtags] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [reviewForm, setReviewForm] = useState({ hashtags: [] as string[] });

  const [showFilterModal, setShowFilterModal] = useState(false);
  const [availableHashtags, setAvailableHashtags] = useState<Hashtag[]>([]); // Kho hashtag lấy từ danh sách nhân viên

  const [currentCandidate, setCurrentCandidate] = useState<CandidateDetailResponseDTO | null>(null);

  const handleOpenReview = async (requestId: number) => {
    try {
        // 1. Gọi API lấy chi tiết ứng viên
        const data = await getCandidateDetail(requestId) as unknown as CandidateDetailResponseDTO;
        
        if (data) {
            // 2. Cập nhật dữ liệu vào State
            setCurrentCandidate(data);
            setReviewingRequest(requestId);
            setReviewForm({ hashtags: [] });

            // 3. Chỉ đóng danh sách ứng viên KHI ĐÃ CÓ dữ liệu chi tiết
            setShowJoinRequestsList(false); 
        }
    } catch (error) {
        console.error("Không thể lấy thông tin chi tiết ứng viên:", error);
        alert("Lỗi tải dữ liệu ứng viên");
    }
  };
  const loadData = async () => {
    setLoading(true);
    try {
        const [staffRes, candidateRes] = await Promise.all([
            getStaffList({ search: searchQuery }),
            getCandidateList()
        ]);

        const staffData = (staffRes as any) || [];
        setStaff(staffData);
        setJoinRequests((candidateRes as any) || []);

        // --- GOM HASHTAG ĐỂ LỌC ---
        const allUniqueTags: Hashtag[] = [];
        const seenIds = new Set();
        staffData.forEach((s: StaffMember) => {
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
        console.error("Lỗi:", error);
    } finally {
        setLoading(false);
    }
};

  useEffect(() => {
    loadData();
  }, [searchQuery]);

  const handleApproveRequest = async () => {
    if (!reviewingRequest) return;
    if (reviewForm.hashtags.length === 0) {
      alert('Vui lòng chọn ít nhất 1 vai trò cho nhân viên mới!');
      return;
    }
    try {
      await approveCandidate(reviewingRequest, reviewForm.hashtags);
      alert("Phê duyệt thành công!");
      setReviewingRequest(null);
      setShowJoinRequestsList(false);
      loadData(); 
    } catch (error: any) {
      alert("Lỗi khi phê duyệt");
    }
  };

  const handleRejectRequest = async () => {
    if (!reviewingRequest) return;
    if (window.confirm('Bạn có chắc chắn muốn từ chối yêu cầu này?')) {
      try {
        await rejectCandidate(reviewingRequest);
        setReviewingRequest(null);
        loadData();
      } catch (error) {
        alert("Lỗi khi từ chối");
      }
    }
  }

  const handleDeleteStaff = async (profileId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa nhân viên này?')) {
      try {
        await deleteStaff(profileId);
        loadData();
      } catch (error) {
        alert("Lỗi khi xóa nhân viên");
      }
    }
  };

const filteredStaff = (staff || []).filter(s => {
    // 1. Lọc theo ô tìm kiếm (Tên/Email)
    const matchesSearch = !searchQuery || 
        s.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.email?.toLowerCase().includes(searchQuery.toLowerCase());

    // 2. Lọc theo Hashtag (Nếu có chọn hashtag để lọc)
    if (filterHashtags.length > 0) {
        // Gom tất cả ID hashtag của nhân viên đó lại
        const staffTagIds = [...(s.hashtag?.roles || []), ...(s.hashtag?.traits || [])].map(t => t.id);
        // Kiểm tra xem nhân viên này có chứa ít nhất một trong các hashtag đang lọc không
        const matchesHashtag = filterHashtags.some(id => staffTagIds.includes(id));
        return matchesSearch && matchesHashtag;
    }

    return matchesSearch;
});

// Hàm toggle chọn/bỏ chọn hashtag khi lọc
const toggleFilterHashtag = (id: string) => {
    setFilterHashtags(prev => 
        prev.includes(id) ? prev.filter(h => h !== id) : [...prev, id]
    );
};

  // Tìm ứng viên hiện tại đang được xét duyệt
  const currentReviewRequest = joinRequests.find(r => r.profileId === reviewingRequest);

  return (
    <div className="min-h-screen bg-background">
      <PageHeader 
        title="Quản lý nhân sự"
        rightContent={
          <div className="flex items-center gap-3">
            <input
              type="text"
              placeholder="Tìm kiếm nhân viên..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-64 h-10 px-4 rounded-2xl bg-white border border-border shadow-sm focus:border-[#FF8C42] outline-none"
            />
            <button 
        onClick={() => setShowFilterModal(true)}
        className={`w-10 h-10 rounded-2xl border flex items-center justify-center transition-all ${
            filterHashtags.length > 0 ? 'bg-[#FF8C42] border-[#FF8C42] text-white' : 'bg-white border-border text-muted-foreground'
        }`}
    >
        <Filter className="w-5 h-5" />
    </button>
            <button onClick={() => setShowJoinRequestsList(true)} className="relative h-10 px-5 rounded-2xl bg-[#FF8C42] text-white font-medium hover:bg-[#FF7A2E] flex items-center gap-2 shadow-md">
              <UserPlus className="w-4 h-4" />
              <span>Ứng viên ({joinRequests.length})</span>
            </button>
          </div>
        }
      />

      <div className="p-8">
  {loading ? (
    <div className="flex justify-center py-20 text-muted-foreground animate-pulse font-bold">Đang tải danh sách nhân sự...</div>
  ) : (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {filteredStaff.map((member) => (
        <div key={member.profileId} className="bg-white rounded-[2rem] p-6 space-y-4 relative shadow-sm border border-secondary hover:shadow-xl transition-all group">
          
          {/* STATUS BADGE - MÀU CAM THEO MOCKUP STAFF */}
          <div className="absolute top-4 right-4 px-4 py-1.5 rounded-full text-[11px] font-bold bg-[#FF8C42] text-white uppercase shadow-sm tracking-wider">
            {member.status}
          </div>
          
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setViewingStaffDetail(member.profileId)}>
            <img src={member.avatar} className="w-16 h-16 rounded-2xl object-cover shadow-sm group-hover:scale-105 transition-transform" alt="" />
            <div>
              <h3 className="font-bold text-lg group-hover:text-[#FF8C42] transition-colors">{member.name}</h3>
              <p className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ID: #{member.profileId}</p>
            </div>
          </div>

          {/* HASHTAGS AREA - TÔNG MÀU CAM/VÀNG */}
          <div className="min-h-[40px] flex flex-wrap gap-1.5">
            {member.hashtag?.roles?.map(tag => (
              <span key={tag.id} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#FFF4ED] text-[#FF8C42] border border-[#FFE4D1]">#{tag.name}</span>
            ))}
            {member.hashtag?.traits?.map(tag => (
              <span key={tag.id} className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#F0FFF4] text-[#38A169] border border-[#C6F6D5]">#{tag.name}</span>
            ))}
          </div>

          {/* FOOTER CARD */}
          <div className="pt-4 border-t border-secondary text-sm text-muted-foreground flex justify-between items-center">
            <div className="space-y-1">
              <div className="flex items-center gap-2 font-medium"><Mail className="w-3.5 h-3.5 text-[#FF8C42]" /> {member.email}</div>
              <div className="flex items-center gap-2 font-medium"><Briefcase className="w-3.5 h-3.5 text-[#FF8C42]" /> {member.totalClasses || 0} lớp phụ trách</div>
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); handleDeleteStaff(member.profileId); }} 
              className="p-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>

{/* MODAL 1: DANH SÁCH ĐƠN ĐĂNG KÝ (CANDIDATES - ĐÃ ĐỒNG BỘ 100% VỚI STUDENT) */}
{showJoinRequestsList && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-6">
    <div className="bg-white rounded-3xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Danh sách đơn ứng tuyển</h2>
          <p className="text-sm text-muted-foreground">{joinRequests.length} yêu cầu đang chờ duyệt</p>
        </div>
        <button onClick={() => setShowJoinRequestsList(false)}><X className="w-6 h-6" /></button>
      </div>

      {joinRequests.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground bg-slate-50 rounded-2xl border-2 border-dashed">
          <Users className="w-16 h-16 mx-auto mb-4 opacity-20" />
          <p>Không có đơn ứng tuyển nào</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4">
          {joinRequests.map(request => (
            <div 
              key={request.profileId} 
              className="bg-secondary rounded-2xl p-5 space-y-3 hover:bg-[#FFF4ED] transition-all cursor-pointer border border-transparent hover:border-[#FF8C42]" 
              onClick={() => handleOpenReview(request.profileId)}
            >
              <div className="flex items-center gap-3">
                <img src={request.avatar} className="w-14 h-14 rounded-full" alt="" />
                <div>
                  <h3 className="font-bold">{request.name}</h3>
                  <p className="text-xs text-muted-foreground">{request.email}</p>
                </div>
              </div>
              <button className="w-full py-2 bg-[#FF8C42] text-white rounded-xl text-sm font-bold">Xét duyệt</button>
            </div>
          ))}
        </div>
      )}
    </div>
  </div>
)}

{/* MODAL 2: XÉT DUYỆT CHI TIẾT NHÂN SỰ */}
{reviewingRequest && currentCandidate && (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[110] p-6">
    <div className="bg-white rounded-[2.5rem] p-8 max-w-2xl w-full shadow-2xl relative border border-white overflow-hidden">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-gray-800">Phê duyệt nhân sự</h2>
        <button onClick={() => { setReviewingRequest(null); setCurrentCandidate(null); }}>
          <X className="w-6 h-6 text-gray-400" />
        </button>
      </div>

      <div className="bg-[#FFF4ED]/50 rounded-[2rem] p-6 mb-8 border border-[#FFE4D1]/50">
        <div className="flex items-center gap-5 mb-6">
          <img src={currentCandidate.avatar} className="w-20 h-20 rounded-[1.5rem] object-cover shadow-lg border-2 border-white" alt="" />
          <div>
            <h3 className="text-xl font-bold text-gray-800">{currentCandidate.name}</h3>
            <span className="px-4 py-1.5 bg-[#FF8C42] rounded-full text-[10px] font-bold text-white shadow-sm inline-block mt-2 tracking-widest uppercase">
              PENDING
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-6 text-sm">
          <div className="space-y-1">
            <p className="text-[#FF8C42] font-black text-[10px] uppercase tracking-wider">Email</p>
            <p className="font-bold">{currentCandidate.email}</p>
          </div>
          <div className="space-y-1">
            <p className="text-[#FF8C42] font-black text-[10px] uppercase tracking-wider">Điện thoại</p>
            <p className="font-bold">{currentCandidate.phone}</p>
          </div>
          <div className="col-span-2 space-y-1">
            <p className="text-[#FF8C42] font-black text-[10px] uppercase tracking-wider">Lời nhắn ứng tuyển</p>
            <p className="bg-white p-4 rounded-2xl italic text-gray-600 shadow-inner">"{currentCandidate.note}"</p>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <label className="font-bold text-gray-700 block px-1">Gán vai trò & Kỹ năng nhân sự <span className="text-red-500">*</span></label>
        
        <div className="flex flex-wrap gap-2 p-4 min-h-[60px] bg-slate-50 rounded-[1.5rem] border-2 border-dashed border-[#FFE4D1]">
          {reviewForm.hashtags.length === 0 ? (
            <p className="text-xs text-muted-foreground italic flex items-center gap-1 font-medium">
              <Hash className="w-3 h-3 text-[#FF8C42]"/> Chọn ít nhất 1 vai trò để phê duyệt...
            </p>
          ) : (
            reviewForm.hashtags.map(id => {
              const tag = [...currentCandidate.suggestedRoles, ...currentCandidate.suggestedTraits].find(t => t.id === id);
              return (
                <span key={id} className="px-4 py-2 bg-white border border-[#FFE4D1] text-[#FF8C42] rounded-xl text-xs font-bold flex items-center gap-2 shadow-sm animate-in zoom-in-95">
                  #{tag?.name} 
                  <X className="w-3 h-3 cursor-pointer hover:text-red-500" 
                     onClick={() => setReviewForm({hashtags: reviewForm.hashtags.filter(h => h !== id)})} 
                  />
                </span>
              );
            })
          )}
        </div>

        {/* DROP-DOWN CHO PHÉP CHỌN CẢ ROLES VÀ TRAITS (TRỪ STUDENT) */}
        <select 
          className="w-full px-4 py-4 rounded-2xl bg-white border-2 border-[#FFF4ED] focus:border-[#FF8C42] focus:outline-none transition-all font-bold text-sm shadow-sm"
          onChange={(e) => {
            const val = e.target.value;
            if(val && !reviewForm.hashtags.includes(val)) {
              setReviewForm({hashtags: [...reviewForm.hashtags, val]});
            }
            e.target.value = "";
          }}
        >
          <option value="">+ Thêm nhãn (Vai trò, Kỹ năng, Đặc điểm...)</option>
          
          <optgroup label="Vai trò (Roles)">
            {currentCandidate.suggestedRoles
              .filter(r => !r.id.startsWith("STUDENT_")) // LOẠI TRỪ NHÃN STUDENT
              .map(r => (
                <option key={r.id} value={r.id}>#{r.name}</option>
              ))
            }
          </optgroup>

          <optgroup label="Kỹ năng & Đặc điểm (Traits)">
            {currentCandidate.suggestedTraits.map(t => (
              <option key={t.id} value={t.id}>#{t.name}</option>
            ))}
          </optgroup>
        </select>
      </div>

      <div className="flex gap-4 mt-10">
        <button onClick={handleRejectRequest} className="flex-1 py-4 bg-slate-100 text-slate-500 rounded-[1.25rem] font-bold hover:bg-red-50 hover:text-red-600 transition-all flex items-center justify-center gap-2">
          <X className="w-5 h-5"/> Từ chối
        </button>
        <button 
          onClick={handleApproveRequest} 
          disabled={reviewForm.hashtags.length === 0} 
          className="flex-[2] py-4 bg-[#FF8C42] text-white rounded-[1.25rem] font-bold hover:brightness-105 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-xl shadow-orange-100 flex items-center justify-center gap-2"
        >
          <CheckCircle className="w-5 h-5"/> Phê duyệt nhân sự
        </button>
      </div>
    </div>
  </div>
)}

      {viewingStaffDetail && (
        <StaffDetailModal
          profileId={viewingStaffDetail}
          onClose={() => setViewingStaffDetail(null)}
          onSaveSuccess={loadData}
          availableHashtags={[]}
        />
      )}

    {/* --- FILTER MODAL --- */}
{showFilterModal && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[120] p-6">
    <div className="bg-white rounded-3xl p-8 max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
      <div className="flex items-center justify-between mb-6">
        <div>
            <h2 className="text-2xl font-semibold">Bộ lọc nhân sự</h2>
            <p className="text-sm text-muted-foreground">Chọn hashtag để lọc danh sách nhân viên</p>
        </div>
        <button onClick={() => setShowFilterModal(false)} className="text-muted-foreground hover:text-foreground">
          <X className="w-6 h-6" />
        </button>
      </div>

      <div className="space-y-6">
        {/* Lọc theo Vai trò */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">Vai trò (Roles):</p>
          <div className="flex flex-wrap gap-2">
            {availableHashtags.filter(h => h.type === 'ROLE').map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleFilterHashtag(tag.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterHashtags.includes(tag.id)
                    ? 'bg-[#FF8C42] text-white shadow-md'
                    : 'bg-[#FFF4ED] text-[#FF8C42] hover:bg-[#FFE4D1]'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        {/* Lọc theo Đặc điểm */}
        <div>
          <p className="text-sm font-bold text-gray-700 mb-3 uppercase tracking-wider text-[10px]">Đặc điểm (Traits):</p>
          <div className="flex flex-wrap gap-2">
            {availableHashtags.filter(h => h.type === 'TRAIT').map(tag => (
              <button
                key={tag.id}
                onClick={() => toggleFilterHashtag(tag.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                  filterHashtags.includes(tag.id)
                    ? 'bg-[#4ECDC4] text-white shadow-md'
                    : 'bg-[#E8F9F7] text-[#4ECDC4] hover:bg-[#D4F4F0]'
                }`}
              >
                #{tag.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-6 border-t border-secondary">
          <button 
            onClick={() => setFilterHashtags([])} 
            className="flex-1 py-3 bg-secondary rounded-2xl font-bold text-sm"
          >
            Xóa tất cả lọc
          </button>
          <button 
            onClick={() => setShowFilterModal(false)} 
            className="flex-1 py-3 bg-[#FF8C42] text-white rounded-2xl font-bold text-sm"
          >
            Áp dụng
          </button>
        </div>
      </div>
    </div>
  </div>
)}
    </div>
  );

  
}