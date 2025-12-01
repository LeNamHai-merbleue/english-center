import React, { useState, useEffect, useCallback } from 'react';
import { PageHeader } from './PageHeader';
import { Users, Clock, Calendar, MapPin, User, X, Loader2, UserPlus, CheckCircle2 } from 'lucide-react';
import { ClassDetail } from './ClassDetail';
import { 
  getClassList, 
  createRegularSessionsClass, 
  getClassDetail,
  createRegularPhasesClass, 
  createMakeupClass 
} from '../api/classApi';

// Interface chuẩn hóa từ Backend
interface ClassData {
  id: number;
  name: string;
  level: string;
  progress: number;
  teacherName?: string;
  currentStudents: number;
  maxStudents: number;
  schedule: string;
  time: string;
  room: string;
  color?: string;
  type: 'REGULAR' | 'MAKEUP';
  status: 'PENDING' | 'OPENING' | 'ACTIVE';
  date?: string;
  note?: string;
  requestedTeachers?: any[];
}

const TIME_SELECT_OPTIONS = [
  '07:00', '07:30', '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
  '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30',
  '18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'
];

const WEEKDAYS = [
  { value: 'T2', label: 'T2' }, { value: 'T3', label: 'T3' },
  { value: 'T4', label: 'T4' }, { value: 'T5', label: 'T5' },
  { value: 'T6', label: 'T6' }, { value: 'T7', label: 'T7' }, { value: 'CN', label: 'CN' },
];

