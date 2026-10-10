package com.devmanager.budget;

import com.devmanager.budget.ExpenseDtos.ExpenseRequest;
import com.devmanager.budget.ExpenseDtos.ExpenseResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class ExpenseController {

	private final ExpenseService expenseService;

	@GetMapping("/projects/{projectId}/expenses")
	public List<ExpenseResponse> findByProject(@PathVariable Long projectId) {
		return expenseService.findByProject(projectId);
	}

	@PostMapping("/projects/{projectId}/expenses")
	@ResponseStatus(HttpStatus.CREATED)
	public ExpenseResponse create(@PathVariable Long projectId, @Valid @RequestBody ExpenseRequest request) {
		return expenseService.create(projectId, request);
	}

	@DeleteMapping("/expenses/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		expenseService.delete(id);
	}
}
