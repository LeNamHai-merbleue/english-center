package com.skii.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.util.List;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class GroupedHashtagResponseDTO {
    private List<HashtagDTO> roles;  // Chứa hashtag type="ROLE"
    private List<HashtagDTO> traits; // Chứa hashtag type="TRAIT"
}