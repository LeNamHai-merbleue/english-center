package com.skii.config;

import com.skii.entity.User;
import com.skii.repository.AdminRepository;
import com.skii.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;
    private final AdminRepository adminRepository;

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        // 1. Kiểm tra User có tồn tại trong hệ thống không
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("Không tìm thấy người dùng với email: " + email));

        // 2. Tìm thông tin Admin dựa trên userId để lấy CenterId
        // Đây chính là logic "lấy centerId từ bảng Admin" mà bạn đã nêu
        Long centerId = adminRepository.findByUserId(user.getId())
                .map(admin -> admin.getCenter().getId())
                .orElse(null); 
                // Nếu centerId là null, người này có thể là User bình thường hoặc SuperAdmin

        // 3. Trả về đối tượng CustomUserDetails chứa đầy đủ thông tin (UserId, Email, Password, CenterId)
        return new CustomUserDetails(user, centerId);
    }
}