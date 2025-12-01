package com.skii.service;

import com.skii.dto.*;
import com.skii.entity.*;
import com.skii.repository.*;
import com.skii.mapper.StaffMapper;
import com.skii.entity.JoinRequest.RequestStatus;
import com.skii.entity.JoinRequest.RequestType;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StaffService {

    private final UserCenterProfileRepository profileRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final HashtagRepository hashtagRepository;
    private final StaffMapper staffMapper;

    // =========================================================================
    // PHẦN 1: QUẢN LÝ ỨNG VIÊN (JOIN REQUESTS)
    // =========================================================================

    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getPendingCandidates(Long centerId) {
        List<JoinRequest> requests = joinRequestRepository.findByCenterIdAndTypeAndStatus(
                centerId, RequestType.STAFF_REQUEST, RequestStatus.PENDING);
        
        return requests.stream()
                .map(staffMapper::toResponseFromJoinRequest)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidateDetailResponseDTO getCandidateDetail(Long requestId, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển ID: " + requestId));
        
        validateCenterOwnership(request.getCenter().getId(), centerId);

        List<Hashtag> availableHashtags = hashtagRepository.findByCenterIdOrSystem(centerId);
        String studentTagId = "STUDENT_" + centerId;
        List<Hashtag> staffOnlyHashtags = availableHashtags.stream()
                .filter(h -> !h.getId().equals(studentTagId))
                .collect(Collectors.toList());

        return CandidateDetailResponseDTO.builder()
                .profileId(request.getId())
                .name(request.getUser().getName())
                .email(request.getUser().getEmail())
                .phone(request.getUser().getPhone())
                .avatar(request.getUser().getAvatar())
                .note(request.getMessage())
                .suggestedRoles(staffMapper.filterTagsByType(staffOnlyHashtags, "ROLE"))
                .suggestedTraits(staffMapper.filterTagsByType(staffOnlyHashtags, "TRAIT"))
                .build();
    }

    @Transactional
    public StaffResponseDTO approveCandidate(Long requestId, List<String> hashtagIds, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển ID: " + requestId));

        validateCenterOwnership(request.getCenter().getId(), centerId);

        String studentTagId = "STUDENT_" + centerId;
        if (hashtagIds != null && hashtagIds.contains(studentTagId)) {
            throw new RuntimeException("Lỗi: Không thể gán vai trò Học sinh cho nhân sự.");
        }

        UserCenterProfile profile = new UserCenterProfile();
        profile.setUser(request.getUser());
        profile.setCenter(request.getCenter());
        profile.setStatus("ACTIVE");
        profile.setJoinDate(LocalDate.now());

        if (hashtagIds != null && !hashtagIds.isEmpty()) {
            Set<Hashtag> selectedHashtags = hashtagRepository.findAllByIdInAndCenterId(hashtagIds, centerId);
            profile.setHashtags(selectedHashtags);
        }

        UserCenterProfile savedProfile = profileRepository.save(profile);
        joinRequestRepository.delete(request);

        return staffMapper.toResponseDTO(savedProfile);
    }

    @Transactional
    public void rejectCandidate(Long requestId, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn ứng tuyển ID: " + requestId));
        
        validateCenterOwnership(request.getCenter().getId(), centerId);
        joinRequestRepository.delete(request);
    }


    // =========================================================================
    // PHẦN 2: QUẢN LÝ NHÂN VIÊN CHÍNH THỨC (PROFILES)
    // =========================================================================

    /**
     * CẬP NHẬT: Truyền thêm studentTagId để Repository loại trừ học sinh
     */
    @Transactional(readOnly = true)
    public List<StaffResponseDTO> getStaffList(Long centerId, String search, List<String> hashtagIds) {
        String studentTagId = "STUDENT_" + centerId;
        // Gọi hàm repository mới có logic NOT EXISTS studentTagId
        List<UserCenterProfile> profiles = profileRepository.findStaffsByFilters(centerId, studentTagId, search, hashtagIds);
        return profiles.stream().map(staffMapper::toResponseDTO).collect(Collectors.toList());
    }

    /**
     * MỚI: Lấy tổng số lượng nhân sự (phục vụ thống kê/dashboard)
     */
    @Transactional(readOnly = true)
    public long getTotalStaffCount(Long centerId) {
        String studentTagId = "STUDENT_" + centerId;
        return profileRepository.countTotalStaffs(centerId, studentTagId);
    }

    @Transactional(readOnly = true)
    public StaffResponseDTO getStaffDetail(Long profileId, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        return staffMapper.toResponseDTO(profile);
    }

    @Transactional
    public StaffResponseDTO updateStaff(Long profileId, UpdateStaffRequestDTO request, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        String studentTagId = "STUDENT_" + centerId;

        if (request.getHashtagIds() != null) {
            if (request.getHashtagIds().contains(studentTagId)) {
                throw new RuntimeException("Lỗi: Không thể chuyển đổi nhân sự thành học sinh.");
            }
            Set<Hashtag> updatedTags = hashtagRepository.findAllByIdInAndCenterId(request.getHashtagIds(), centerId);
            profile.setHashtags(updatedTags);
        }

        if (request.getBaseSalary() != null) profile.setBaseSalary(request.getBaseSalary());
        if (request.getRating() != null) profile.setRating(request.getRating());
        if (request.getNote() != null) profile.setNote(request.getNote());
        if (request.getStatus() != null) profile.setStatus(request.getStatus());

        return staffMapper.toResponseDTO(profileRepository.save(profile));
    }

    @Transactional
    public void deleteStaffProfile(Long profileId, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        profileRepository.delete(profile);
    }


    // =========================================================================
    // PHẦN 3: HÀM BỔ TRỢ (HELPER METHODS)
    // =========================================================================

    private UserCenterProfile findAndValidateProfile(Long profileId, Long centerId) {
        UserCenterProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ nhân sự ID: " + profileId));
        validateCenterOwnership(profile.getCenter().getId(), centerId);
        return profile;
    }

    private void validateCenterOwnership(Long objectCenterId, Long adminCenterId) {
        if (!objectCenterId.equals(adminCenterId)) {
            throw new RuntimeException("Vi phạm bảo mật: Dữ liệu này không thuộc trung tâm của bạn!");
        }
    }
}