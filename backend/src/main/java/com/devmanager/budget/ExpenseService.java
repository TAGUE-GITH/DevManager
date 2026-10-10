package com.devmanager.budget;

import com.devmanager.budget.ExpenseDtos.ExpenseRequest;
import com.devmanager.budget.ExpenseDtos.ExpenseResponse;
import com.devmanager.common.ApiException;
import com.devmanager.project.Project;
import com.devmanager.project.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

// Tout membre du projet peut consulter les depenses ; seul le responsable (ou un admin) peut les modifier
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExpenseService {

	private final ExpenseRepository expenseRepository;
	private final ProjectService projectService;

	public List<ExpenseResponse> findByProject(Long projectId) {
		projectService.getVisibleProject(projectId);
		return expenseRepository.findByProjectIdOrderByDateDesc(projectId).stream()
				.map(ExpenseResponse::from)
				.toList();
	}

	@Transactional
	public ExpenseResponse create(Long projectId, ExpenseRequest request) {
		Project project = projectService.getManageableProject(projectId);
		Expense expense = expenseRepository.save(Expense.builder()
				.label(request.label().trim())
				.amount(request.amount())
				.category(request.category())
				.date(request.date())
				.project(project)
				.build());
		return ExpenseResponse.from(expense);
	}

	@Transactional
	public void delete(Long expenseId) {
		Expense expense = expenseRepository.findById(expenseId)
				.orElseThrow(() -> ApiException.notFound("error.expense.notFound"));
		projectService.getManageableProject(expense.getProject().getId());
		expenseRepository.delete(expense);
	}
}