export function ClassManagement() {
  const [classType, setClassType] = useState<'REGULAR' | 'MAKEUP'>('REGULAR');
  const [viewGroup, setViewGroup] = useState<'ACTIVE' | 'WAITING'>('ACTIVE');
  const [searchQuery, setSearchQuery] = useState('');
  const [classes, setClasses] = useState<ClassData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState<ClassData | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [isFetchingDetail, setIsFetchingDetail] = useState(false);

  // Form State cho lớp mới
  const [newClass, setNewClass] = useState({
    name: '', level: 'Cơ bản', maxStudents: 15, selectedDays: [] as string[],
    startTime: '18:00', endTime: '20:00', room: '',
    format: 'session' as 'session' | 'curriculum',
    totalSessions: 24, phases: 3, makeupDate: '', note: ''
  });

  const fetchClasses = useCallback(async () => {
    setIsLoading(true);
    try {
      const response: any = await getClassList(classType, viewGroup);
      const rawData = response?.classes || [];
      const colorPallete = ['#FF8C42', '#4ECDC4', '#95E1D3', '#FFB677', '#FF6B6B'];
      
      const processedData = rawData.map((cls: any, index: number) => ({
        ...cls,
        color: cls.color || colorPallete[index % colorPallete.length]
      }));
      setClasses(processedData);
    } catch (error) {
      console.error("Fetch error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [classType, viewGroup]);

  useEffect(() => { fetchClasses(); }, [fetchClasses]);

  const handleUpdateClassStatus = async (classId: number, staffId?: number, targetStatus?: string) => {
    try {
      // Ở đây bạn sẽ gọi các hàm API như confirmStaff hoặc activateClass tùy theo targetStatus
      console.log(`Cập nhật lớp ${classId} sang ${targetStatus} với staff ${staffId}`);
      setShowDetailModal(false);
      setSelectedClass(null);
      fetchClasses();
    } catch (error) {
      alert("Cập nhật trạng thái thất bại.");
    }
  };

  const handleAddClass = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
    // 1. Chuẩn bị dữ liệu cơ sở (Base DTO)
      const basePayload = {
        name: newClass.name,
        level: newClass.level,
        maxStudents: newClass.maxStudents,
        defaultRoom: newClass.room, // Chuyển đổi: room (UI) -> defaultRoom (BE)
        note: newClass.note,
      // Ghép lịch học để BE dễ xử lý (Nếu Service của bạn xử lý chuỗi)
        schedule: newClass.selectedDays.join(', '),
        time: `${newClass.startTime} - ${newClass.endTime}`,
      };

    // 2. Phân loại theo ClassType
      if (classType === 'REGULAR') {
        const regularPayload = {
        ...basePayload,
        type: 'REGULAR' as const,
        style: newClass.format === 'session' ? 'SESSION_BASED' : 'PHASE_BASED' as any,
      };

      if (newClass.format === 'session') {
        await createRegularSessionsClass({ 
          ...regularPayload, 
          totalSessions: newClass.totalSessions 
        });
      } else {
        await createRegularPhasesClass({ 
          ...regularPayload, 
          phases: newClass.phases 
        });
      }
    } else {
      // Lớp MAKEUP
      await createMakeupClass({ 
        ...basePayload, 
        type: 'MAKEUP' as const,
        date: newClass.makeupDate // BE dùng field 'date' cho Makeup
      });
    }

    // 3. Kết thúc thành công
      setShowAddModal(false);
      resetForm();
      await fetchClasses(); // Load lại danh sách mới nhất
      alert("Tạo lớp học thành công!");
    } catch (error) {
      console.error("Lỗi tạo lớp:", error);
      alert("Không thể tạo lớp. Vui lòng kiểm tra lại thông tin.");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setNewClass({
      name: '', level: 'Cơ bản', maxStudents: 15, selectedDays: [],
      startTime: '18:00', endTime: '20:00', room: '',
      format: 'session', totalSessions: 24, phases: 3, makeupDate: '', note: ''
    });
  };

  const filteredClasses = classes.filter(cls => 
    !searchQuery || cls.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

const handleOpenDetail = async (classId: number) => {
  setIsFetchingDetail(true); // Bắt đầu loading
  try {
    // 1. Gửi request thực tế lên Server thông qua hàm getClassDetail trong classApi
    const response = await getClassDetail(classId);
    
    // 2. Lấy dữ liệu từ axios (nhớ check response.data nếu bạn chưa xử lý interceptor)
    const fullData = response.data ? response.data : response;

    // 3. Sau khi có DATA CHI TIẾT (đã có staffs, students...), mới set vào state
    setSelectedClass(fullData);
    setShowDetailModal(true);
  } catch (error) {
    console.error("Lỗi khi tải chi tiết lớp học:", error);
    // Bạn có thể dùng toast.error("Không thể tải thông tin lớp")
  } finally {
    setIsFetchingDetail(false); // Tắt loading
  }
};

  return (
    <div>
      <PageHeader 
        title="Quản lý lớp học" 
        onAdd={() => setShowAddModal(true)} 
        addLabel="Thêm lớp"
        rightContent={
          <>
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white shadow-sm border">
              <button onClick={() => setClassType('REGULAR')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${classType === 'REGULAR' ? 'bg-[#FF8C42] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Lớp chính thức</button>
              <button onClick={() => setClassType('MAKEUP')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${classType === 'MAKEUP' ? 'bg-[#FF8C42] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Lớp học bù</button>
            </div>
            <div className="flex items-center gap-2 p-1 rounded-2xl bg-white shadow-sm border">
              <button onClick={() => setViewGroup('ACTIVE')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewGroup === 'ACTIVE' ? 'bg-[#4ECDC4] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Đang hoạt động</button>
              <button onClick={() => setViewGroup('WAITING')} className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${viewGroup === 'WAITING' ? 'bg-[#FFB677] text-white shadow-md' : 'text-gray-400 hover:text-gray-600'}`}>Đang chờ</button>
            </div>
            <div className="relative group">
              <input type="text" placeholder="Tìm kiếm lớp..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-64 h-10 pl-4 pr-10 rounded-2xl bg-white border border-gray-100 focus:border-[#FF8C42] outline-none shadow-sm transition-all" />
            </div>
          </>
        }
      />

      <div className="px-6 pb-6 mt-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-32 space-y-4">
            <Loader2 className="animate-spin text-[#FF8C42]" size={40} />
            <p className="text-gray-400 font-medium">Đang tải dữ liệu lớp học...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredClasses.map((cls) => (
              <div 
                key={cls.id} 
                className="bg-white rounded-[32px] p-6 transition-all hover:scale-[1.03] hover:shadow-2xl cursor-pointer group border-2 border-transparent hover:border-orange-50 shadow-sm"
                onClick={() => handleOpenDetail(cls.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800 text-lg mb-1 truncate group-hover:text-orange-500 transition-colors">{cls.name}</h3>
                    <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest shadow-sm" style={{ backgroundColor: `${cls.color}15`, color: cls.color }}>{cls.level}</span>
                  </div>
                  <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner" style={{ backgroundColor: `${cls.color}10` }}>
                    <Users className="w-7 h-7" style={{ color: cls.color }} />
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex justify-between text-[11px] mb-2 font-bold uppercase"><span className="text-gray-300">Tiến độ khóa</span><span style={{ color: cls.color }}>{cls.progress}%</span></div>
                  <div className="h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                    <div className="h-full transition-all duration-1000 shadow-sm" style={{ width: `${cls.progress}%`, backgroundColor: cls.color }} />
                  </div>
                </div>

                <div className="space-y-3 bg-gray-50/50 p-4 rounded-2xl border border-gray-100/30">
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600"><User size={16} className="text-gray-300" />{cls.teacherName || 'Chưa phân công'}</div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600"><Users size={16} className="text-gray-300" />{cls.currentStudents}/{cls.maxStudents} học viên</div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600"><Calendar size={16} className="text-gray-300" />{cls.type === 'MAKEUP' ? cls.date : cls.schedule}</div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600"><Clock size={16} className="text-gray-300" />{cls.time}</div>
                  <div className="flex items-center gap-3 text-sm font-medium text-gray-600"><MapPin size={16} className="text-gray-300" />Phòng {cls.room}</div>
                </div>

                <button className={`w-full mt-6 py-4 rounded-[20px] font-bold text-sm transition-all flex items-center justify-center gap-2 ${viewGroup === 'WAITING' ? 'bg-orange-50 text-orange-500 border-2 border-orange-100 hover:bg-orange-500 hover:text-white' : 'bg-white border-2 border-gray-100 text-gray-400 hover:border-orange-400 hover:text-orange-500 hover:bg-orange-50'}`}>
                  {viewGroup === 'WAITING' ? <><UserPlus size={18} /> {cls.status === 'PENDING' ? 'Sắp xếp nhân sự' : 'Mở lớp ngay'}</> : 'Xem chi tiết'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* MODAL THÊM LỚP HỌC (ĐÃ PHỤC HỒI CHI TIẾT) */}
      {showAddModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <div className="fixed inset-0 bg-black/40 backdrop-blur-md" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white rounded-[40px] p-10 w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl anim-slide-up">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-black text-gray-800 tracking-tight text-center">Thêm lớp học mới</h2>
                <p className="text-gray-400 text-sm mt-1">Khởi tạo lớp {classType === 'REGULAR' ? 'chính thức' : 'học bù'}</p>
              </div>
              <button onClick={() => setShowAddModal(false)} className="w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-gray-100 text-gray-400 transition-all"><X size={24} /></button>
            </div>

            <form onSubmit={handleAddClass} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Tên lớp học <span className="text-red-500">*</span></label>
                <input required value={newClass.name} onChange={e => setNewClass({...newClass, name: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all font-medium" placeholder="Ví dụ: IELTS Fighter 7.0+" />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" onClick={() => setClassType('REGULAR')} className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center ${classType === 'REGULAR' ? 'border-orange-400 bg-orange-50/50' : 'border-gray-100 bg-white'}`}>
                  <span className={`font-black text-sm ${classType === 'REGULAR' ? 'text-orange-600' : 'text-gray-400'}`}>LỚP CHÍNH THỨC</span>
                  <span className="text-[10px] text-gray-400 mt-1">Lịch học dài hạn</span>
                </button>
                <button type="button" onClick={() => setClassType('MAKEUP')} className={`p-5 rounded-3xl border-2 transition-all flex flex-col items-center ${classType === 'MAKEUP' ? 'border-[#4ECDC4] bg-[#4ECDC4]/5' : 'border-gray-100 bg-white'}`}>
                  <span className={`font-black text-sm ${classType === 'MAKEUP' ? 'text-[#4ECDC4]' : 'text-gray-400'}`}>LỚP HỌC BÙ</span>
                  <span className="text-[10px] text-gray-400 mt-1">Chỉ một buổi duy nhất</span>
                </button>
              </div>

              {classType === 'REGULAR' && (
                <div className="p-6 bg-secondary/10 rounded-3xl border-2 border-dashed border-gray-200 space-y-4">
                  <div className="flex gap-2">
                    <button type="button" onClick={() => setNewClass({...newClass, format: 'session'})} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newClass.format === 'session' ? 'bg-white shadow-sm border border-orange-200 text-orange-500' : 'text-gray-400'}`}>THEO BUỔI</button>
                    <button type="button" onClick={() => setNewClass({...newClass, format: 'curriculum'})} className={`flex-1 py-3 rounded-xl font-bold text-xs transition-all ${newClass.format === 'curriculum' ? 'bg-white shadow-sm border border-purple-200 text-purple-500' : 'text-gray-400'}`}>LỘ TRÌNH</button>
                  </div>
                  <input type="number" value={newClass.format === 'session' ? newClass.totalSessions : newClass.phases} onChange={e => setNewClass({...newClass, [newClass.format === 'session' ? 'totalSessions' : 'phases']: Number(e.target.value)})} className="w-full px-5 py-3 rounded-xl bg-white border border-gray-100 outline-none focus:border-orange-400 text-sm" placeholder={newClass.format === 'session' ? "Tổng số buổi (VD: 24)" : "Số giai đoạn (VD: 3)"} />
                </div>
              )}

              {classType === 'MAKEUP' && (
                <div className="space-y-2">
                  <label className="text-sm font-black text-gray-700 uppercase tracking-widest ml-1">Ngày học bù</label>
                  <input type="date" value={newClass.makeupDate} onChange={e => setNewClass({...newClass, makeupDate: e.target.value})} className="w-full px-6 py-4 rounded-2xl bg-gray-50 border-2 border-transparent focus:border-[#4ECDC4] outline-none" />
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Trình độ</label>
                  <select value={newClass.level} onChange={e => setNewClass({...newClass, level: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 font-bold text-gray-700 outline-none border-2 border-transparent focus:border-orange-400">
                    <option>Cơ bản</option><option>Trung cấp</option><option>Nâng cao</option><option>Thiếu nhi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Sĩ số tối đa</label>
                  <input type="number" value={newClass.maxStudents} onChange={e => setNewClass({...newClass, maxStudents: Number(e.target.value)})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 font-bold outline-none border-2 border-transparent focus:border-orange-400" />
                </div>
              </div>

              {classType === 'REGULAR' && (
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Lịch học hàng tuần</label>
                  <div className="flex gap-2">
                    {WEEKDAYS.map(day => (
                      <button key={day.value} type="button" onClick={() => {
                        const days = newClass.selectedDays.includes(day.value) ? newClass.selectedDays.filter(d => d !== day.value) : [...newClass.selectedDays, day.value];
                        setNewClass({...newClass, selectedDays: days});
                      }} className={`flex-1 h-12 rounded-xl font-black text-xs transition-all ${newClass.selectedDays.includes(day.value) ? 'bg-orange-500 text-white shadow-lg shadow-orange-100' : 'bg-gray-50 text-gray-300 hover:bg-gray-100'}`}>{day.label}</button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Khung giờ học</label>
                  <div className="flex gap-2">
                    <select value={newClass.startTime} onChange={e => setNewClass({...newClass, startTime: e.target.value})} className="flex-1 p-3 bg-gray-50 rounded-xl text-xs font-bold border-none outline-none">
                      {TIME_SELECT_OPTIONS.map(t => <option key={t}>{t}</option>)}
                    </select>
                    <select value={newClass.endTime} onChange={e => setNewClass({...newClass, endTime: e.target.value})} className="flex-1 p-3 bg-gray-50 rounded-xl text-xs font-bold border-none outline-none">
                      {TIME_SELECT_OPTIONS.map(t => <option key={t}>{t}</option>)}
                    </select>
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Phòng học</label>
                  <input required value={newClass.room} onChange={e => setNewClass({...newClass, room: e.target.value})} className="w-full px-5 py-3 rounded-2xl bg-gray-50 font-bold outline-none border-2 border-transparent focus:border-orange-400" placeholder="P.205" />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Ghi chú cho lớp học</label>
                <textarea 
                  value={newClass.note} 
                  onChange={e => setNewClass({...newClass, note: e.target.value})} 
                  placeholder="Yêu cầu giáo viên, giáo trình hoặc lưu ý khác..." 
                  className="w-full px-6 py-4 rounded-3xl bg-gray-50 border-2 border-transparent focus:border-orange-400 focus:bg-white outline-none transition-all text-sm font-medium resize-none"
                  rows={3}
                />
              </div>

              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-5 rounded-[24px] bg-gray-100 text-gray-400 font-black uppercase tracking-widest hover:bg-gray-200 transition-all">Hủy</button>
                <button type="submit" className="flex-1 py-5 rounded-[24px] bg-orange-500 text-white font-black uppercase tracking-widest hover:bg-orange-600 shadow-xl shadow-orange-200 transition-all flex items-center justify-center gap-2">
                  <CheckCircle2 size={20} /> Tạo lớp ngay
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && selectedClass && (
  <ClassDetail 
    classData={{
      ...selectedClass,
      // Mapper các trường từ ClassDTO (Backend) sang ClassDetailProps (Frontend)
      currentStudentCount: (selectedClass as any).currentStudentCount || 0,
      defaultRoom: (selectedClass as any).defaultRoom || 'Chưa xếp',
    }} 
    onClose={() => { 
      setShowDetailModal(false); 
      setSelectedClass(null); 
    }} 
    onUpdateStatus={handleUpdateClassStatus}
  />
)}

{/* Hiệu ứng loading overlay khi đang đợi request API detail */}
{isFetchingDetail && (
  <div className="fixed inset-0 z-[60] bg-black/10 backdrop-blur-[2px] flex items-center justify-center">
    <div className="bg-white p-4 rounded-2xl shadow-xl flex items-center gap-3">
      <div className="w-6 h-6 border-4 border-orange-500 border-t-transparent rounded-full animate-spin"></div>
      <span className="font-black text-gray-600 uppercase text-xs tracking-widest">Đang lấy dữ liệu...</span>
    </div>
  </div>
)}
    </div>
  );
}