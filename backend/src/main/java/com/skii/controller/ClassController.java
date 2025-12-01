package com.skii.controller;

import com.skii.dto.ClassDTO;
import com.skii.dto.ClassListResponse;
import com.skii.entity.Class;
import com.skii.entity.Class.ClassType;
import com.skii.entity.Class.ClassStyle;
import com.skii.config.CustomUserDetails;
import com.skii.service.ClassService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/classes")
@RequiredArgsConstructor
public class ClassController {

    private final ClassService classService;

    // ==========================================
    // 1. NHÓM API TẠO LỚP (CREATE)
    // ==========================================

    @PostMapping("/create/regular-sessions")
    public ResponseEntity<ClassDTO> createRegularSessions(
            @RequestBody ClassDTO dto, 
            @AuthenticationPrincipal CustomUserDetails user) {
        
        Class newClass = Class.builder()
                .name(dto.getName())
                .level(dto.getLevel())
                .type(ClassType.REGULAR)
                .style(ClassStyle.SESSION_BASED)
                .maxStudents(dto.getMaxStudents())
                .totalSessions(dto.getTotalSessions())
                .defaultRoom(dto.getDefaultRoom())
                .note(dto.getNote())
                .build();

        // user.getCenterId() lấy trực tiếp từ Token đã giải mã
        return ResponseEntity.ok(classService.createNewClass(user.getCenterId(), newClass));
    }

    @PostMapping("/create/regular-phases")
    public ResponseEntity<ClassDTO> createRegularPhases(
            @RequestBody ClassDTO dto, 
            @AuthenticationPrincipal CustomUserDetails user) {
        
        Class newClass = Class.builder()
                .name(dto.getName())
                .level(dto.getLevel())
                .type(ClassType.REGULAR)
                .style(ClassStyle.PHASE_BASED)
                .maxStudents(dto.getMaxStudents())
                .phases(dto.getPhases())
                .defaultRoom(dto.getDefaultRoom())
                .note(dto.getNote())
                .build();
        
        return ResponseEntity.ok(classService.createNewClass(user.getCenterId(), newClass));
    }

    @PostMapping("/create/makeup")
    public ResponseEntity<ClassDTO> createMakeupClass(
            @RequestBody ClassDTO dto, 
            @AuthenticationPrincipal CustomUserDetails user) {
        
        Class newClass = Class.builder()
                .name(dto.getName())
                .type(ClassType.MAKEUP)
                .style(ClassStyle.SESSION_BASED)
                .date(dto.getDate())
                .maxStudents(dto.getMaxStudents())
                .defaultRoom(dto.getDefaultRoom())
                .note(dto.getNote())
                .build();
        
        return ResponseEntity.ok(classService.createNewClass(user.getCenterId(), newClass));
    }

    // ==========================================
    // 2. API DANH SÁCH & CHI TIẾT (READ)
    // ==========================================

    @GetMapping("/list")
    public ResponseEntity<ClassListResponse> getClassList(
            @RequestParam String type,      // "REGULAR" hoặc "MAKEUP"
            @RequestParam String viewGroup, // "ACTIVE" hoặc "WAITING"
            @AuthenticationPrincipal CustomUserDetails user) {
        
        // Chỉ lấy lớp học thuộc trung tâm của Admin đang đăng nhập
        return ResponseEntity.ok(classService.getClassListForAdmin(user.getCenterId(), type, viewGroup));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ClassDTO> getClassDetail(
            @PathVariable Long id, 
            @AuthenticationPrincipal CustomUserDetails user) {
        
        // Truyền centerId để Service kiểm tra: Admin không được xem lớp của trung tâm khác
        return ResponseEntity.ok(classService.getClassDetail(id, user.getCenterId()));
    }

    // ==========================================
    // 3. API DUYỆT & THAO TÁC (UPDATE/ACTION)
    // ==========================================

    @PostMapping("/{id}/assign-staff")
    public ResponseEntity<ClassDTO> assignStaff(
            @PathVariable Long id,
            @RequestParam Long teacherId,
            @RequestParam(required = false) List<Long> assistantIds,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        // Đảm bảo thao tác gán nhân sự diễn ra trong phạm vi trung tâm của Admin
        return ResponseEntity.ok(classService.assignStaffList(id, teacherId, assistantIds, user.getCenterId()));
    }

    @PostMapping("/{id}/approve-student/{studentId}")
    public ResponseEntity<ClassDTO> approveStudent(
            @PathVariable Long id, 
            @PathVariable Long studentId,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        return ResponseEntity.ok(classService.approveStudent(id, studentId, user.getCenterId()));
    }

    @PostMapping("/{id}/activate")
    public ResponseEntity<ClassDTO> activateClass(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        return ResponseEntity.ok(classService.activateClass(id, user.getCenterId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteClass(
            @PathVariable Long id,
            @AuthenticationPrincipal CustomUserDetails user) {
        
        classService.deleteClass(id, user.getCenterId());
        return ResponseEntity.noContent().build();
    }
}