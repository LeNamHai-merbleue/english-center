package com.skii.repository;

import com.skii.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {

    /**
     * Tìm kiếm User theo Email (Dùng cho Login/Security)
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.profiles p " +
           "LEFT JOIN FETCH p.center " +
           "WHERE u.email = :email")
    Optional<User> findByEmail(@Param("email") String email);

    /**
     * Kiểm tra email đã tồn tại hay chưa (Dùng cho Đăng ký)
     */
    boolean existsByEmail(String email);

    /**
     * CHỨC NĂNG 4: TÌM NHÂN SỰ THEO HASHTAG VÀ TRUNG TÂM
     * Lấy danh sách giáo viên hoặc trợ giảng thuộc một trung tâm cụ thể 
     * dựa trên Hashtag role (e.g., 'teacher' hoặc 'assistant')
     */
    @Query("SELECT DISTINCT u FROM User u " +
           "JOIN u.profiles p " +
           "JOIN p.hashtags h " +
           "WHERE p.center.id = :centerId " +
           "AND LOWER(h.name) = LOWER(:hashtagName) " +
           "AND p.status = 'active'")
    List<User> findStaffByCenterAndHashtag(
            @Param("centerId") Long centerId, 
            @Param("hashtagName") String hashtagName
    );

    /**
     * TÌM KIẾM THÔNG MINH (Smart Search) cho nhân sự
     * Tìm theo tên hoặc email của giáo viên trong một trung tâm
     */
    @Query("SELECT u FROM User u " +
           "JOIN u.profiles p " +
           "WHERE p.center.id = :centerId " +
           "AND (LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(u.email) LIKE LOWER(CONCAT('%', :query, '%')))")
    List<User> searchUsersInCenter(@Param("centerId") Long centerId, @Param("query") String query);

    /**
     * CHỨC NĂNG 5: LẤY CHI TIẾT USER KÈM PROFILE VÀ HASHTAG
     * Tránh lỗi LazyLoading khi Mapper cần dữ liệu Rating/Exp
     */
    @Query("SELECT u FROM User u " +
           "LEFT JOIN FETCH u.profiles p " +
           "LEFT JOIN FETCH p.hashtags " +
           "WHERE u.id = :userId")
    Optional<User> findByIdWithProfile(@Param("userId") Long userId);
}