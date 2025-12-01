import React from 'react';
import { Plus, Search, Filter, Calendar, Clock, MapPin, Users, Edit2, Trash2, X } from 'lucide-react';
import { useState } from 'react';
import { PageHeader } from './PageHeader';

interface Event {
  id: number;
  title: string;
  type: 'exam' | 'meeting' | 'event';
  date: string;
  time: string;
  location: string;
  participants?: string;
  description?: string;
  class?: string;
  color: string;
}

interface TimeSlot {
  time: string;
  monday?: Event;
  tuesday?: Event;
  wednesday?: Event;
  thursday?: Event;
  friday?: Event;
  saturday?: Event;
  sunday?: Event;
}

export function ScheduleEvents() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'exam' | 'meeting' | 'event'>('all');
  const [showAddEventModal, setShowAddEventModal] = useState(false);
  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [showEventDetail, setShowEventDetail] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<Event>>({
    type: 'exam',
    color: '#FF6B6B',
  });

  // Mock events data
  const [events, setEvents] = useState<Event[]>([
    {
      id: 1,
      title: 'Kiểm tra giữa kỳ IELTS',
      type: 'exam',
      date: '2025-01-20',
      time: '09:00 - 11:00',
      location: 'Phòng A101',
      class: 'IELTS Advanced 01',
      description: 'Kiểm tra 4 kỹ năng: Listening, Reading, Writing, Speaking',
      color: '#FF6B6B'
    },
    {
      id: 2,
      title: 'Họp phụ huynh lớp TOEIC',
      type: 'meeting',
      date: '2025-01-22',
      time: '18:00 - 19:30',
      location: 'Hội trường B',
      participants: '25 phụ huynh',
      class: 'TOEIC Intermediate 02',
      description: 'Báo cáo tiến độ học tập quý 1',
      color: '#4ECDC4'
    },
    {
      id: 3,
      title: 'Workshop "Phương pháp học từ vựng"',
      type: 'event',
      date: '2025-01-25',
      time: '14:00 - 16:00',
      location: 'Phòng đa năng',
      participants: 'Mở cho tất cả học viên',
      description: 'Chia sẻ phương pháp học từ vựng hiệu quả',
      color: '#FFD93D'
    },
    {
      id: 4,
      title: 'Thi thử IELTS Speaking',
      type: 'exam',
      date: '2025-01-23',
      time: '13:00 - 17:00',
      location: 'Phòng B201-B205',
      class: 'IELTS Advanced 01, 02, 03',
      description: 'Mock test Speaking với giám khảo người bản xứ',
      color: '#FF6B6B'
    },
    {
      id: 5,
      title: 'Ngày hội Tiếng Anh',
      type: 'event',
      date: '2025-01-27',
      time: '08:00 - 17:00',
      location: 'Toàn bộ trung tâm',
      participants: 'Tất cả học viên và phụ huynh',
      description: 'Các hoạt động giao lưu, trò chơi, biểu diễn bằng tiếng Anh',
      color: '#FFD93D'
    },
  ]);

  // Mock weekly schedule (time slots with classes and events)
  const weekDays = ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6', 'Thứ 7', 'CN'];
  const timeSlots = [
    '08:00',
    '09:00',
    '10:00',
    '11:00',
    '13:00',
    '14:00',
    '15:00',
    '16:00',
    '17:00',
    '18:00',
    '19:00',
  ];

  // Mock schedule data
  const schedule: { [key: string]: { [key: string]: { title: string; type: 'class' | 'event'; color: string; duration?: number } } } = {
    '09:00': {
      'monday': { title: 'IELTS Advanced 01', type: 'class', color: '#FF8C42', duration: 2 },
      'wednesday': { title: 'TOEIC Basic 02', type: 'class', color: '#6C5CE7', duration: 2 },
      'monday-event': { title: 'Kiểm tra giữa kỳ', type: 'event', color: '#FF6B6B', duration: 2 },
    },
    '14:00': {
      'tuesday': { title: 'General English Kids', type: 'class', color: '#00D2D3', duration: 1.5 },
      'thursday': { title: 'IELTS Intermediate 03', type: 'class', color: '#FF8C42', duration: 2 },
      'friday': { title: 'Workshop từ vựng', type: 'event', color: '#FFD93D', duration: 2 },
    },
    '18:00': {
      'monday': { title: 'TOEIC Advanced 01', type: 'class', color: '#6C5CE7', duration: 2 },
      'wednesday': { title: 'Họp phụ huynh', type: 'event', color: '#4ECDC4', duration: 1.5 },
      'friday': { title: 'IELTS Writing Class', type: 'class', color: '#FF8C42', duration: 2 },
    },
  };

  const getEventTypeLabel = (type: string) => {
    switch (type) {
      case 'exam':
        return 'Thi cử/Kiểm tra';
      case 'meeting':
        return 'Họp phụ huynh';
      case 'event':
        return 'Sự kiện';
      default:
        return type;
    }
  };

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'exam':
        return '📝';
      case 'meeting':
        return '👨‍👩‍👧‍👦';
      case 'event':
        return '🎉';
      default:
        return '📅';
    }
  };

  const filteredEvents = events.filter(event => {
    const matchesSearch = event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         event.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || event.type === filterType;
    return matchesSearch && matchesFilter;
  });

  const handleDeleteEvent = (eventId: number) => {
    setEvents(events.filter(e => e.id !== eventId));
    setShowEventDetail(false);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title || !newEvent.date || !newEvent.time || !newEvent.location) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc!');
      return;
    }

    const event: Event = {
      id: events.length + 1,
      title: newEvent.title,
      type: newEvent.type || 'exam',
      date: newEvent.date,
      time: newEvent.time,
      location: newEvent.location,
      participants: newEvent.participants,
      description: newEvent.description,
      class: newEvent.class,
      color: newEvent.color || '#FF6B6B',
    };

    setEvents([...events, event]);
    setShowAddEventModal(false);
    setNewEvent({ type: 'exam', color: '#FF6B6B' });
  };

  const handleEventTypeChange = (type: 'exam' | 'meeting' | 'event') => {
    let color = '#FF6B6B';
    if (type === 'meeting') color = '#4ECDC4';
    if (type === 'event') color = '#FFD93D';
    
    setNewEvent({ ...newEvent, type, color });
  };

  return (
    <div>
      {/* Header */}
      <PageHeader
        title="Lịch trình và Sự kiện"
        onAdd={() => setShowAddEventModal(true)}
        addLabel="Thêm sự kiện"
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
      />

      {/* Filter Bar */}
      <div className="px-6 pb-6">
        <div className="relative inline-block">
          <button
            onClick={() => setShowFilterDropdown(!showFilterDropdown)}
            className="flex items-center gap-2 px-6 py-3 bg-white border border-border rounded-2xl hover:border-primary transition-colors"
            style={{ boxShadow: 'var(--shadow-softer)' }}
          >
            <Filter className="w-5 h-5" />
            <span className="font-medium">
              {filterType === 'all' ? 'Tất cả' : getEventTypeLabel(filterType)}
            </span>
          </button>

          {showFilterDropdown && (
            <div 
              className="absolute left-0 top-full mt-2 w-56 bg-white rounded-2xl border border-border overflow-hidden z-10"
              style={{ boxShadow: 'var(--shadow-float)' }}
            >
              {['all', 'exam', 'meeting', 'event'].map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setFilterType(type as any);
                    setShowFilterDropdown(false);
                  }}
                  className="w-full px-4 py-3 text-left hover:bg-secondary/50 transition-colors flex items-center gap-3"
                >
                  <span className="text-xl">
                    {type === 'all' ? '📋' : getEventTypeIcon(type)}
                  </span>
                  <span className="text-foreground">
                    {type === 'all' ? 'Tất cả' : getEventTypeLabel(type)}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="px-6 pb-6">
        {/* Weekly Calendar */}
        <div 
          className="bg-white rounded-3xl p-6 mb-8"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-foreground">Lịch tuần này</h2>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>Tuần 15 - 21 Tháng 1, 2025</span>
            </div>
          </div>

          {/* Calendar Table */}
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="p-3 text-left text-sm font-semibold text-muted-foreground border-b border-border min-w-[80px]">
                    Giờ
                  </th>
                  {weekDays.map((day, index) => (
                    <th 
                      key={day} 
                      className="p-3 text-center text-sm font-semibold text-foreground border-b border-border min-w-[140px]"
                    >
                      <div>{day}</div>
                      <div className="text-xs text-muted-foreground font-normal mt-1">
                        {15 + index}/01
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {timeSlots.map((time) => (
                  <tr key={time}>
                    <td className="p-3 text-sm text-muted-foreground border-b border-border font-medium">
                      {time}
                    </td>
                    {['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'].map((day) => {
                      const slot = schedule[time]?.[day];
                      return (
                        <td 
                          key={day} 
                          className="p-2 border-b border-border border-r border-border/50 relative"
                          style={{ height: '80px' }}
                        >
                          {slot && (
                            <div
                              className="absolute inset-2 rounded-xl p-2 text-xs font-medium text-white cursor-pointer hover:scale-105 transition-transform flex flex-col justify-between"
                              style={{ 
                                backgroundColor: slot.color,
                                height: slot.duration ? `${slot.duration * 80}px` : '76px',
                              }}
                            >
                              <div className="line-clamp-2">{slot.title}</div>
                              <div className="text-xs opacity-90">
                                {slot.type === 'class' ? '📚' : getEventTypeIcon('event')}
                              </div>
                            </div>
                          )}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Events List */}
        <div 
          className="bg-white rounded-3xl p-6"
          style={{ boxShadow: 'var(--shadow-soft)' }}
        >
          <h2 className="text-xl font-semibold text-foreground mb-6">
            Danh sách sự kiện ({filteredEvents.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEvents.map((event) => (
              <div
                key={event.id}
                onClick={() => {
                  setSelectedEvent(event);
                  setShowEventDetail(true);
                }}
                className="p-5 rounded-2xl border-2 border-border hover:border-primary/50 hover:bg-secondary/20 transition-all cursor-pointer"
              >
                {/* Event Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-3">
                    <div 
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ backgroundColor: `${event.color}20` }}
                    >
                      {getEventTypeIcon(event.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-foreground line-clamp-2 mb-1">
                        {event.title}
                      </h3>
                      <span 
                        className="inline-block px-2 py-1 rounded-lg text-xs font-medium"
                        style={{ 
                          backgroundColor: `${event.color}15`,
                          color: event.color 
                        }}
                      >
                        {getEventTypeLabel(event.type)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Event Details */}
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar className="w-4 h-4 flex-shrink-0" />
                    <span>{new Date(event.date).toLocaleDateString('vi-VN')}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4 flex-shrink-0" />
                    <span>{event.time}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">{event.location}</span>
                  </div>
                  {event.participants && (
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4 flex-shrink-0" />
                      <span className="line-clamp-1">{event.participants}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {filteredEvents.length === 0 && (
            <div className="text-center py-12">
              <div className="w-20 h-20 rounded-full bg-secondary/50 flex items-center justify-center mx-auto mb-4">
                <Calendar className="w-10 h-10 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">Không tìm thấy sự kiện nào</p>
            </div>
          )}
        </div>

        {/* Event Detail Modal */}
        {showEventDetail && selectedEvent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowEventDetail(false)} />
            <div
              className="relative bg-white rounded-3xl p-6 w-full max-w-lg"
              style={{ boxShadow: 'var(--shadow-float)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${selectedEvent.color}20` }}
                  >
                    {getEventTypeIcon(selectedEvent.type)}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground mb-1">
                      {selectedEvent.title}
                    </h2>
                    <span 
                      className="inline-block px-2 py-1 rounded-lg text-xs font-medium"
                      style={{ 
                        backgroundColor: `${selectedEvent.color}15`,
                        color: selectedEvent.color 
                      }}
                    >
                      {getEventTypeLabel(selectedEvent.type)}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowEventDetail(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Details */}
              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-0.5">Ngày</div>
                    <div className="text-sm font-medium text-foreground">
                      {new Date(selectedEvent.date).toLocaleDateString('vi-VN', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                  <Clock className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-0.5">Thời gian</div>
                    <div className="text-sm font-medium text-foreground">{selectedEvent.time}</div>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <div className="flex-1">
                    <div className="text-xs text-muted-foreground mb-0.5">Địa điểm</div>
                    <div className="text-sm font-medium text-foreground">{selectedEvent.location}</div>
                  </div>
                </div>

                {selectedEvent.class && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-0.5">Lớp học</div>
                      <div className="text-sm font-medium text-foreground">{selectedEvent.class}</div>
                    </div>
                  </div>
                )}

                {selectedEvent.participants && (
                  <div className="flex items-center gap-3 p-3 bg-secondary/20 rounded-xl">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <div className="flex-1">
                      <div className="text-xs text-muted-foreground mb-0.5">Đối tượng tham gia</div>
                      <div className="text-sm font-medium text-foreground">{selectedEvent.participants}</div>
                    </div>
                  </div>
                )}

                {selectedEvent.description && (
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <div className="text-xs text-muted-foreground mb-1">Mô tả</div>
                    <div className="text-sm text-foreground">{selectedEvent.description}</div>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setShowEventDetail(false);
                    setShowAddEventModal(true);
                  }}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary/10 text-primary rounded-xl hover:bg-primary hover:text-white transition-colors"
                >
                  <Edit2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Chỉnh sửa</span>
                </button>
                <button
                  onClick={() => handleDeleteEvent(selectedEvent.id)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                  <span className="text-sm font-medium">Xóa</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Add Event Modal */}
        {showAddEventModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setShowAddEventModal(false)} />
            <div
              className="relative bg-white rounded-3xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto"
              style={{ boxShadow: 'var(--shadow-float)' }}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl"
                    style={{ backgroundColor: `${newEvent.color}20` }}
                  >
                    {getEventTypeIcon(newEvent.type || 'exam')}
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-foreground">
                      Thêm sự kiện mới
                    </h2>
                  </div>
                </div>
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="w-8 h-8 rounded-xl flex items-center justify-center hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4 text-muted-foreground" />
                </button>
              </div>

              {/* Form */}
              <div className="space-y-3 mb-5">
                {/* Event Type */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <div className="text-xs text-muted-foreground mb-2">Loại sự kiện</div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEventTypeChange('exam')}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        newEvent.type === 'exam' 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-primary border border-primary'
                      }`}
                    >
                      📝 Thi cử
                    </button>
                    <button
                      onClick={() => handleEventTypeChange('meeting')}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        newEvent.type === 'meeting' 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-primary border border-primary'
                      }`}
                    >
                      👨‍👩‍👧‍👦 Họp PH
                    </button>
                    <button
                      onClick={() => handleEventTypeChange('event')}
                      className={`flex-1 px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                        newEvent.type === 'event' 
                          ? 'bg-primary text-white' 
                          : 'bg-white text-primary border border-primary'
                      }`}
                    >
                      🎉 Sự kiện
                    </button>
                  </div>
                </div>

                {/* Title */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Tiêu đề sự kiện *</label>
                  <input
                    type="text"
                    placeholder="Nhập tiêu đề sự kiện..."
                    value={newEvent.title || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Date and Time */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Ngày *</label>
                    <input
                      type="date"
                      value={newEvent.date || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                  <div className="p-3 bg-secondary/20 rounded-xl">
                    <label className="text-xs text-muted-foreground mb-1.5 block">Thời gian *</label>
                    <input
                      type="text"
                      placeholder="09:00 - 11:00"
                      value={newEvent.time || ''}
                      onChange={(e) => setNewEvent({ ...newEvent, time: e.target.value })}
                      className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                    />
                  </div>
                </div>

                {/* Location */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Địa điểm *</label>
                  <input
                    type="text"
                    placeholder="Phòng A101"
                    value={newEvent.location || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Class */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Lớp học</label>
                  <input
                    type="text"
                    placeholder="IELTS Advanced 01"
                    value={newEvent.class || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, class: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Participants */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Đối tượng tham gia</label>
                  <input
                    type="text"
                    placeholder="25 phụ huynh"
                    value={newEvent.participants || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, participants: e.target.value })}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none"
                  />
                </div>

                {/* Description */}
                <div className="p-3 bg-secondary/20 rounded-xl">
                  <label className="text-xs text-muted-foreground mb-1.5 block">Mô tả</label>
                  <textarea
                    placeholder="Mô tả chi tiết về sự kiện..."
                    value={newEvent.description || ''}
                    onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-border focus:border-primary focus:outline-none resize-none"
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowAddEventModal(false)}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-secondary/50 text-foreground rounded-xl hover:bg-secondary transition-colors"
                >
                  <X className="w-4 h-4" />
                  <span className="text-sm font-medium">Hủy</span>
                </button>
                <button
                  onClick={handleSaveEvent}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  <span className="text-sm font-medium">Lưu sự kiện</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}