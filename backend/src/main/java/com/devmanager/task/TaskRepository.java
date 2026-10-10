package com.devmanager.task;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.util.Collection;
import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

	List<Task> findByProjectIdOrderByPositionAsc(Long projectId);

	List<Task> findByProjectIdAndStatusOrderByPositionAsc(Long projectId, TaskStatus status);

	List<Task> findByAssigneeId(Long assigneeId);

	List<Task> findByProjectIdIn(Collection<Long> projectIds);

	long countByProjectId(Long projectId);

	long countByProjectIdAndStatus(Long projectId, TaskStatus status);

	@Modifying
	@Query("delete from Task t where t.project.id = :projectId")
	void deleteByProjectId(Long projectId);
}
