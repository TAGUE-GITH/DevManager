package com.devmanager.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;
import java.util.Optional;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	List<Project> findByOrganizationIdOrderByIdDesc(Long organizationId);

	Optional<Project> findByIdAndOrganizationId(Long id, Long organizationId);

	long countByOrganizationId(Long organizationId);

	// Projets de l'entreprise dont l'utilisateur est le responsable ou un membre
	@Query("""
			select distinct p from Project p left join p.members m
			where p.organization.id = :organizationId and (p.owner.id = :userId or m.id = :userId)
			order by p.id desc""")
	List<Project> findVisibleBy(Long organizationId, Long userId);
}
