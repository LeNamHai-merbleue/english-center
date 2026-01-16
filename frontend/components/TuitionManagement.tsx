import React from 'react';
import { PageHeader } from './PageHeader';
import { DollarSign, Users, AlertCircle, Calendar, Search, ChevronDown, FileText, Info, Edit2, Plus, Trash2, X, GraduationCap, ChevronUp, Wallet, CheckCircle2, Settings } from 'lucide-react';
import { useState } from 'react';

interface Student {
  id: number;
  name: string;
  avatar: string;
  type: 'general' | 'course';
  
  // For general (per-session) students
  className?: string;
  pricePerSession?: number;
  months?: {
    month: string;
    sessions: number;
    amount: number;
  }[];
  supportClass?: {
    name: string;
    amount: number;
  };
  adjustments?: {
    type: 'discount' | 'surcharge';
    reason: string;
    amount: number;
  }[];
  isPaid?: boolean;
  
  // For course students
  courseName?: string;
  totalAmount?: number;
  paidAmount?: number;
  paymentSchedule?: {
    date: string;
    amount: number;
    status: 'paid' | 'pending' | 'upcoming';
  }[];
}

interface Teacher {
  id: number;
  name: string;
  avatar: string;
  department: string;
  position: string; 
  baseSalary: number; 
  workDays: number; 
  absentDays: number; 
  isPaid: boolean;
}

