import React, { useState } from 'react';
import { 
  X, Users, Calendar, Clock, MapPin, CheckCircle2, 
  Rocket, ShieldCheck, GraduationCap, Info, UserCheck, 
  Edit3, Save, MessageSquare, Star, Briefcase
} from 'lucide-react';

export function ClassDetail({ classData, onClose, onUpdateStatus }: any) {
  const [isEditing, setIsEditing] = useState(false);

  // 1. Lọc nhân sự dựa trên JSON
  const teachers = classData.staffs?.filter((s: any) => s.role === 'MAIN_TEACHER') || [];
  const assistants = classData.staffs?.filter((s: any) => s.role === 'ASSISTANT') || [];
  
  // 2. Ứng viên & Đơn đăng ký (Dùng cho PENDING/OPENING)
  const candidateTeachers = classData.requestedTeachers?.filter((s: any) => s.role === 'TEACHER') || [];
  const candidateAssistants = classData.requestedTeachers?.filter((s: any) => s.role === 'ASSISTANT') || [];
  const enrollmentRequests = classData.pendingStudents || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <div className="relative bg-[#FBFBFC] rounded-[40px] w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col anim-slide-up">
        
        {/* HEADER */}
        <div className="p-6 border-b bg-white flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-4">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${
              classData.status === 'PENDING' ? 'bg-amber-100 text-amber-500' : 
              classData.status === 'OPENING' ? 'bg-blue-100 text-blue-500' : 'bg-green-100 text-green-500'
            }`}>
              <Users className="w-7 h-7" />
            </div>
            <div>
              <h2 className="text-2xl font-black text-gray-800 tracking-tight">{classData.name}</h2>
              <div className="flex items-center gap-2 mt-1">
                <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded-lg ${
                  classData.status === 'PENDING' ? 'bg-amber-100 text-amber-600' : 
                  classData.status === 'OPENING' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'
                }`}>
                  {classData.status}
                </span>
                <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest bg-gray-100 px-2 py-1 rounded-lg">
                   {classData.style} • {classData.type}
                </span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-2">
             {classData.status === 'ACTIVE' && (
                <button 
                  onClick={() => setIsEditing(!isEditing)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ${
                    isEditing ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {isEditing ? <><Save size={16}/> Lưu thay đổi</> : <><Edit3 size={16}/> Chỉnh sửa lớp</>}
                </button>
             )}
             <button onClick={onClose} className="w-12 h-12 rounded-2xl bg-gray-50 hover:bg-gray-100 flex items-center justify-center transition-all group">
               <X className="text-gray-400 group-hover:rotate-90 transition-transform" />
             </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          
          {/* PHẦN THÔNG TIN CHUNG (Có chế độ Edit) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
             <InfoBox icon={<Calendar/>} label="Lịch học" value={classData.schedule} isEditing={isEditing} />
             <InfoBox icon={<Clock/>} label="Thời gian" value={classData.time} isEditing={isEditing} />
             <InfoBox icon={<MapPin/>} label="Phòng học" value={classData.defaultRoom} isEditing={isEditing} />
          </div>

          {/* --- CASE 1: PENDING (Giao diện chọn nhân sự) --- */}
          {classData.status === 'PENDING' && (
            <div className="space-y-8 anim-fade-in">
              <div className="bg-amber-50/50 p-6 rounded-[32px] border-2 border-dashed border-amber-100">
                <label className="text-[10px] font-black text-amber-600 uppercase tracking-widest flex items-center gap-2 mb-2"><Info size={14}/> Ghi chú yêu cầu lớp</label>
                <p className="text-gray-700 font-medium italic">"{classData.note || 'Không có ghi chú.'}"</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><GraduationCap size={18} className="text-orange-500"/> Ứng viên Giáo viên ({candidateTeachers.length})</h3>
                  {candidateTeachers.map((staff: any, i: number) => (
                    <StaffCandidateCard key={i} staff={staff} onApprove={() => onUpdateStatus?.(classData.id, staff.id, 'OPENING')} />
                  ))}
                </div>
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest flex items-center gap-2"><Briefcase size={18} className="text-teal-500"/> Ứng viên Trợ giảng ({candidateAssistants.length})</h3>
                  {candidateAssistants.map((staff: any, i: number) => (
                    <StaffCandidateCard key={i} staff={staff} onApprove={() => onUpdateStatus?.(classData.id, staff.id, 'PENDING_CONFIRM')} />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- CASE 2: OPENING (Đợi kích hoạt & Duyệt học sinh) --- */}
          {classData.status === 'OPENING' && (
            <div className="space-y-8 anim-fade-in">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Đội ngũ đã chốt</h3>
                     {teachers.concat(assistants).map((s: any, i: number) => (
                        <div key={i} className="bg-white p-4 rounded-[24px] border flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-xl">👤</div>
                           <div>
                              <p className="font-bold text-gray-800">{s.staffName}</p>
                              <p className="text-[10px] font-black text-orange-500 uppercase">{s.role}</p>
                           </div>
                        </div>
                     ))}
                  </div>
                  <div className="space-y-4">
                     <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Đơn đăng ký học sinh ({enrollmentRequests.length})</h3>
                     {enrollmentRequests.map((req: any, i: number) => (
                        <div key={i} className="p-4 bg-white border border-blue-100 rounded-[24px] flex items-center justify-between shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">👶</div>
                              <p className="font-bold text-gray-700">{req.studentName}</p>
                           </div>
                           <button className="px-5 py-2 bg-blue-500 text-white rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 transition-all">Duyệt vào lớp</button>
                        </div>
                     ))}
                  </div>
               </div>
               <div className="bg-blue-600 rounded-[40px] p-12 text-center text-white relative overflow-hidden">
                  <Rocket size={80} className="absolute -bottom-4 -right-4 opacity-20 rotate-12" />
                  <h3 className="text-3xl font-black uppercase tracking-tighter mb-2">Lớp học đã sẵn sàng!</h3>
                  <p className="opacity-80 mb-8 font-medium">Nhân sự đã đầy đủ. Nhấn kích hoạt để bắt đầu lộ trình học tập.</p>
                  <button 
                    onClick={() => onUpdateStatus?.(classData.id, undefined, 'ACTIVE')}
                    className="px-12 py-5 bg-white text-blue-600 rounded-2xl font-black uppercase tracking-[0.2em] shadow-2xl hover:scale-105 transition-all"
                  > KÍCH HOẠT LỚP ACTIVE </button>
               </div>
            </div>
          )}

          {/* --- CASE 3: ACTIVE (Quản lý vận hành) --- */}
          {classData.status === 'ACTIVE' && (
            <div className="space-y-8 anim-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm">
                  <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4">Đội ngũ giảng dạy</p>
                  <div className="space-y-3">
                    {teachers.map((t: any, i: number) => <StaffTag key={i} name={t.staffName} role="Giáo viên" color="orange" />)}
                    {assistants.map((a: any, i: number) => <StaffTag key={i} name={a.staffName} role="Trợ giảng" color="teal" />)}
                  </div>
                </div>
                <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex flex-col items-center justify-center">
                   <p className="text-5xl font-black text-gray-800">{classData.progress}%</p>
                   <p className="text-[10px] font-black text-gray-400 uppercase mt-2">Hoàn thành ({classData.totalSessions} buổi)</p>
                </div>
                <div className="bg-orange-500 p-6 rounded-[32px] text-white flex flex-col justify-center shadow-lg shadow-orange-100">
                   <p className="text-sm font-bold opacity-80 uppercase">Sĩ số lớp</p>
                   <p className="text-4xl font-black mt-1">{classData.currentStudentCount} Học viên</p>
                </div>
              </div>

              <div className="bg-white rounded-[32px] p-8 border border-gray-100 shadow-sm">
                <h3 className="font-black uppercase tracking-widest text-gray-400 text-sm mb-6">Học viên chính thức</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {classData.students?.map((student: any, idx: number) => (
                    <StudentCard key={idx} student={student} />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- COMPONENT CON ---
const InfoBox = ({ icon, label, value, isEditing }: any) => (
  <div className="bg-white p-6 rounded-[32px] border border-gray-100 shadow-sm flex items-center gap-4 group hover:border-orange-200 transition-all">
    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center">{icon}</div>
    <div className="flex-1">
      <p className="text-[10px] text-gray-400 uppercase font-black">{label}</p>
      {isEditing ? (
        <input defaultValue={value} className="w-full font-bold text-gray-700 bg-orange-50/50 border-b border-orange-200 focus:outline-none" />
      ) : (
        <p className="font-bold text-gray-700">{value || "TBD"}</p>
      )}
    </div>
  </div>
);

const StaffCandidateCard = ({ staff, onApprove }: any) => (
   <div className="bg-white p-4 rounded-[32px] border border-gray-100 shadow-sm flex items-center justify-between hover:border-orange-400 transition-all group">
      <div className="flex items-center gap-3">
         <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center text-3xl">👤</div>
         <div>
            <p className="font-black text-gray-800 leading-tight">{staff.staffName || 'Ứng viên'}</p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-amber-500">
               <Star size={10} fill="currentColor"/> 5.0 Rating
            </div>
         </div>
      </div>
      {onApprove && (
         <button onClick={onApprove} className="p-3 bg-orange-500 text-white rounded-2xl hover:bg-orange-600 transition-all">
            <UserCheck size={18} />
         </button>
      )}
   </div>
);

const StudentCard = ({ student }: any) => (
  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-[24px] group hover:bg-orange-50 transition-all">
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 rounded-xl bg-white shadow-sm flex items-center justify-center text-xl">🎓</div>
      <div>
        <p className="font-black text-gray-700 leading-tight">{student.studentName}</p>
        <p className="text-[9px] font-bold text-gray-400 uppercase">{student.teacherRemark?.substring(0, 20)}...</p>
      </div>
    </div>
    <div className="text-right">
       <p className="text-xs font-black text-orange-500">{student.midtermScore}</p>
       <p className="text-[8px] font-bold text-gray-300 uppercase">Mid</p>
    </div>
  </div>
);

const StaffTag = ({ name, role, color }: any) => (
  <div className={`p-3 bg-${color}-50 rounded-2xl flex items-center gap-3 border border-${color}-100 font-black text-${color}-700`}>
    <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-sm">
      {role === 'Giáo viên' ? '👨‍🏫' : '👩‍💼'}
    </div>
    <p className="text-xs">{name}</p>
  </div>
);