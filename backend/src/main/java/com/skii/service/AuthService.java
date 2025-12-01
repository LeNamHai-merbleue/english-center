package com.skii.service;

import com.skii.dto.*;
import com.skii.entity.*;
import com.skii.repository.*;
import com.skii.config.JwtUtils;
import com.skii.config.CustomUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final CenterRepository centerRepository;
    private final AdminRepository adminRepository;
    private final HashtagRepository hashtagRepository; // 1. Tiêm thêm HashtagRepository
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    /**
     * ĐĂNG KÝ ADMIN & TRUNG TÂM
     * Đã cập nhật: Tự động khởi tạo hashtag STUDENT cho trung tâm mới.
     */
    @Transactional
    public String registerAdminWithCenter(AdminRegisterDTO dto) {
        if (userRepository.existsByEmail(dto.getEmail())) {
            throw new RuntimeException("Email tài khoản đã tồn tại!");
        }

        // 1. Tạo trung tâm trước để lấy ID
        Center center = new Center();
        center.setName(dto.getCenterName());
        center.setAddress(dto.getCenterAddress());
        center.setEmail(dto.getCenterEmail());
        center = centerRepository.save(center);

        // 2. KHỞI TẠO HASHTAG STUDENT MẶC ĐỊNH
        // Việc tạo này nằm trong @Transactional nên nếu lỗi ở dưới, hashtag cũng sẽ bị rollback
        initializeSystemHashtags(center);

        // 3. Tạo User (Lưu ý: Phải mã hóa mật khẩu)
        User user = User.builder()
                .name(dto.getName())
                .email(dto.getEmail())
                .password(passwordEncoder.encode(dto.getPassword()))
                .phone(dto.getPhone())
                .isAdmin(true)
                .build();
        user = userRepository.save(user);

        // 4. Tạo bản ghi bảng Admin (Bảng ghép)
        Admin admin = new Admin();
        admin.setUser(user);
        admin.setCenter(center);
        adminRepository.save(admin);

        return "Đăng ký thành công trung tâm " + center.getName();
    }

    /**
     * Hàm helper để tạo hashtag STUDENT bắt buộc cho mỗi trung tâm
     */
    private void initializeSystemHashtags(Center center) {
        Hashtag studentTag = Hashtag.builder()
                .id("STUDENT_" + center.getId()) // ID duy nhất: STUDENT_1, STUDENT_2...
                .name("Học sinh")
                .type("ROLE")
                .isSystem(true) // Đánh dấu là nhãn hệ thống để bảo vệ (không cho xóa)
                .center(center)
                .build();
        
        hashtagRepository.save(studentTag);
    }

    /**
     * LOGIC ĐĂNG NHẬP
     */
    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request, boolean isLoginAsAdmin) {
        // 1. Sử dụng AuthenticationManager để xác thực
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        // 2. Lấy Principal đã được nạp đủ dữ liệu từ DB
        CustomUserDetails userDetails = (CustomUserDetails) authentication.getPrincipal();

        // 3. Nếu đăng nhập vào cổng Admin mà user không phải là Admin của trung tâm nào
        if (isLoginAsAdmin && userDetails.getCenterId() == null) {
            throw new RuntimeException("Tài khoản này không có quyền quản trị trung tâm!");
        }

        // 4. Tạo Token nén centerId vào
        String token = jwtUtils.generateToken(userDetails);

        // 5. Lấy thông tin hiển thị UI
        String centerName = null;
        if (isLoginAsAdmin) {
            Admin admin = adminRepository.findByUserId(userDetails.getUserId())
                    .orElseThrow(() -> new RuntimeException("Dữ liệu trung tâm không nhất quán"));
            centerName = admin.getCenter().getName();
        }

        return LoginResponse.builder()
                .userId(userDetails.getUserId())
                .name(userDetails.getName())
                .email(userDetails.getEmail())
                .accessToken(token)
                .activeRole(isLoginAsAdmin ? "ADMIN" : "USER")
                .workingCenterId(isLoginAsAdmin ? userDetails.getCenterId() : null)
                .centerName(centerName)
                .build();
    }
}