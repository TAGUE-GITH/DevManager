package com.devmanager.budget;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;

import java.math.BigDecimal;
import java.util.List;

public interface ExpenseRepository extends JpaRepository<Expense, Long> {

	List<Expense> findByProjectIdOrderByDateDesc(Long projectId);

	// Total des depenses d'un projet (0 s'il n'y en a aucune)
	@Query("select coalesce(sum(e.amount), 0) from Expense e where e.project.id = :projectId")
	BigDecimal sumAmountByProjectId(Long projectId);

	@Modifying
	@Query("delete from Expense e where e.project.id = :projectId")
	void deleteByProjectId(Long projectId);
}
