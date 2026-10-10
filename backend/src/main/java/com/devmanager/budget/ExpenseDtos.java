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
			@NotBlank(message = "Le libellé est obligatoire") @Size(max = 150, message = "150 caractères maximum") String label,
			@NotNull(message = "Le montant est obligatoire") @Positive(message = "Le montant doit être positif") BigDecimal amount,
			@NotNull(message = "La catégorie est obligatoire") ExpenseCategory category,
			@NotNull(message = "La date est obligatoire") LocalDate date) {
	}

	public record ExpenseResponse(Long id, String label, BigDecimal amount, ExpenseCategory category,
								  LocalDate date, Long projectId) {

		public static ExpenseResponse from(Expense expense) {
			return new ExpenseResponse(expense.getId(), expense.getLabel(), expense.getAmount(),
					expense.getCategory(), expense.getDate(), expense.getProject().getId());
		}
	}
}
