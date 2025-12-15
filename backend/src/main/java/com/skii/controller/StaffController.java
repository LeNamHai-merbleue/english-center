package com.skii.controller;

import com.skii.dto.*;
import com.skii.config.CustomUserDetails;
import com.skii.service.StaffService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/staffs")
@RequiredArgsConstructor
public class StaffController {

    private final StaffService staffService;

    /**
     * 1. DANH SÁCH NHÂN VIÊN
     */
    @GetMapping("/list")
    public ResponseEntity<List<StaffResponseDTO>> getStaffList(
            @AuthenticationPrincipal CustomUserDetails admin,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) List<String> hashtagIds) {
        return ResponseEntity.ok(staffService.getStaffList(admin.getCenterId(), search, hashtagIds));
    }

    /**
     * 2. DANH SÁCH ỨNG VIÊN
     */
    @GetMapping("/candidates")
    public ResponseEntity<List<StaffResponseDTO>> getCandidateList(
            @AuthenticationPrincipal CustomUserDetails admin) {
        return ResponseEntity.ok(staffService.getPendingCandidates(admin.getCenterId()));
    }

    /**
     * 3. CHI TIẾT ĐƠN ỨNG TUYỂN
     */
    @GetMapping("/candidates/{requestId}")
    public ResponseEntity<CandidateDetailResponseDTO> getCandidateDetail(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId) {
        return ResponseEntity.ok(staffService.getCandidateDetail(requestId, admin.getCenterId()));
    }

    /**
     * 4. PHÊ DUYỆT ỨNG VIÊN
     * Chuyển JoinRequest thành Profile chính thức
     */
    @PostMapping("/candidates/{requestId}/approve")
    public ResponseEntity<?> approveCandidate(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId,
            @RequestBody List<String> hashtagIds) {
        try {
            if (hashtagIds == null || hashtagIds.isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("message", "Vui lòng chọn ít nhất một vai trò."));
            }
            return ResponseEntity.ok(staffService.approveCandidate(requestId, hashtagIds, admin.getCenterId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    /**
     * 5. TỪ CHỐI ỨNG VIÊN
     * Xóa bản ghi khỏi bảng JoinRequest
     */
    @DeleteMapping("/candidates/{requestId}/reject")
    public ResponseEntity<Void> rejectCandidate(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long requestId) {
        staffService.rejectCandidate(requestId, admin.getCenterId());
        return ResponseEntity.noContent().build();
    }

    // CÁC ENDPOINT LÀM VIỆC VỚI NHÂN VIÊN 

    @GetMapping("/{profileId}/detail")
    public ResponseEntity<StaffResponseDTO> getStaffDetail(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId) {
        return ResponseEntity.ok(staffService.getStaffDetail(profileId, admin.getCenterId()));
    }

    @PatchMapping("/{profileId}/update")
    public ResponseEntity<?> updateStaff(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId,
            @RequestBody UpdateStaffRequestDTO request) {
        try {
            return ResponseEntity.ok(staffService.updateStaff(profileId, request, admin.getCenterId()));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @DeleteMapping("/{profileId}")
    public ResponseEntity<Void> deleteStaff(
            @AuthenticationPrincipal CustomUserDetails admin,
            @PathVariable Long profileId) {
        staffService.deleteStaffProfile(profileId, admin.getCenterId());
        return ResponseEntity.noContent().build();
    }
}