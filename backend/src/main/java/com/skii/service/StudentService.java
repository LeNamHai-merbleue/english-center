package com.skii.service;

import com.skii.dto.*;
import com.skii.entity.*;
import com.skii.repository.*;
import com.skii.mapper.StudentMapper;
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
public class StudentService {

    private final UserCenterProfileRepository profileRepository;
    private final JoinRequestRepository joinRequestRepository;
    private final HashtagRepository hashtagRepository;
    private final StudentMapper studentMapper;

    // =========================================================================
    // PHẦN 1: QUẢN LÝ ĐƠN ĐĂNG KÝ HỌC (JOIN REQUESTS)
    // =========================================================================

    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getPendingCandidates(Long centerId) {
        List<JoinRequest> requests = joinRequestRepository.findByCenterIdAndTypeAndStatus(
                centerId, RequestType.STUDENT_REQUEST, RequestStatus.PENDING);
        
        return requests.stream()
                .map(studentMapper::toResponseFromJoinRequest)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public CandidateDetailResponseDTO getCandidateDetail(Long requestId, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký ID: " + requestId));
        
        validateCenterOwnership(request.getCenter().getId(), centerId);

        List<Hashtag> availableHashtags = hashtagRepository.findByCenterIdOrSystem(centerId);
        
        return CandidateDetailResponseDTO.builder()
                .profileId(request.getId())
                .name(request.getUser().getName())
                .email(request.getUser().getEmail())
                .phone(request.getUser().getPhone())
                .avatar(request.getUser().getAvatar())
                .note(request.getMessage())
                .suggestedRoles(studentMapper.filterTagsByType(availableHashtags, "ROLE"))
                .suggestedTraits(studentMapper.filterTagsByType(availableHashtags, "TRAIT"))
                .build();
    }

    @Transactional
    public StudentResponseDTO approveStudent(Long requestId, List<String> hashtagIds, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký ID: " + requestId));

        validateCenterOwnership(request.getCenter().getId(), centerId);

        String studentTagId = "STUDENT_" + centerId;
        if (hashtagIds == null || !hashtagIds.contains(studentTagId)) {
            throw new RuntimeException("Lỗi: Phải gán vai trò Học sinh cho hồ sơ đăng ký học.");
        }

        UserCenterProfile profile = new UserCenterProfile();
        profile.setUser(request.getUser());
        profile.setCenter(request.getCenter());
        profile.setStatus("ACTIVE");
        profile.setEnrolledDate(LocalDate.now()); // Sử dụng trường học viên

        if (hashtagIds != null && !hashtagIds.isEmpty()) {
            Set<Hashtag> selectedHashtags = hashtagRepository.findAllByIdInAndCenterId(hashtagIds, centerId);
            profile.setHashtags(selectedHashtags);
        }

        UserCenterProfile savedProfile = profileRepository.save(profile);
        joinRequestRepository.delete(request);

        return studentMapper.toResponseDTO(savedProfile);
    }

    @Transactional
    public void rejectCandidate(Long requestId, Long centerId) {
        JoinRequest request = joinRequestRepository.findById(requestId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy đơn đăng ký ID: " + requestId));
        
        validateCenterOwnership(request.getCenter().getId(), centerId);
        joinRequestRepository.delete(request);
    }


    // =========================================================================
    // PHẦN 2: QUẢN LÝ HỌC VIÊN CHÍNH THỨC (PROFILES)
    // =========================================================================

    /**
     * CẬP NHẬT: Sử dụng findStudentsByFilters để đảm bảo chỉ lấy đúng học viên
     */
    @Transactional(readOnly = true)
    public List<StudentResponseDTO> getStudentList(Long centerId, String search, List<String> hashtagIds) {
        String studentTagId = "STUDENT_" + centerId;
        
        // Gọi repository chuyên biệt cho học viên (có logic EXISTS studentTagId)
        List<UserCenterProfile> profiles = profileRepository.findStudentsByFilters(
                centerId, studentTagId, search, hashtagIds);
                
        return profiles.stream().map(studentMapper::toResponseDTO).collect(Collectors.toList());
    }

    /**
     * MỚI: Lấy tổng số lượng học viên chính thức
     */
    @Transactional(readOnly = true)
    public long getTotalStudentCount(Long centerId) {
        String studentTagId = "STUDENT_" + centerId;
        return profileRepository.countTotalStudents(centerId, studentTagId);
    }

    @Transactional(readOnly = true)
    public StudentResponseDTO getStudentDetail(Long profileId, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        return studentMapper.toResponseDTO(profile);
    }

    @Transactional
    public StudentResponseDTO updateStudent(Long profileId, UpdateStudentRequestDTO request, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        String studentTagId = "STUDENT_" + centerId;

        if (request.getHashtagIds() != null) {
            if (!request.getHashtagIds().contains(studentTagId)) {
                throw new RuntimeException("Lỗi: Không thể bỏ vai trò Học sinh của hồ sơ này.");
            }
            Set<Hashtag> updatedTags = hashtagRepository.findAllByIdInAndCenterId(request.getHashtagIds(), centerId);
            profile.setHashtags(updatedTags);
        }

        if (request.getNote() != null) profile.setNote(request.getNote());
        if (request.getStatus() != null) profile.setStatus(request.getStatus());

        return studentMapper.toResponseDTO(profileRepository.save(profile));
    }

    @Transactional
    public void deleteStudentProfile(Long profileId, Long centerId) {
        UserCenterProfile profile = findAndValidateProfile(profileId, centerId);
        profileRepository.delete(profile);
    }

    // =========================================================================
    // PHẦN 3: HÀM BỔ TRỢ (HELPER METHODS)
    // =========================================================================

    private UserCenterProfile findAndValidateProfile(Long profileId, Long centerId) {
        UserCenterProfile profile = profileRepository.findById(profileId)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy hồ sơ học viên ID: " + profileId));
        validateCenterOwnership(profile.getCenter().getId(), centerId);
        return profile;
    }

    private void validateCenterOwnership(Long objectCenterId, Long adminCenterId) {
        if (!objectCenterId.equals(adminCenterId)) {
            throw new RuntimeException("Vi phạm bảo mật: Dữ liệu học viên này không thuộc trung tâm của bạn!");
        }
    }
}