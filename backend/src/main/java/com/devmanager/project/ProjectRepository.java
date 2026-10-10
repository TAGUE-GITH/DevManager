package com.devmanager.project;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {

	List<Project> findAllByOrderByIdDesc();

	// Projets dont l'utilisateur est le responsable ou un membre
	@Query("""
			select distinct p from Project p left join p.members m
			where p.owner.id = :userId or m.id = :userId
			order by p.id desc""")
	List<Project> findVisibleBy(Long userId);
}
