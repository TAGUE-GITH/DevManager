package com.devmanager.user;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {

	Optional<User> findByEmail(String email);

	boolean existsByEmail(String email);

	// Toutes les recherches d'utilisateurs sont limitees a une entreprise
	List<User> findByOrganizationIdOrderByLastNameAscFirstNameAsc(Long organizationId);

	Optional<User> findByIdAndOrganizationId(Long id, Long organizationId);

	long countByOrganizationId(Long organizationId);
}
