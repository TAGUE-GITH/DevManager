package com.devmanager.budget;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public final class ExpenseDtos {

	private ExpenseDtos() {
	}

	public record ExpenseRequest(
			@NotBlank(message = "{validation.required}") @Size(max = 150, message = "{validation.size.max}") String label,
			@NotNull(message = "{validation.required}") @Positive(message = "{validation.positive}") BigDecimal amount,
			@NotNull(message = "{validation.required}") ExpenseCategory category,
			@NotNull(message = "{validation.required}") LocalDate date) {
	}

	public record ExpenseResponse(Long id, String label, BigDecimal amount, ExpenseCategory category,
								  LocalDate date, Long projectId) {

		public static ExpenseResponse from(Expense expense) {
			return new ExpenseResponse(expense.getId(), expense.getLabel(), expense.getAmount(),
					expense.getCategory(), expense.getDate(), expense.getProject().getId());
		}
	}
}
