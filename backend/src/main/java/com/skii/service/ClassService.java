package com.skii.service;

import com.skii.dto.ClassDTO;
import com.skii.dto.ClassListResponse;
import com.skii.dto.ClassCardDTO;
import com.skii.entity.*;
import com.skii.entity.Class;
import com.skii.entity.ClassStudent.EnrollmentStatus;
import com.skii.mapper.ClassMapper;
import com.skii.repository.CenterRepository; // Cần thêm để lấy thực thể Center
import com.skii.repository.ClassRepository;
import com.skii.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ClassService {

    private final ClassRepository classRepository;
    private final UserRepository userRepository;
    private final CenterRepository centerRepository;
    private final ClassMapper classMapper;

    /**
     * 1. LẤY DANH SÁCH LỚP
     */
    @Transactional(readOnly = true)
    public ClassListResponse getClassListForAdmin(Long centerId, String type, String viewGroup) {
        Class.ClassType classType = Class.ClassType.valueOf(type.toUpperCase());
        
        List<Class.ClassStatus> statuses = viewGroup.equalsIgnoreCase("active") 
                ? List.of(Class.ClassStatus.ACTIVE) 
                : Arrays.asList(Class.ClassStatus.PENDING, Class.ClassStatus.OPENING);

        List<Class> classes = classRepository.findByCenterIdAndTypeAndStatusIn(centerId, classType, statuses);

        List<ClassCardDTO> cards = classes.stream()
                .map(classMapper::toCardDTO)
                .collect(Collectors.toList());

        return ClassListResponse.builder()
                .classes(cards)
                .totalItems((long) cards.size())
                .currentFilter(type.toUpperCase() + "_" + viewGroup.toUpperCase())
                .build();
    }

    /**
     * 2. TẠO LỚP MỚI
     */
    @Transactional
    public ClassDTO createNewClass(Long centerId, Class newClass) {
        // Lấy thực thể Center từ centerId bóc từ Token
        Center center = centerRepository.findById(centerId)
                .orElseThrow(() -> new RuntimeException("Trung tâm không tồn tại"));

        newClass.setCenter(center);
        newClass.setStatus(Class.ClassStatus.PENDING);
        newClass.setProgress(0);
        
        if (newClass.getType() == Class.ClassType.MAKEUP && newClass.getDate() == null) {
            throw new RuntimeException("Lớp học bù bắt buộc phải có ngày (date) cụ thể.");
        }
        
        return classMapper.toDTO(classRepository.save(newClass));
    }

    /**
     * 3. CHỐT NHÂN SỰ
     */
    @Transactional
    public ClassDTO assignStaffList(Long classId, Long teacherId, List<Long> assistantIds, Long centerId) {
        Class theClass = findAndValidateClass(classId, centerId);

        theClass.getClassStaffs().clear();

        User teacher = userRepository.findById(teacherId)
                .orElseThrow(() -> new RuntimeException("Giáo viên không tồn tại"));
        
        addStaffToClass(theClass, teacher, ClassStaff.StaffClassRole.MAIN_TEACHER);

        if (assistantIds != null) {
            assistantIds.stream().distinct().limit(2).forEach(id -> {
                userRepository.findById(id).ifPresent(ast -> 
                    addStaffToClass(theClass, ast, ClassStaff.StaffClassRole.ASSISTANT)
                );
            });
        }

        theClass.setStatus(Class.ClassStatus.OPENING);
        return classMapper.toDTO(classRepository.save(theClass));
    }

    /**
     * 4. DUYỆT HỌC SINH
     */
    @Transactional
    public ClassDTO approveStudent(Long classId, Long studentId, Long centerId) {
        Class theClass = findAndValidateClass(classId, centerId);
        
        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Học sinh không tồn tại"));

        if (theClass.getClassStudents().size() >= theClass.getMaxStudents()) {
            throw new RuntimeException("Lớp đã đầy sĩ số (" + theClass.getMaxStudents() + ")");
        }

        ClassStudent classStudent = new ClassStudent();
        classStudent.setClasss(theClass);
        classStudent.setStudent(student);
        classStudent.setEnrollmentDate(java.time.LocalDate.now());
        classStudent.setStatus(EnrollmentStatus.ACTIVE);
        
        theClass.getClassStudents().add(classStudent);
        theClass.getPendingStudents().removeIf(u -> u.getId().equals(studentId));

        return classMapper.toDTO(classRepository.save(theClass));
    }

    /**
     * 5. KÍCH HOẠT LỚP
     */
    @Transactional
    public ClassDTO activateClass(Long classId, Long centerId) {
        Class theClass = findAndValidateClass(classId, centerId);

        if (theClass.getClassStaffs().isEmpty()) {
            throw new RuntimeException("Lớp chưa có nhân sự, không thể kích hoạt.");
        }

        theClass.setStatus(Class.ClassStatus.ACTIVE);
        theClass.getClassStaffs().forEach(s -> s.setStatus(ClassStaff.AssignmentStatus.ACTIVE));
        theClass.getApplicantTeachers().clear();

        return classMapper.toDTO(classRepository.save(theClass));
    }

    /**
     * 6. LẤY CHI TIẾT LỚP
     */
    @Transactional(readOnly = true)
    public ClassDTO getClassDetail(Long id, Long centerId) {
        Class theClass = findAndValidateClass(id, centerId);
        return classMapper.toDTO(theClass);
    }

    /**
     * 7. XÓA LỚP
     */
    @Transactional
    public void deleteClass(Long id, Long centerId) {
        Class theClass = findAndValidateClass(id, centerId);
        classRepository.delete(theClass);
    }

    // --- HELPER METHODS ---

    private Class findAndValidateClass(Long classId, Long centerId) {
        Class theClass = classRepository.findById(classId)
                .orElseThrow(() -> new RuntimeException("Lớp học không tồn tại"));

        if (!theClass.getCenter().getId().equals(centerId)) {
            throw new RuntimeException("Cảnh báo bảo mật: Bạn không có quyền truy cập lớp của trung tâm khác!");
        }
        return theClass;
    }

    private void addStaffToClass(Class theClass, User staff, ClassStaff.StaffClassRole role) {
        ClassStaff classStaff = new ClassStaff();
        classStaff.setClasss(theClass);
        classStaff.setStaff(staff);
        classStaff.setRole(role);
        classStaff.setAssignedDate(java.time.LocalDate.now());
        classStaff.setStatus(ClassStaff.AssignmentStatus.PENDING_CONFIRM);
        theClass.getClassStaffs().add(classStaff);
    }
}