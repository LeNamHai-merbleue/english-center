package com.skii.repository;

import com.skii.entity.UserCenterProfile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface UserCenterProfileRepository extends JpaRepository<UserCenterProfile, Long> {


    //  1: TRUY VẤN DANH SÁCH (Dùng để hiển thị Table)
    /**
     * Lấy danh sách NHÂN SỰ: Center khớp + Status Active + KHÔNG mang nhãn STUDENT
     */
    @Query("SELECT DISTINCT p FROM UserCenterProfile p " +
           "JOIN FETCH p.user u " + 
           "LEFT JOIN FETCH p.hashtags " + 
           "WHERE p.center.id = :centerId " +
           "AND p.status != 'PENDING' " +
           "AND NOT EXISTS (SELECT h FROM p.hashtags h WHERE h.id = :studentTagId) " + // Chặn học sinh
           "AND (:search IS NULL OR :search = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:hashtagIds IS NULL OR EXISTS (SELECT hh FROM p.hashtags hh WHERE hh.id IN :hashtagIds))")
    List<UserCenterProfile> findStaffsByFilters(
            @Param("centerId") Long centerId,
            @Param("studentTagId") String studentTagId,
            @Param("search") String search, 
            @Param("hashtagIds") List<String> hashtagIds);

    /**
     * Lấy danh sách HỌC SINH: Center khớp + Status Active + BẮT BUỘC mang nhãn STUDENT
     */
    @Query("SELECT DISTINCT p FROM UserCenterProfile p " +
           "JOIN FETCH p.user u " + 
           "LEFT JOIN FETCH p.hashtags " + 
           "WHERE p.center.id = :centerId " +
           "AND p.status != 'PENDING' " +
           "AND EXISTS (SELECT h FROM p.hashtags h WHERE h.id = :studentTagId) " + // Chỉ lấy học sinh
           "AND (:search IS NULL OR :search = '' OR LOWER(u.name) LIKE LOWER(CONCAT('%', :search, '%')) " +
           "    OR LOWER(u.email) LIKE LOWER(CONCAT('%', :search, '%'))) " +
           "AND (:hashtagIds IS NULL OR EXISTS (SELECT hh FROM p.hashtags hh WHERE hh.id IN :hashtagIds))")
    List<UserCenterProfile> findStudentsByFilters(
            @Param("centerId") Long centerId,
            @Param("studentTagId") String studentTagId,
            @Param("search") String search, 
            @Param("hashtagIds") List<String> hashtagIds);

    // 2: CÁC HÀM ĐẾM TỔNG (Dùng cho Dashboard hoặc Phân trang)
    /**
     * Đếm tổng số NHÂN SỰ chính thức của trung tâm
     */
    @Query("SELECT COUNT(p) FROM UserCenterProfile p " +
           "WHERE p.center.id = :centerId AND p.status = 'ACTIVE' " +
           "AND NOT EXISTS (SELECT h FROM p.hashtags h WHERE h.id = :studentTagId)")
    long countTotalStaffs(@Param("centerId") Long centerId, @Param("studentTagId") String studentTagId);

    /**
     * Đếm tổng số HỌC SINH chính thức của trung tâm
     */
    @Query("SELECT COUNT(p) FROM UserCenterProfile p " +
           "WHERE p.center.id = :centerId AND p.status = 'ACTIVE' " +
           "AND EXISTS (SELECT h FROM p.hashtags h WHERE h.id = :studentTagId)")
    long countTotalStudents(@Param("centerId") Long centerId, @Param("studentTagId") String studentTagId);
}