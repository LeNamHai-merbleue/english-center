package com.skii.repository;

import com.skii.entity.Center;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CenterRepository extends JpaRepository<Center, Long> {
    // JpaRepository đã có sẵn hàm save() nên không cần viết thêm gì lúc này
}