export function TuitionManagement() {
  const [mainTab, setMainTab] = useState<'tuition' | 'salary'>('tuition');
  const [mode, setMode] = useState<'general' | 'course'>('general');
  const [selectedMonth, setSelectedMonth] = useState('Tháng 12/2024');
  const [selectedCourse, setSelectedCourse] = useState('Tất cả khóa học');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMonthDropdown, setShowMonthDropdown] = useState(false);
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [hoveredRow, setHoveredRow] = useState<number | null>(null);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [expandedClasses, setExpandedClasses] = useState<Record<string, boolean>>({});
  
  // Salary settings
  const [showSalarySettings, setShowSalarySettings] = useState(false);
  const [salarySettings, setSalarySettings] = useState({
    maxAbsenceDays: 3,
    penaltyPerDay: 200000
  });

  // Mock data
  const [students, setStudents] = useState<Student[]>([
    {
      id: 1,
      name: 'Nguyễn Văn An',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=An',
      type: 'general',
      className: 'Lớp A',
      pricePerSession: 150000,
      months: [
        { month: 'Tháng 11', sessions: 4, amount: 600000 },
        { month: 'Tháng 12', sessions: 5, amount: 750000 }
      ],
      supportClass: {
        name: 'Speaking Club',
        amount: 300000
      },
      adjustments: [
        { type: 'discount', reason: 'Trừ bổ trợ tháng trước', amount: -200000 }
      ],
      isPaid: true
    },
    {
      id: 2,
      name: 'Trần Thị Bình',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Binh',
      type: 'general',
      className: 'Lớp B',
      pricePerSession: 150000,
      months: [
        { month: 'Tháng 12', sessions: 6, amount: 900000 }
      ],
      supportClass: {
        name: 'Grammar Workshop',
        amount: 250000
      },
      isPaid: false
    },
    {
      id: 3,
      name: 'Lê Minh Châu',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Chau',
      type: 'general',
      className: 'Lớp A',
      pricePerSession: 150000,
      months: [
        { month: 'Tháng 11', sessions: 3, amount: 450000 },
        { month: 'Tháng 12', sessions: 4, amount: 600000 }
      ],
      adjustments: [
        { type: 'discount', reason: 'Học phí cũ chưa thu', amount: -150000 }
      ],
      isPaid: true
    },
    {
      id: 4,
      name: 'Phạm Quốc Duy',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Duy',
      type: 'course',
      courseName: 'IELTS 6.5 Intensive',
      totalAmount: 15000000,
      paidAmount: 9000000,
      paymentSchedule: [
        { date: '01/11/2024', amount: 5000000, status: 'paid' },
        { date: '01/12/2024', amount: 4000000, status: 'paid' },
        { date: '01/01/2025', amount: 3000000, status: 'pending' },
        { date: '01/02/2025', amount: 3000000, status: 'upcoming' }
      ]
    },
    {
      id: 5,
      name: 'Hoàng Thị Nga',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nga',
      type: 'course',
      courseName: 'TOEIC 750+ Complete',
      totalAmount: 12000000,
      paidAmount: 12000000,
      paymentSchedule: [
        { date: '15/10/2024', amount: 6000000, status: 'paid' },
        { date: '15/11/2024', amount: 6000000, status: 'paid' }
      ]
    },
    {
      id: 6,
      name: 'Vũ Đức Thắng',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thang',
      type: 'course',
      courseName: 'IELTS 7.0 Premium',
      totalAmount: 18000000,
      paidAmount: 6000000,
      paymentSchedule: [
        { date: '01/12/2024', amount: 6000000, status: 'paid' },
        { date: '01/01/2025', amount: 6000000, status: 'pending' },
        { date: '01/02/2025', amount: 6000000, status: 'upcoming' }
      ]
    }
  ]);

  // Mock data for teachers
  const [teachers, setTeachers] = useState<Teacher[]>([
    {
      id: 1,
      name: 'Nguyễn Thị Minh',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Minh',
      department: 'Tiếng Anh',
      position: 'Giáo viên',
      baseSalary: 3000000,
      workDays: 20,
      absentDays: 2,
      isPaid: true
    },
    {
      id: 2,
      name: 'Trần Văn Nam',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nam',
      department: 'Tiếng Anh',
      position: 'Tutor',
      baseSalary: 2500000,
      workDays: 18,
      absentDays: 3,
      isPaid: false
    },
    {
      id: 3,
      name: 'Lê Thị Hồng',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Hong',
      department: 'Tiếng Anh',
      position: 'Trợ giảng',
      baseSalary: 2800000,
      workDays: 25,
      absentDays: 0,
      isPaid: true
    }
  ]);

  // Calculate overview stats
  const totalExpected = students
    .filter(s => mode === 'general' ? s.type === 'general' : s.type === 'course')
    .reduce((sum, student) => {
      if (student.type === 'general') {
        const monthTotal = student.months?.reduce((m, month) => m + month.amount, 0) || 0;
        const supportTotal = student.supportClass?.amount || 0;
        const adjustmentTotal = student.adjustments?.reduce((a, adj) => a + adj.amount, 0) || 0;
        return sum + monthTotal + supportTotal + adjustmentTotal;
      } else {
        return sum + (student.totalAmount || 0);
      }
    }, 0);

  const paidStudents = students.filter(s => {
    if (mode === 'general') {
      return s.type === 'general' && s.isPaid;
    } else {
      return s.type === 'course' && s.paidAmount === s.totalAmount;
    }
  });

  const totalStudents = students.filter(s => mode === 'general' ? s.type === 'general' : s.type === 'course').length;
  const paidPercentage = totalStudents > 0 ? (paidStudents.length / totalStudents) * 100 : 0;

  const totalDebt = students
    .filter(s => mode === 'general' ? s.type === 'general' : s.type === 'course')
    .reduce((sum, student) => {
      if (student.type === 'general') {
        if (!student.isPaid) {
          const monthTotal = student.months?.reduce((m, month) => m + month.amount, 0) || 0;
          const supportTotal = student.supportClass?.amount || 0;
          const adjustmentTotal = student.adjustments?.reduce((a, adj) => a + adj.amount, 0) || 0;
          return sum + monthTotal + supportTotal + adjustmentTotal;
        }
      } else {
        return sum + ((student.totalAmount || 0) - (student.paidAmount || 0));
      }
      return sum;
    }, 0);

  const filteredStudents = students.filter(s => {
    const matchType = mode === 'general' ? s.type === 'general' : s.type === 'course';
    const matchSearch = s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                       (s.courseName?.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchType && matchSearch;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
  };

  const months = ['Tháng 12/2024', 'Tháng 11/2024', 'Tháng 10/2024'];
  const courses = ['Tất cả khóa học', 'IELTS 6.5 Intensive', 'TOEIC 750+ Complete', 'IELTS 7.0 Premium'];

  // Handler functions
  const togglePaymentStatus = (studentId: number) => {
    setStudents(students.map(s => 
      s.id === studentId ? { ...s, isPaid: !s.isPaid } : s
    ));
  };

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setShowEditModal(true);
  };

  const handleSaveEdit = (updatedStudent: Student) => {
    setStudents(students.map(s => 
      s.id === updatedStudent.id ? updatedStudent : s
    ));
    setShowEditModal(false);
    setEditingStudent(null);
  };

  const handleTogglePayment = (studentId: number, paymentIndex: number) => {
    setStudents(students.map(s => {
      if (s.id === studentId && s.paymentSchedule) {
        const updatedSchedule = [...s.paymentSchedule];
        const currentStatus = updatedSchedule[paymentIndex].status;
        
        // Toggle: if paid -> pending, if not paid -> paid
        updatedSchedule[paymentIndex] = { 
          ...updatedSchedule[paymentIndex], 
          status: currentStatus === 'paid' ? 'pending' : 'paid' 
        };
        
        const newPaidAmount = updatedSchedule
          .filter(p => p.status === 'paid')
          .reduce((sum, p) => sum + p.amount, 0);
        return { ...s, paymentSchedule: updatedSchedule, paidAmount: newPaidAmount };
      }
      return s;
    }));
  };

  // Calculate teacher final salary with penalty
  const calculateTeacherSalary = (teacher: Teacher) => {
    const excessAbsence = Math.max(0, teacher.absentDays - salarySettings.maxAbsenceDays);
    const penalty = excessAbsence * salarySettings.penaltyPerDay;
    const finalSalary = teacher.baseSalary - penalty;
    return { finalSalary, penalty, excessAbsence };
  };

  // Group students by class for general tuition
  const groupedByClass = filteredStudents
    .filter(s => s.type === 'general')
    .reduce((groups, student) => {
      const className = student.className || 'Chưa phân lớp';
      if (!groups[className]) {
        groups[className] = [];
      }
      groups[className].push(student);
      return groups;
    }, {} as Record<string, Student[]>);

  return (
    <div>
      <PageHeader title="Quản lý học phí & lương" />
      
      <div className="px-6 pb-6">
        {/* Main Tab Selector */}
        <div 
          className="flex items-center gap-2 p-1 rounded-2xl bg-white mb-6"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <button
            onClick={() => setMainTab('tuition')}
            className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium ${
              mainTab === 'tuition'
                ? 'bg-[#FF8C42] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <DollarSign className="w-5 h-5" />
              <span>Quản lý học phí</span>
            </div>
          </button>
          <button
            onClick={() => setMainTab('salary')}
            className={`flex-1 px-6 py-3 rounded-xl transition-all font-medium ${
              mainTab === 'salary'
                ? 'bg-[#4ECDC4] text-white shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            <div className="flex items-center justify-center gap-2">
              <Wallet className="w-5 h-5" />
              <span>Quản lý lương</span>
            </div>
          </button>
        </div>

        {mainTab === 'tuition' ? (
          <>
        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Total Expected Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FF8C42]/10 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-[#FF8C42]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng thu dự kiến</p>
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(totalExpected)}</p>
              <p className="text-xs text-muted-foreground">{mode === 'general' ? 'Tháng 12/2024' : 'Tất cả khóa học'}</p>
            </div>
          </div>

          {/* Paid Students Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#f0f0f0"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#4ECDC4"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - paidPercentage / 100)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-foreground">{Math.round(paidPercentage)}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Học viên đã đóng</p>
              <p className="text-3xl font-semibold text-foreground">{paidStudents.length}/{totalStudents}</p>
              <p className="text-xs text-muted-foreground">học viên</p>
            </div>
          </div>

          {/* Total Debt Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB4B4]/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#FF6B6B]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng nợ đọng</p>
              <p className="text-3xl font-semibold text-[#FF6B6B]">{formatCurrency(totalDebt)}</p>
              <p className="text-xs text-muted-foreground">Chưa thanh toán</p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Header */}
        <div 
          className="sticky top-32 z-20 -mx-6 px-6 py-4 mb-6"
          style={{
            background: 'rgba(250, 250, 250, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center gap-4">
            {/* Segmented Control */}
            <div 
              className="flex items-center gap-2 p-1 rounded-2xl bg-white"
              style={{ boxShadow: 'var(--shadow-softer)' }}
            >
              <button
                onClick={() => setMode('general')}
                className={`px-5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  mode === 'general'
                    ? 'bg-[#FF8C42] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Học phí theo buổi
              </button>
              <button
                onClick={() => setMode('course')}
                className={`px-5 py-2.5 rounded-xl transition-all text-sm font-medium ${
                  mode === 'course'
                    ? 'bg-[#4ECDC4] text-white shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                Học phí lộ trình
              </button>
            </div>

            {/* Month/Course Dropdown */}
            <div className="relative">
              {mode === 'general' ? (
                <>
                  <button
                    onClick={() => setShowMonthDropdown(!showMonthDropdown)}
                    className="h-11 px-4 pr-10 rounded-2xl bg-white border border-border hover:border-[#FF8C42] transition-colors flex items-center gap-2"
                    style={{ boxShadow: 'var(--shadow-softer)' }}
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedMonth}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3" />
                  </button>
                  {showMonthDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowMonthDropdown(false)} />
                      <div 
                        className="absolute top-full left-0 mt-2 w-48 rounded-2xl bg-white z-40 overflow-hidden"
                        style={{ boxShadow: 'var(--shadow-float)' }}
                      >
                        {months.map((month) => (
                          <button
                            key={month}
                            onClick={() => {
                              setSelectedMonth(month);
                              setShowMonthDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors"
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              ) : (
                <>
                  <button
                    onClick={() => setShowCourseDropdown(!showCourseDropdown)}
                    className="h-11 px-4 pr-10 rounded-2xl bg-white border border-border hover:border-[#4ECDC4] transition-colors flex items-center gap-2"
                    style={{ boxShadow: 'var(--shadow-softer)' }}
                  >
                    <Calendar className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm">{selectedCourse}</span>
                    <ChevronDown className="w-4 h-4 text-muted-foreground absolute right-3" />
                  </button>
                  {showCourseDropdown && (
                    <>
                      <div className="fixed inset-0 z-30" onClick={() => setShowCourseDropdown(false)} />
                      <div 
                        className="absolute top-full left-0 mt-2 w-56 rounded-2xl bg-white z-40 overflow-hidden"
                        style={{ boxShadow: 'var(--shadow-float)' }}
                      >
                        {courses.map((course) => (
                          <button
                            key={course}
                            onClick={() => {
                              setSelectedCourse(course);
                              setShowCourseDropdown(false);
                            }}
                            className="w-full px-4 py-3 text-left text-sm hover:bg-secondary transition-colors"
                          >
                            {course}
                          </button>
                        ))}
                      </div>
                    </>
                  )}
                </>
              )}
            </div>

            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder={mode === 'general' ? 'Tìm theo tên học viên...' : 'Tìm theo tên học viên hoặc khóa học...'}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-border focus:border-[#FF8C42] focus:outline-none transition-colors"
                  style={{ boxShadow: 'var(--shadow-softer)' }}
                />
              </div>
            </div>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{filteredStudents.length}</span> học viên
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {mode === 'general' ? (
            // General Tuition (Per-Session)
            Object.entries(groupedByClass).map(([className, classStudents]) => {
              const pricePerSession = classStudents[0]?.pricePerSession || 0;
              const paidStudentsInClass = classStudents.filter(s => s.isPaid).length;
              const isExpanded = expandedClasses[className];
              
              return (
                <div key={className} className="space-y-3">
                  {/* Class Header - Clickable */}
                  <button
                    onClick={() => setExpandedClasses(prev => ({ ...prev, [className]: !prev[className] }))}
                    className="w-full flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-[#FF8C42]/10 to-[#FF8C42]/5 border border-[#FF8C42]/20 hover:from-[#FF8C42]/15 hover:to-[#FF8C42]/8 transition-all cursor-pointer"
                    style={{ boxShadow: 'var(--shadow-softer)' }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-xl bg-[#FF8C42]/20 flex items-center justify-center">
                        <GraduationCap className="w-5 h-5 text-[#FF8C42]" />
                      </div>
                      <div className="text-left">
                        <h3 className="font-semibold text-foreground flex items-center gap-2">
                          {className}
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-muted-foreground" />
                          )}
                        </h3>
                        <div className="flex items-center gap-3 mt-1">
                          <p className="text-xs text-muted-foreground">{classStudents.length} học viên</p>
                          <div className="w-1 h-1 rounded-full bg-muted-foreground/30" />
                          <p className="text-xs font-medium text-green-600">
                            {paidStudentsInClass}/{classStudents.length} đã đóng
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-muted-foreground mb-0.5">Học phí/buổi</p>
                      <p className="text-lg font-semibold text-[#FF8C42]">{formatCurrency(pricePerSession)}</p>
                    </div>
                  </button>

                  {/* Students in this class - Collapsible */}
                  {isExpanded && classStudents.map((student) => (
                    <div
                      key={student.id}
                      onMouseEnter={() => setHoveredRow(student.id)}
                      onMouseLeave={() => setHoveredRow(null)}
                      className="relative p-5 rounded-2xl bg-white transition-all duration-300"
                      style={{
                        boxShadow: hoveredRow === student.id ? 'var(--shadow-float)' : 'var(--shadow-soft)',
                        transform: hoveredRow === student.id ? 'translateY(-2px)' : 'translateY(0)'
                      }}
                    >
                      <div className="flex items-start gap-6">
                        {/* Avatar & Name (Sticky Column) */}
                        <div className="flex items-center gap-3 min-w-[200px]">
                          <img 
                            src={student.avatar} 
                            alt={student.name}
                            className="w-12 h-12 rounded-2xl"
                          />
                          <div>
                            <h3 className="font-semibold text-foreground">{student.name}</h3>
                            <p className="text-xs text-muted-foreground">ID: {student.id}</p>
                          </div>
                        </div>

                        {/* Month Details */}
                        <div className="flex-1 flex flex-wrap gap-3">
                          {student.months?.map((month, idx) => (
                            <div 
                              key={idx}
                              className="px-4 py-2 rounded-xl bg-secondary border border-border"
                            >
                              <p className="text-xs text-muted-foreground mb-0.5">{month.month}</p>
                              <p className="text-sm">
                                <span className="font-medium text-foreground">{month.sessions} buổi</span>
                                <span className="mx-1.5 text-muted-foreground">•</span>
                                <span className="font-semibold text-[#FF8C42]">{formatCurrency(month.amount)}</span>
                              </p>
                            </div>
                          ))}
                        </div>

                        {/* Support Class */}
                        {student.supportClass && (
                          <div className="px-4 py-2 rounded-xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/20">
                            <p className="text-xs text-[#4ECDC4] mb-0.5">Lớp bổ trợ</p>
                            <p className="text-sm">
                              <span className="font-medium text-foreground">{student.supportClass.name}</span>
                              <span className="mx-1.5 text-muted-foreground">•</span>
                              <span className="font-semibold text-[#4ECDC4]">{formatCurrency(student.supportClass.amount)}</span>
                            </p>
                          </div>
                        )}

                        {/* Adjustments */}
                        {student.adjustments && student.adjustments.length > 0 && (
                          <div className="relative group">
                            <div className="px-4 py-2 rounded-xl bg-yellow-50 border border-yellow-200">
                              <p className="text-xs text-yellow-700 mb-0.5">Phát sinh/Giảm trừ</p>
                              <p className="text-sm font-semibold text-yellow-800">
                                {formatCurrency(student.adjustments.reduce((sum, adj) => sum + adj.amount, 0))}
                              </p>
                            </div>
                            <div className="absolute left-0 top-full mt-2 w-64 p-3 rounded-xl bg-gray-900 text-white text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
                              {student.adjustments.map((adj, idx) => (
                                <div key={idx} className="mb-1 last:mb-0">
                                  <span className="opacity-80">{adj.reason}:</span> <span className="font-semibold">{formatCurrency(adj.amount)}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Status Toggle */}
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => togglePaymentStatus(student.id)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all hover:scale-105 ${
                              student.isPaid 
                                ? 'bg-green-50 text-green-700 border border-green-200 hover:bg-green-100' 
                                : 'bg-orange-50 text-orange-700 border border-orange-200 hover:bg-orange-100'
                            }`}
                            title="Click để thay đổi trạng thái"
                          >
                            {student.isPaid ? '✓ Đã đóng' : '○ Chưa đóng'}
                          </button>
                        </div>

                        {/* Total Amount */}
                        <div className="text-right min-w-[120px]">
                          <p className="text-xs text-muted-foreground mb-0.5">Tổng cộng</p>
                          <p className="text-lg font-semibold text-foreground">
                            {formatCurrency(
                              (student.months?.reduce((sum, m) => sum + m.amount, 0) || 0) +
                              (student.supportClass?.amount || 0) +
                              (student.adjustments?.reduce((sum, adj) => sum + adj.amount, 0) || 0)
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Hover Action */}
                      {hoveredRow === student.id && (
                        <button
                          onClick={() => alert(`Xuất hóa đơn cho ${student.name}`)}
                          className="absolute top-3 right-3 px-4 py-2 rounded-xl bg-[#FF8C42] hover:bg-[#FF7A2E] text-white text-sm font-medium flex items-center gap-2 transition-colors"
                          style={{ boxShadow: 'var(--shadow-soft)' }}
                        >
                          <FileText className="w-4 h-4" />
                          Xuất hóa đơn
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              );
            })
          ) : (
            // Course Tuition (Full Course)
            filteredStudents.map((student) => {
              const paymentPercentage = student.totalAmount ? ((student.paidAmount || 0) / student.totalAmount) * 100 : 0;
              
              return (
                <div
                  key={student.id}
                  onMouseEnter={() => setHoveredRow(student.id)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="relative p-6 rounded-2xl bg-white transition-all duration-300"
                  style={{
                    boxShadow: hoveredRow === student.id ? 'var(--shadow-float)' : 'var(--shadow-soft)',
                    transform: hoveredRow === student.id ? 'translateY(-2px)' : 'translateY(0)'
                  }}
                >
                  <div className="flex items-start gap-6">
                    {/* Avatar & Name */}
                    <div className="flex items-center gap-3 min-w-[200px]">
                      <img 
                        src={student.avatar} 
                        alt={student.name}
                        className="w-12 h-12 rounded-2xl"
                      />
                      <div>
                        <h3 className="font-semibold text-foreground">{student.name}</h3>
                        <p className="text-xs text-muted-foreground">ID: {student.id}</p>
                      </div>
                    </div>

                    {/* Course Name */}
                    <div className="flex-1">
                      <div className="mb-3">
                        <p className="text-xs text-muted-foreground mb-1">Khóa học</p>
                        <h4 className="text-lg font-semibold text-foreground">{student.courseName}</h4>
                      </div>

                      {/* Payment Progress */}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">Tiến độ thanh toán</span>
                          <span className="font-semibold text-foreground">{Math.round(paymentPercentage)}%</span>
                        </div>
                        <div className="h-3 bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#44B7AE] rounded-full transition-all duration-500"
                            style={{ width: `${paymentPercentage}%` }}
                          />
                        </div>
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-muted-foreground">
                            Đã đóng: <span className="font-semibold text-[#4ECDC4]">{formatCurrency(student.paidAmount || 0)}</span>
                          </span>
                          <span className="text-muted-foreground">
                            Tổng: <span className="font-semibold text-foreground">{formatCurrency(student.totalAmount || 0)}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Payment Schedule */}
                    <div className="min-w-[300px]">
                      <p className="text-xs text-muted-foreground mb-3">Lịch thanh toán (Click: đã đóng | Double-click: chưa đóng)</p>
                      <div className="space-y-2">
                        {student.paymentSchedule?.map((payment, idx) => (
                          <button
                            key={idx}
                            onClick={() => handleTogglePayment(student.id, idx)}
                            onDoubleClick={() => handleTogglePayment(student.id, idx)}
                            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-sm transition-all cursor-pointer ${
                              payment.status === 'paid' 
                                ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                                : payment.status === 'pending'
                                ? 'bg-orange-50 border border-orange-200 hover:bg-orange-100'
                                : 'bg-gray-50 border border-gray-200 hover:bg-gray-100'
                            }`}
                            title={payment.status === 'paid' ? 'Click 1 lần: đánh dấu chưa đóng' : 'Click 1 lần: đánh dấu đã đóng'}
                          >
                            <div className="flex items-center gap-2">
                              <div className={`w-2 h-2 rounded-full ${
                                payment.status === 'paid' 
                                  ? 'bg-green-500' 
                                  : payment.status === 'pending'
                                  ? 'bg-orange-500'
                                  : 'bg-gray-400'
                              }`} />
                              <span className={`font-medium ${
                                payment.status === 'paid' 
                                  ? 'text-green-700' 
                                  : payment.status === 'pending'
                                  ? 'text-orange-700'
                                  : 'text-gray-600'
                              }`}>
                                {payment.date}
                              </span>
                            </div>
                            <span className={`font-semibold ${
                              payment.status === 'paid' 
                                ? 'text-green-700' 
                                : payment.status === 'pending'
                                ? 'text-orange-700'
                                : 'text-gray-600'
                            }`}>
                              {formatCurrency(payment.amount)}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Remaining Amount */}
                    <div className="text-right min-w-[140px]">
                      <p className="text-xs text-muted-foreground mb-1">Còn lại</p>
                      <p className="text-2xl font-semibold text-[#FF6B6B]">
                        {formatCurrency((student.totalAmount || 0) - (student.paidAmount || 0))}
                      </p>
                      <div className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-medium ${
                        paymentPercentage === 100
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-orange-50 text-orange-700 border border-orange-200'
                      }`}>
                        {paymentPercentage === 100 ? 'Hoàn thành' : 'Đang học'}
                      </div>
                    </div>
                  </div>

                  {/* Hover Action */}
                  {hoveredRow === student.id && (
                    <button
                      onClick={() => alert(`Xuất hóa đơn cho ${student.name}`)}
                      className="absolute top-3 right-3 px-4 py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#44B7AE] text-white text-sm font-medium flex items-center gap-2 transition-colors"
                      style={{ boxShadow: 'var(--shadow-soft)' }}
                    >
                      <FileText className="w-4 h-4" />
                      Xuất hóa đơn
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>
          </>
        ) : (
          <>
        {/* Salary Management Content */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          {/* Total Salary Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center">
                <Wallet className="w-6 h-6 text-[#4ECDC4]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng lương</p>
              <p className="text-3xl font-semibold text-foreground">{formatCurrency(teachers.reduce((sum, t) => sum + calculateTeacherSalary(t).finalSalary, 0))}</p>
              <p className="text-xs text-muted-foreground">Tháng 12/2024</p>
            </div>
          </div>

          {/* Paid Teachers Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#4ECDC4]/10 flex items-center justify-center">
                <Users className="w-6 h-6 text-[#4ECDC4]" />
              </div>
              <div className="relative w-16 h-16">
                <svg className="transform -rotate-90 w-16 h-16">
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#f0f0f0"
                    strokeWidth="6"
                    fill="none"
                  />
                  <circle
                    cx="32"
                    cy="32"
                    r="28"
                    stroke="#4ECDC4"
                    strokeWidth="6"
                    fill="none"
                    strokeDasharray={`${2 * Math.PI * 28}`}
                    strokeDashoffset={`${2 * Math.PI * 28 * (1 - teachers.filter(t => t.isPaid).length / teachers.length)}`}
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-foreground">{Math.round(teachers.filter(t => t.isPaid).length / teachers.length * 100)}%</span>
                </div>
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Giáo viên đã nhận lương</p>
              <p className="text-3xl font-semibold text-foreground">{teachers.filter(t => t.isPaid).length}/{teachers.length}</p>
              <p className="text-xs text-muted-foreground">giáo viên</p>
            </div>
          </div>

          {/* Total Debt Card */}
          <div 
            className="p-6 rounded-3xl bg-white"
            style={{ boxShadow: 'var(--shadow-float)' }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl bg-[#FFB4B4]/10 flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-[#FF6B6B]" />
              </div>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Tổng nợ lương</p>
              <p className="text-3xl font-semibold text-[#FF6B6B]">{formatCurrency(teachers.reduce((sum, t) => sum + calculateTeacherSalary(t).finalSalary * (t.isPaid ? 0 : 1), 0))}</p>
              <p className="text-xs text-muted-foreground">Chưa thanh toán</p>
            </div>
          </div>
        </div>

        {/* Sticky Filter Header */}
        <div 
          className="sticky top-32 z-20 -mx-6 px-6 py-4 mb-6"
          style={{
            background: 'rgba(250, 250, 250, 0.8)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderTop: '1px solid rgba(0, 0, 0, 0.05)',
            borderBottom: '1px solid rgba(0, 0, 0, 0.05)'
          }}
        >
          <div className="flex items-center gap-4">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <Search className="w-4 h-4 text-muted-foreground absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Tìm theo tên giáo viên..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full h-11 pl-11 pr-4 rounded-2xl bg-white border border-border focus:border-[#FF8C42] focus:outline-none transition-colors"
                  style={{ boxShadow: 'var(--shadow-softer)' }}
                />
              </div>
            </div>

            {/* Settings Button */}
            <button
              onClick={() => setShowSalarySettings(true)}
              className="h-11 px-4 rounded-2xl bg-white border border-border hover:border-[#4ECDC4] transition-colors flex items-center gap-2"
              style={{ boxShadow: 'var(--shadow-softer)' }}
            >
              <Settings className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm font-medium">Cài đặt</span>
            </button>

            <div className="text-sm text-muted-foreground">
              <span className="font-medium text-foreground">{teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).length}</span> giáo viên
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="space-y-4">
          {teachers.filter(t => t.name.toLowerCase().includes(searchQuery.toLowerCase())).map((teacher) => {
            const { finalSalary, penalty, excessAbsence } = calculateTeacherSalary(teacher);
            
            return (
              <div
                key={teacher.id}
                onMouseEnter={() => setHoveredRow(teacher.id)}
                onMouseLeave={() => setHoveredRow(null)}
                className="relative p-6 rounded-2xl bg-white transition-all duration-300"
                style={{
                  boxShadow: hoveredRow === teacher.id ? 'var(--shadow-float)' : 'var(--shadow-soft)',
                  transform: hoveredRow === teacher.id ? 'translateY(-2px)' : 'translateY(0)'
                }}
              >
                <div className="flex items-start gap-6">
                  {/* Avatar & Name */}
                  <div className="flex items-center gap-3 min-w-[200px]">
                    <img 
                      src={teacher.avatar} 
                      alt={teacher.name}
                      className="w-12 h-12 rounded-2xl"
                    />
                    <div>
                      <h3 className="font-semibold text-foreground">{teacher.name}</h3>
                      <p className="text-xs text-muted-foreground">ID: {teacher.id}</p>
                    </div>
                  </div>

                  {/* Position & Department Info */}
                  <div className="flex-1 space-y-4">
                    {/* Basic Info */}
                    <div className="flex items-center gap-6">
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Vị trí</p>
                        <p className="font-semibold text-foreground">{teacher.position}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Bộ môn</p>
                        <p className="font-semibold text-foreground">{teacher.department}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-0.5">Lương cứng</p>
                        <p className="font-semibold text-[#4ECDC4]">{formatCurrency(teacher.baseSalary)}</p>
                      </div>
                    </div>

                    {/* Work Days Info */}
                    <div className="flex items-center gap-6">
                      <div className="px-4 py-2 rounded-xl bg-green-50 border border-green-200">
                        <p className="text-xs text-green-600 mb-0.5">Ngày làm việc</p>
                        <p className="font-semibold text-green-700">{teacher.workDays} ngày</p>
                      </div>
                      <div className={`px-4 py-2 rounded-xl ${
                        excessAbsence > 0 
                          ? 'bg-red-50 border border-red-200' 
                          : 'bg-gray-50 border border-gray-200'
                      }`}>
                        <p className={`text-xs mb-0.5 ${
                          excessAbsence > 0 ? 'text-red-600' : 'text-gray-600'
                        }`}>Ngày nghỉ</p>
                        <p className={`font-semibold ${
                          excessAbsence > 0 ? 'text-red-700' : 'text-gray-700'
                        }`}>{teacher.absentDays} ngày</p>
                      </div>
                      {penalty > 0 && (
                        <div className="px-4 py-2 rounded-xl bg-orange-50 border border-orange-200">
                          <p className="text-xs text-orange-600 mb-0.5">Phạt vắng ({excessAbsence} ngày)</p>
                          <p className="font-semibold text-orange-700">-{formatCurrency(penalty)}</p>
                        </div>
                      )}
                    </div>

                    {/* Payment Progress */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Tiến độ thanh toán</span>
                        <span className="font-semibold text-foreground">{teacher.isPaid ? '100%' : '0%'}</span>
                      </div>
                      <div className="h-3 bg-secondary rounded-full overflow-hidden">
                        <div 
                          className="h-full bg-gradient-to-r from-[#4ECDC4] to-[#44B7AE] rounded-full transition-all duration-500"
                          style={{ width: `${teacher.isPaid ? '100%' : '0%'}` }}
                        />
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                          Đã đóng: <span className="font-semibold text-[#4ECDC4]">{teacher.isPaid ? formatCurrency(finalSalary) : '0'}</span>
                        </span>
                        <span className="text-muted-foreground">
                          Tổng: <span className="font-semibold text-foreground">{formatCurrency(finalSalary)}</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Action */}
                  <div className="min-w-[250px]">
                    <p className="text-xs text-muted-foreground mb-3">Thanh toán lương (Click để đánh dấu)</p>
                    <div className="space-y-2">
                      <button
                        onClick={() => setTeachers(teachers.map(t => t.id === teacher.id ? { ...t, isPaid: !t.isPaid } : t))}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all cursor-pointer ${
                          teacher.isPaid 
                            ? 'bg-green-50 border border-green-200 hover:bg-green-100' 
                            : 'bg-orange-50 border border-orange-200 hover:bg-orange-100'
                        }`}
                        title={teacher.isPaid ? 'Click: đánh dấu chưa thanh toán' : 'Click: đánh dấu đã thanh toán'}
                      >
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${
                            teacher.isPaid 
                              ? 'bg-green-500' 
                              : 'bg-orange-500'
                          }`} />
                          <span className={`font-medium ${
                            teacher.isPaid 
                              ? 'text-green-700' 
                              : 'text-orange-700'
                          }`}>
                            01/12/2024
                          </span>
                        </div>
                        <span className={`font-semibold ${
                          teacher.isPaid 
                            ? 'text-green-700' 
                            : 'text-orange-700'
                        }`}>
                          {formatCurrency(finalSalary)}
                        </span>
                      </button>
                    </div>
                  </div>

                  {/* Final Amount */}
                  <div className="text-right min-w-[140px]">
                    <p className="text-xs text-muted-foreground mb-1">Còn lại</p>
                    <p className="text-2xl font-semibold text-[#FF6B6B]">
                      {formatCurrency(finalSalary * (teacher.isPaid ? 0 : 1))}
                    </p>
                    <div className={`inline-block mt-2 px-3 py-1 rounded-lg text-xs font-medium ${
                      teacher.isPaid
                        ? 'bg-green-50 text-green-700 border border-green-200'
                        : 'bg-orange-50 text-orange-700 border border-orange-200'
                    }`}>
                      {teacher.isPaid ? 'Đã thanh toán' : 'Chưa thanh toán'}
                    </div>
                  </div>
                </div>

                {/* Hover Action */}
                {hoveredRow === teacher.id && (
                  <button
                    onClick={() => alert(`Xuất hóa đơn lương cho ${teacher.name}`)}
                    className="absolute top-3 right-3 px-4 py-2 rounded-xl bg-[#4ECDC4] hover:bg-[#44B7AE] text-white text-sm font-medium flex items-center gap-2 transition-colors"
                    style={{ boxShadow: 'var(--shadow-soft)' }}
                  >
                    <FileText className="w-4 h-4" />
                    Xuất hóa đơn
                  </button>
                )}
              </div>
            );
          })}
        </div>
          </>
        )}
      </div>

      {/* Salary Settings Modal */}
      {showSalarySettings && (
        <>
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50"
            onClick={() => setShowSalarySettings(false)}
          />
          
          {/* Modal */}
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div 
              className="w-full max-w-md p-6 rounded-3xl bg-white pointer-events-auto"
              style={{ boxShadow: 'var(--shadow-float)' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#4ECDC4]/10 flex items-center justify-center">
                    <Settings className="w-5 h-5 text-[#4ECDC4]" />
                  </div>
                  <h3 className="text-xl font-semibold">Cài đặt lương</h3>
                </div>
                <button
                  onClick={() => setShowSalarySettings(false)}
                  className="w-8 h-8 rounded-xl hover:bg-secondary transition-colors flex items-center justify-center"
                >
                  <X className="w-5 h-5 text-muted-foreground" />
                </button>
              </div>

              {/* Settings Form */}
              <div className="space-y-5">
                {/* Max Absence Days */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Số ngày vắng tối đa cho phép
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={salarySettings.maxAbsenceDays}
                      onChange={(e) => setSalarySettings({ ...salarySettings, maxAbsenceDays: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-2xl bg-secondary border border-border focus:border-[#4ECDC4] focus:outline-none transition-colors"
                      min="0"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      ngày
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Giáo viên sẽ bị phạt nếu vượt quá số ngày này
                  </p>
                </div>

                {/* Penalty Per Day */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Mức phạt mỗi ngày vượt quá
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      value={salarySettings.penaltyPerDay}
                      onChange={(e) => setSalarySettings({ ...salarySettings, penaltyPerDay: parseInt(e.target.value) || 0 })}
                      className="w-full px-4 py-3 rounded-2xl bg-secondary border border-border focus:border-[#4ECDC4] focus:outline-none transition-colors"
                      min="0"
                      step="10000"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      VND
                    </span>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    Số tiền trừ vào lương cho mỗi ngày vắng vượt quá
                  </p>
                </div>

                {/* Preview */}
                <div className="p-4 rounded-2xl bg-[#4ECDC4]/10 border border-[#4ECDC4]/20">
                  <p className="text-xs text-[#4ECDC4] font-medium mb-2">Ví dụ:</p>
                  <p className="text-sm text-foreground">
                    Giáo viên nghỉ <span className="font-semibold">{salarySettings.maxAbsenceDays + 2} ngày</span> sẽ bị phạt:{' '}
                    <span className="font-semibold text-orange-600">
                      {formatCurrency(2 * salarySettings.penaltyPerDay)}
                    </span>
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => setShowSalarySettings(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-secondary text-foreground font-medium hover:bg-secondary/80 transition-colors"
                >
                  Hủy
                </button>
                <button
                  onClick={() => setShowSalarySettings(false)}
                  className="flex-1 px-4 py-3 rounded-2xl bg-[#4ECDC4] text-white font-medium hover:bg-[#44B7AE] transition-colors"
                >
                  Lưu cài đặt
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}