package com.skii.controller;

import com.skii.dto.*;
import com.skii.config.CustomUserDetails;
import com.skii.service.StudentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    /**
     * 1. DANH SÁCH HỌC VIÊN CHÍNH THỨC
     */
    @GetMapping("/list")
    public ResponseEntity<List<StudentResponseDTO>> getStudentList(
            @AuthenticationPrincipal CustomUserDetails admin,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> hashtagIds) {
        return ResponseEntity.ok(studentService.getStudentList(admin.getCenterId(), search, hashtagIds));
    }

    /**
     * 2. DANH SÁCH HỌC VIÊN MỚI ĐĂNG KÝ
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<StudentResponseDTO>> getCandidateList(
            @AuthenticationPrincipal CustomUserDetails admin) {
        return ResponseEntity.ok(studentService.getPendingCandidates(admin.getCenterId()));
    }

    /**
     * 3. CHI TIẾT ĐƠN ĐĂNG KÝ HỌC
     */
    @GetMapping("/candidates/{requestId}")
    public ResponseEntity<CandidateDetailResponseDTO> getCandidateDetail(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId) {
        // CandidateDetailResponseDTO có thể dùng chung vì nó chứa các field cơ bản + suggested hashtags
        return ResponseEntity.ok(studentService.getCandidateDetail(requestId, admin.getCenterId()));
    }

    /**
     * 4. PHÊ DUYỆT HỌC VIÊN
     * Chuyển JoinRequest thành Profile học viên chính thức
     */
    @PostMapping("/candidates/{requestId}/approve")
    public ResponseEntity<?> approveStudent(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId,
            @RequestBody List<String> hashtagIds) {
        try {
            if (hashtagIds == null || hashtagIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn ít nhất một nhãn lớp/vai trò học viên."));
            }
            return ResponseEntity.ok(studentService.approveStudent(requestId, hashtagIds, admin.getCenterId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 5. TỪ CHỐI ĐƠN ĐĂNG KÝ HỌC
     */
    @DeleteMapping("/candidates/{requestId}/reject")
    public ResponseEntity<Void> rejectStudent(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId) {
        studentService.rejectCandidate(requestId, admin.getCenterId());
        return ResponseEntity.noContent().build();
    }

    // CÁC ENDPOINT LÀM VIỆC VỚI HỒ SƠ HỌC VIÊN 

    @GetMapping("/{profileId}/detail")
    public ResponseEntity<StudentResponseDTO> getStudentDetail(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId) {
        return ResponseEntity.ok(studentService.getStudentDetail(profileId, admin.getCenterId()));
    }

    /**
     * Cập nhật thông tin học viên
     */
    @PatchMapping("/{profileId}/update")
    public ResponseEntity<?> updateStudent(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId,
            @RequestBody UpdateStudentRequestDTO request) { // Cần tạo UpdateStudentRequestDTO tương tự Staff
        try {
            return ResponseEntity.ok(studentService.updateStudent(profileId, request, admin.getCenterId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteStudent(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId) {
        studentService.deleteStudentProfile(profileId, admin.getCenterId());
        return ResponseEntity.noContent().build();
    }
}