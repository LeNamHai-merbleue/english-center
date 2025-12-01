package com.skii.repository;

import com.skii.entity.JoinRequest;
import com.skii.entity.JoinRequest.RequestStatus;
import com.skii.entity.JoinRequest.RequestType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import org.springframework.data.jpa.repository.EntityGraph;

import java.util.List;

@Repository
public interface JoinRequestRepository extends JpaRepository<JoinRequest, Long> {
    
    @EntityGraph(attributePaths = {"user"}) // Lấy luôn thông tin User để Mapper có dữ liệu
    List<JoinRequest> findByCenterIdAndTypeAndStatus(Long centerId, RequestType type, RequestStatus status);
}