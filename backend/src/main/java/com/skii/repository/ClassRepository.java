package com.skii.repository;

import com.skii.entity.Class;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;
import java.util.Optional;

@Repository
public interface ClassRepository extends JpaRepository<Class, Long> {

    /**
     * 1. TRUY VẤN DANH SÁCH THEO NHÓM TRẠNG THÁI
     */
    List<Class> findByCenterIdAndTypeAndStatusIn(Long centerId, Class.ClassType type, Collection<Class.ClassStatus> statuses);

    /**
     * 2. BỘ LỌC THÔNG MINH (Smart Filter)
     * Đã tối ưu để tìm kiếm trên cả tên lớp và tên giáo viên đang dạy.
     */
    @Query("SELECT DISTINCT c FROM Class c " +
           "LEFT JOIN c.classStaffs cs " +
           "LEFT JOIN cs.staff u " +
           "WHERE c.center.id = :centerId " +
           "AND c.type = :type " +
           "AND c.status IN :statuses " +
           "AND (:query IS NULL OR :query = '' OR (" +
           "   LOWER(c.name) LIKE LOWER(CONCAT('%', :query, '%')) OR " +
           "   LOWER(u.name) LIKE LOWER(CONCAT('%', :query, '%'))" +
           ")) " +
           "AND (:level = 'all' OR c.level = :level) " +
           "AND (:capacity = 'all' OR " +
           "   (:capacity = 'full' AND SIZE(c.classStudents) >= c.maxStudents) OR " +
           "   (:capacity = 'available' AND SIZE(c.classStudents) < c.maxStudents)" +
           ")")
    List<Class> filterClasses(
            @Param("centerId") Long centerId,
            @Param("type") Class.ClassType type,
            @Param("statuses") Collection<Class.ClassStatus> statuses,
            @Param("query") String query,
            @Param("level") String level,
            @Param("capacity") String capacity
    );

    /**
     * 3. TRUY VẤN CHI TIẾT ĐẦY ĐỦ (Fetch Join Toàn Diện)
     * Dùng DISTINCT để tránh nhân bản dữ liệu khi JOIN FETCH nhiều tập hợp.
     * Đã cập nhật join đúng applicantTeachers và pendingStudents từ Entity của bạn.
     */
    @Query("SELECT DISTINCT c FROM Class c " +
           "LEFT JOIN FETCH c.classStaffs cs " +
           "LEFT JOIN FETCH cs.staff " +
           "LEFT JOIN FETCH c.classStudents st " +
           "LEFT JOIN FETCH st.student " +
           "LEFT JOIN FETCH c.schedules " +
           "LEFT JOIN FETCH c.applicantTeachers " + // Fetch danh sách giáo viên ứng tuyển
           "LEFT JOIN FETCH c.pendingStudents " +    // Fetch danh sách học sinh chờ duyệt
           "WHERE c.id = :classId")
    Optional<Class> findDetailedClassById(@Param("classId") Long classId);

    /**
     * 4. THỐNG KÊ SỐ LƯỢNG
     */
    long countByCenterIdAndTypeAndStatusIn(Long centerId, Class.ClassType type, Collection<Class.ClassStatus> statuses);

    /**
     * 5. KIỂM TRA GIÁO VIÊN CHÍNH
     * Chú ý: "classs" là tên field trong ClassStaff của bạn.
     */
    @Query("SELECT COUNT(cs) > 0 FROM ClassStaff cs " +
           "WHERE cs.classs.id = :classId " +
           "AND cs.role = 'MAIN_TEACHER' " +
           "AND cs.status = 'ACTIVE'")
    boolean hasMainTeacher(@Param("classId") Long classId);
}