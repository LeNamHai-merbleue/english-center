package com.skii.controller;

import com.skii.dto.AdminRegisterDTO;
import com.skii.dto.LoginRequest;
import com.skii.dto.LoginResponse;
import com.skii.service.AuthService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*") // Hỗ trợ gọi API từ Frontend (React/Vue)
public class AuthController {

    private final AuthService authService;

    /**
     * ENDPOINT: ĐĂNG KÝ ADMIN & TRUNG TÂM
     * URL: POST http://localhost:8080/api/auth/admin/register
     */
    @PostMapping("/admin/register")
    public ResponseEntity<Map<String, String>> registerAdmin(@RequestBody AdminRegisterDTO dto) {
        String message = authService.registerAdminWithCenter(dto);
        return ResponseEntity.ok(Map.of("message", message));
    }

    /**
     * ENDPOINT: ĐĂNG NHẬP CỔNG ADMIN
     * URL: POST http://localhost:8080/api/auth/admin/login
     * Logic: Kiểm tra quyền quản trị và trả về workingCenterId.
     */
    @PostMapping("/admin/login")
    public ResponseEntity<LoginResponse> adminLogin(@RequestBody LoginRequest request) {
        // Tham số true báo hiệu đăng nhập qua cổng Admin
        LoginResponse response = authService.login(request, true);
        return ResponseEntity.ok(response);
    }

    /**
     * ENDPOINT: ĐĂNG NHẬP CỔNG USER
     * URL: POST http://localhost:8080/api/auth/user/login
     * Logic: Cho phép cả Admin đăng nhập nhưng sẽ ẩn quyền quản trị và CenterId.
     *
    @PostMapping("/user/login")
    public ResponseEntity<LoginResponse> userLogin(@RequestBody LoginRequest request) {
        // Tham số false báo hiệu đăng nhập qua cổng User thường
        LoginResponse response = authService.login(request, false);
        return ResponseEntity.ok(response);
    }*/
}