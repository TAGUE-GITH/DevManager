package com.devmanager.organization;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PaymentRepository extends JpaRepository<Payment, Long> {

	List<Payment> findByOrganizationIdOrderByCreatedAtDesc(Long organizationId);
}
