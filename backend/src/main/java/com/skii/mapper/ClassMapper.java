package com.skii.mapper;

import com.skii.dto.*;
import com.skii.entity.Class;
import com.skii.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class ClassMapper {

    /**
     * Map Entity Class sang DTO đầy đủ thông tin chi tiết cho Modal
     */
    public ClassDTO toDTO(Class entity) {
        if (entity == null) return null;

        Long centerId = (entity.getCenter() != null) ? entity.getCenter().getId() : null;

        return ClassDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .level(entity.getLevel())
                .type(entity.getType())
                .style(entity.getStyle())
                .status(entity.getStatus())
                .maxStudents(entity.getMaxStudents())
                .totalSessions(entity.getTotalSessions())
                .phases(entity.getPhases())
                .progress(entity.getProgress() != null ? entity.getProgress() : 0)
                .defaultRoom(entity.getDefaultRoom())
                .schedule(formatSchedule(entity))
                .time(formatTimeRange(entity))
                .date(entity.getDate())
                .note(entity.getNote())
                
                // --- NHÂN SỰ ---
                .staffs(mapClassStaffToDTOList(entity.getClassStaffs()))
                .requestedTeachers(mapUsersToDTOList(entity.getApplicantTeachers(), centerId))

                // --- HỌC SINH ---
                .students(mapClassStudentToDTOList(entity.getClassStudents()))
                .pendingStudents(mapUsersToDTOList(entity.getPendingStudents(), centerId))
                
                .currentStudentCount(entity.getClassStudents() != null ? entity.getClassStudents().size() : 0)
                .build();
    }

    /**
     * Chuyển đổi List<User> sang List<UserDTO>
     * Lấy thông tin Experience, Rating, Hashtags từ UserCenterProfile của trung tâm hiện tại
     */
    private List<UserDTO> mapUsersToDTOList(List<User> users, Long centerId) {
        if (users == null) return new ArrayList<>();
        return users.stream().map((User u) -> {
            // Tìm profile tại trung tâm cụ thể
            UserCenterProfile profile = u.getProfiles().stream()
                    .filter(p -> p.getCenter().getId().equals(centerId))
                    .findFirst()
                    .orElse(null);

            return UserDTO.builder()
                    .id(u.getId())
                    .name(u.getName())
                    .avatar(u.getAvatar())
                    .experience(profile != null ? profile.getExperience() : "Mới")
                    .rating(profile != null ? profile.getRating() : 5.0)
                    
                    // SỬA LỖI: Chuyển Set<Hashtag> sang List<String>
                    .hashtags(profile != null && profile.getHashtags() != null 
                        ? profile.getHashtags().stream()
                            .map(Hashtag::getName) // Giả sử Entity Hashtag có method getName()
                            .collect(Collectors.toList())
                        : new ArrayList<>())
                    
                    .status(profile != null && profile.getStatus() != null ? profile.getStatus() : "PENDING")
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Chuyển đổi List ClassStaff (Nhân sự chính thức)
     */
    private List<ClassStaffDTO> mapClassStaffToDTOList(List<ClassStaff> staffs) {
        if (staffs == null) return new ArrayList<>();
        return staffs.stream().map((ClassStaff s) -> {
            User user = s.getStaff();
            return ClassStaffDTO.builder()
                    .id(s.getId())
                    .staffId(user.getId())
                    .staffName(user.getName())
                    .role(s.getRole())
                    .status(s.getStatus())
                    .hourlyRate(s.getHourlyRate())
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Chuyển đổi List ClassStudent (Học sinh chính thức)
     */
    private List<ClassStudentDTO> mapClassStudentToDTOList(List<ClassStudent> students) {
        if (students == null) return new ArrayList<>();
        return students.stream().map((ClassStudent s) -> {
            User st = s.getStudent();
            return ClassStudentDTO.builder()
                    .id(s.getId())
                    .studentId(st.getId())
                    .studentName(st.getName())
                    .status(s.getStatus())
                    .midtermScore(s.getMidtermScore() != null ? s.getMidtermScore() : 0.0)
                    .finalScore(s.getFinalScore() != null ? s.getFinalScore() : 0.0)
                    .teacherRemark(s.getTeacherRemark())
                    .build();
        }).collect(Collectors.toList());
    }

    /**
     * Mapping cho Card View danh sách lớp
     */
    public ClassCardDTO toCardDTO(Class entity) {
        if (entity == null) return null;
        return ClassCardDTO.builder()
                .id(entity.getId())
                .name(entity.getName())
                .level(entity.getLevel())
                .progress(entity.getProgress() != null ? entity.getProgress() : 0)
                .currentStudents(entity.getClassStudents() != null ? entity.getClassStudents().size() : 0)
                .maxStudents(entity.getMaxStudents())
                .schedule(formatSchedule(entity))
                .time(formatTimeRange(entity))
                .room(entity.getDefaultRoom())
                .build();
    }

    // --- HELPER METHODS ---

    private String formatSchedule(Class entity) {
        if (entity.getSchedules() == null || entity.getSchedules().isEmpty()) return "Chưa có lịch";
        return entity.getSchedules().stream()
                .map(s -> s.getDayOfWeek() != null ? s.getDayOfWeek().getLabel() : "")
                .filter(label -> !label.isEmpty())
                .collect(Collectors.joining(", "));
    }

    private String formatTimeRange(Class entity) {
        if (entity.getSchedules() == null || entity.getSchedules().isEmpty()) return "TBD";
        ClassSchedule first = entity.getSchedules().get(0);
        String start = first.getStartTime() != null ? first.getStartTime().toString() : "";
        String end = first.getEndTime() != null ? first.getEndTime().toString() : "";
        return start.isEmpty() ? "TBD" : start + " - " + end;
    }
}