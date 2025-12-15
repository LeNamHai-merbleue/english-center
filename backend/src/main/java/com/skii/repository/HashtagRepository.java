package com.skii.repository;

import com.skii.entity.Hashtag;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Set;
import java.util.Optional;

@Repository
public interface HashtagRepository extends JpaRepository<Hashtag, String> {

    /**
     * 1. LẤY DANH SÁCH HASHTAG
     */
    @Query("SELECT h FROM Hashtag h WHERE h.center.id = :centerId OR h.center IS NULL")
    List<Hashtag> findByCenterIdOrSystem(@Param("centerId") Long centerId);

    /**
     * 2. LỌC THEO LOẠI (ROLE/TRAIT)
     */
    @Query("SELECT h FROM Hashtag h WHERE h.type = :type AND (h.center.id = :centerId OR h.center IS NULL)")
    List<Hashtag> findByTypeAndCenterId(@Param("type") String type, @Param("centerId") Long centerId);

    /**
     * 3. XÁC THỰC KHI GÁN NHÃN (Bảo mật chéo)
     * Đảm bảo Admin không gán nhãn của trung tâm khác cho nhân viên mình.
     */
    @Query("SELECT h FROM Hashtag h WHERE h.id IN :ids AND (h.center.id = :centerId OR h.center IS NULL)")
    Set<Hashtag> findAllByIdInAndCenterId(@Param("ids") List<String> ids, @Param("centerId") Long centerId);

    /**
     * 4. TÌM NHÃN STUDENT CỤ THỂ
     */
    @Query("SELECT h FROM Hashtag h WHERE h.id = :id AND h.center.id = :centerId")
    Optional<Hashtag> findByIdAndCenterId(@Param("id") String id, @Param("centerId") Long centerId);

}