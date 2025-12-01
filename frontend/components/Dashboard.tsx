import React from 'react';
import { PageHeader } from './PageHeader';
import { Users, GraduationCap, DollarSign, TrendingUp, Clock, BookOpen, Play, MapPin } from 'lucide-react';
import { ClassDetail } from './ClassDetail';
import { useState } from 'react';

export function Dashboard() {
  const [selectedClass, setSelectedClass] = useState<any>(null);
  const [showClassDetail, setShowClassDetail] = useState(false);

  const stats = [
    { label: 'Tổng học viên', value: '342', icon: Users, color: '#FF8C42', trend: '+12%' },
    { label: 'Lớp học', value: '28', icon: GraduationCap, color: '#4ECDC4', trend: '+3%' },
    { label: 'Doanh thu tháng', value: '85.4M', icon: DollarSign, color: '#95E1D3', trend: '+18%' },
    { label: 'Tỷ lệ hoàn thành', value: '92%', icon: TrendingUp, color: '#FFB677', trend: '+5%' },
  ];

  // Lớp học đang diễn ra (hiện tại đang trong giờ học)
  const ongoingClasses = [
    { 
      name: 'Communication Kids', 
      students: 12, 
      maxStudents: 15,
      teacher: 'Lê Văn C', 
      room: 'Phòng 102',
      time: '16:00 - 17:30', 
      startTime: '16:00',
      endTime: '17:30',
      color: '#95E1D3',
      progress: 45 // Phần trăm thời gian đã học
    },
    { 
      name: 'IELTS Foundation A1', 
      students: 15, 
      maxStudents: 20,
      teacher: 'Nguyễn Văn A', 
      room: 'Phòng 201',
      time: '18:00 - 20:00', 
      startTime: '18:00',
      endTime: '20:00',
      color: '#FF8C42',
      progress: 25
    },
    { 
      name: 'Business English Advanced', 
      students: 10, 
      maxStudents: 15,
      teacher: 'Phạm Thị D', 
      room: 'Phòng 401',
      time: '18:30 - 20:30', 
      startTime: '18:30',
      endTime: '20:30',
      color: '#FFB677',
      progress: 15
    },
  ];

  const upcomingClasses = [
    { name: 'TOEIC 550+', students: 20, teacher: 'Trần Thị B', time: '19:00 - 21:00', day: 'Hôm nay', date: 'Thứ 4, 18/12', timeSort: '19:00' },
    { name: 'IELTS Writing Skills', students: 8, teacher: 'Võ Thị F', time: '19:30 - 21:30', day: 'Hôm nay', date: 'Thứ 4, 18/12', timeSort: '19:30' },
    { name: 'TOEIC Advanced', students: 18, teacher: 'Hoàng Văn E', time: '08:00 - 10:00', day: 'Ngày mai', date: 'Thứ 5, 19/12', timeSort: '08:00' },
    { name: 'Kids Reading Club', students: 10, teacher: 'Lê Văn C', time: '14:00 - 15:30', day: 'Ngày mai', date: 'Thứ 5, 19/12', timeSort: '14:00' },
  ].sort((a, b) => a.timeSort.localeCompare(b.timeSort));

  const upcomingEvents = [
    { title: 'Kiểm tra đầu vào IELTS', time: '09:00 - 11:00', date: 'Thứ 7, 20/12' },
    { title: 'Họp phụ huynh lớp Kids', time: '14:00 - 16:00', date: 'Chủ nhật, 21/12' },
    { title: 'Workshop Speaking Skills', time: '10:00 - 12:00', date: 'Thứ 7, 27/12' },
  ];

  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        showSearch={false}
        showFilter={false}
      />
      
      <div className="px-6 pb-6 space-y-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white rounded-3xl p-6 transition-transform hover:scale-105"
                style={{ boxShadow: 'var(--shadow-soft)' }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div 
                    className="w-14 h-14 rounded-2xl flex items-center justify-center"
                    style={{ backgroundColor: `${stat.color}15` }}
                  >
                    <Icon className="w-7 h-7" style={{ color: stat.color }} />
                  </div>
                  <div 
                    className="px-3 py-1 rounded-full text-sm"
                    style={{ backgroundColor: '#E8F5E9', color: '#4CAF50' }}
                  >
                    {stat.trend}
                  </div>
                </div>
                <div className="text-3xl font-semibold text-foreground mb-1">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Lớp học đang diễn ra */}
        <div 
          className="bg-white rounded-3xl p-6"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#FF3B30]/10 flex items-center justify-center">
                <Play className="w-6 h-6 text-[#FF3B30]" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-foreground">Lớp học đang diễn ra</h2>
                <p className="text-sm text-muted-foreground">{ongoingClasses.length} lớp đang trong giờ học</p>
              </div>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#FF3B30]/10 rounded-full">
              <div className="w-2 h-2 bg-[#FF3B30] rounded-full animate-pulse" />
              <span className="text-sm font-medium text-[#FF3B30]">Live</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ongoingClasses.map((cls, index) => (
              <div 
                key={index}
                className="p-5 rounded-2xl border-2 border-transparent hover:border-[#4ECDC4] transition-all cursor-pointer"
                style={{ 
                  background: `linear-gradient(135deg, ${cls.color}08 0%, ${cls.color}03 100%)`,
                  boxShadow: 'var(--shadow-softer)'
                }}
                onClick={() => {
                  setSelectedClass(cls);
                  setShowClassDetail(true);
                }}
              >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground mb-1">{cls.name}</h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>{cls.students}/{cls.maxStudents} học viên</span>
                    </div>
                  </div>
                  <div 
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                    style={{ backgroundColor: `${cls.color}20` }}
                  >
                    <BookOpen className="w-5 h-5" style={{ color: cls.color }} />
                  </div>
                </div>

                {/* Teacher & Room */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center gap-2 text-sm">
                    <GraduationCap className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{cls.teacher}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="w-4 h-4 text-muted-foreground" />
                    <span className="text-foreground">{cls.room}</span>
                  </div>
                </div>

                {/* Time Range */}
                <div className="mb-3">
                  <div className="flex items-center justify-between text-xs text-muted-foreground mb-1.5">
                    <span>{cls.startTime}</span>
                    <span>{cls.endTime}</span>
                  </div>
                  <div className="relative w-full h-2 bg-secondary rounded-full overflow-hidden">
                    <div 
                      className="absolute inset-y-0 left-0 rounded-full transition-all duration-300"
                      style={{ 
                        width: `${cls.progress}%`,
                        backgroundColor: cls.color
                      }}
                    />
                  </div>
                </div>

                {/* Status Badge */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <div 
                      className="w-2 h-2 rounded-full animate-pulse" 
                      style={{ backgroundColor: cls.color }}
                    />
                    <span className="text-xs font-medium" style={{ color: cls.color }}>
                      Đang học
                    </span>
                  </div>
                  <span className="text-xs text-muted-foreground">{cls.progress}% hoàn thành</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Upcoming Classes */}
          <div 
            className="lg:col-span-2 bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-foreground">Lớp học sắp tới</h2>
            </div>
            
            <div className="space-y-4">
              {upcomingClasses.map((cls, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl bg-secondary hover:bg-[#FFF4ED] transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedClass({
                      name: cls.name,
                      students: cls.students,
                      maxStudents: 20, // Default max
                      teacher: cls.teacher,
                      time: cls.time,
                      room: 'Phòng học chính', // Default
                      color: '#FF8C42',
                      progress: 0
                    });
                    setShowClassDetail(true);
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#FF8C42] flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">{cls.name}</div>
                        <div className="text-sm text-muted-foreground">{cls.teacher}</div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-medium text-foreground">{cls.students} học viên</div>
                      <div className="text-xs text-muted-foreground">{cls.date}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-[#FF8C42] mt-2">
                    <Clock className="w-4 h-4" />
                    <span className="font-medium">{cls.time}</span>
                    <span className="ml-2 px-2 py-0.5 bg-[#FF8C42] text-white rounded-full text-xs">
                      {cls.day}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Upcoming Events */}
          <div 
            className="bg-white rounded-3xl p-6"
            style={{ boxShadow: 'var(--shadow-soft)' }}
          >
            <h2 className="text-xl font-semibold text-foreground mb-6">Sự kiện sắp tới</h2>
            
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div 
                  key={index}
                  className="p-4 rounded-2xl border border-border hover:border-[#FF8C42] transition-colors cursor-pointer"
                >
                  <div className="font-semibold text-foreground mb-2">{event.title}</div>
                  <div className="text-sm text-muted-foreground mb-1">{event.date}</div>
                  <div className="flex items-center gap-2 text-sm text-[#FF8C42]">
                    <Clock className="w-4 h-4" />
                    <span>{event.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Class Detail Modal */}
      {showClassDetail && selectedClass && (
        <ClassDetail 
          classData={{
            id: 0, // Dummy ID
            name: selectedClass.name,
            level: 'Trung cấp',
            students: selectedClass.students,
            maxStudents: selectedClass.maxStudents,
            teacher: selectedClass.teacher,
            assistant: '',
            schedule: 'T2-T4-T6',
            time: selectedClass.time,
            room: selectedClass.room,
            color: selectedClass.color,
            progress: selectedClass.progress,
            type: 'regular',
            status: 'active'
          }}
          onClose={() => {
            setShowClassDetail(false);
            setSelectedClass(null);
          }}
          readOnly={true}
        />
      )}
    </div>
  );
}