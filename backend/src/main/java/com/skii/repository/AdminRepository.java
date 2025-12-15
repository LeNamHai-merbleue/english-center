package com.skii.repository;

import com.skii.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    // Vào Admin -> Lấy User -> Lấy Id
    Optional<Admin> findByUserId(Long userId);

    // Dùng để kiểm tra nhanh quyền admin của user tại center
    boolean existsByUserIdAndCenterId(Long userId, Long centerId);
}