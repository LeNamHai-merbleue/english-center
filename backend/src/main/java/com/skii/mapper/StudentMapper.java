package com.skii.mapper;

import com.skii.dto.*;
import com.skii.entity.*;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Component
public class StudentMapper {

    /**
     * Chuyển đổi từ JoinRequest sang StudentResponseDTO.
     * Dùng để hiển thị danh sách ứng viên học viên
     */
    public StudentResponseDTO toResponseFromJoinRequest(JoinRequest request) {
        if (request == null) {
            System.out.println("DEBUG: StudentMapper nhận vào một Request NULL");
            return null;
        }

        User user = request.getUser();

        return StudentResponseDTO.builder()
                .profileId(request.getId()) 
                .userId(user != null ? user.getId() : null)
                .name(user != null ? user.getName() : "N/A")
                .email(user != null ? user.getEmail() : "N/A")
                .phone(user != null ? user.getPhone() : "N/A")
                .avatar(user != null ? user.getAvatar() : null)
                .status("PENDING") 
                .joinDate(null)    
                .note(request.getMessage()) 
                .hashtag(GroupedHashtagResponseDTO.builder()
                        .roles(new ArrayList<>())
                        .traits(new ArrayList<>())
                        .build()) 
                .build();
    }

    /**
     * Chuyển đổi từ thực thể UserCenterProfile sang StudentResponseDTO.
     * Phục vụ cho học viên chính thức.
     */
    public StudentResponseDTO toResponseDTO(UserCenterProfile profile) {
        if (profile == null) return null;

        User user = profile.getUser();
        
        List<Hashtag> hashtags = (profile.getHashtags() != null) 
                ? new ArrayList<>(profile.getHashtags()) 
                : new ArrayList<>();

        GroupedHashtagResponseDTO groupedHashtags = GroupedHashtagResponseDTO.builder()
                .roles(filterTagsByType(hashtags, "ROLE"))
                .traits(filterTagsByType(hashtags, "TRAIT"))
                .build();

        return StudentResponseDTO.builder()
                .profileId(profile.getId())
                .userId(user != null ? user.getId() : null)
                .name(user != null ? user.getName() : "N/A")
                .email(user != null ? user.getEmail() : "N/A")
                .phone(user != null ? user.getPhone() : "N/A")
                .avatar(user != null ? user.getAvatar() : null)
                .status(profile.getStatus())
                .joinDate(profile.getJoinDate())
                .experience(profile.getExperience())
                // .rating(profile.getRating()) -> Loại bỏ rating cho Student
                .totalClasses(profile.getTotalClasses())
                .currentLevel(profile.getCurrentLevel())
                .note(profile.getNote())
                .hashtag(groupedHashtags)
                .build();
    }

    /**
     * Chuyển đổi thực thể Hashtag sang DTO
     */
    public HashtagDTO toHashtagDTO(Hashtag hashtag) {
        if (hashtag == null) return null;
        return HashtagDTO.builder()
                .id(hashtag.getId())
                .name(hashtag.getName())
                .type(hashtag.getType())
                .isSystem(hashtag.isSystem())
                .build();
    }

    /**
     * Hàm helper lọc Hashtag theo loại (ROLE/TRAIT)
     */
    public List<HashtagDTO> filterTagsByType(List<Hashtag> hashtags, String type) {
        if (hashtags == null) return new ArrayList<>();
        return hashtags.stream()
                .filter(h -> type.equalsIgnoreCase(h.getType()))
                .map(this::toHashtagDTO)
                .collect(Collectors.toList());
    }
}