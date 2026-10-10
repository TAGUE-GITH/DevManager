package com.devmanager.project;

import com.devmanager.user.UserResponse;
import jakarta.validation.constraints.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Set;

public final class ProjectDtos {

	private ProjectDtos() {
	}

	public record ProjectRequest(
			@NotBlank(message = "Le nom est obligatoire") @Size(max = 150, message = "150 caractères maximum") String name,
			@Size(max = 2000, message = "2000 caractères maximum") String description,
			@NotNull(message = "Le budget est obligatoire") @PositiveOrZero(message = "Le budget doit être positif") BigDecimal budget,
			LocalDate startDate,
			LocalDate endDate,
			Set<Long> memberIds) {
	}

	public record StatusRequest(@NotNull(message = "Le statut est obligatoire") ProjectStatus status) {
	}

	public record ProjectResponse(
			Long id,
			String name,
			String description,
			ProjectStatus status,
			BigDecimal budget,
			BigDecimal spent,
			BigDecimal remaining,
			int consumedPercent,
			LocalDate startDate,
			LocalDate endDate,
			UserResponse owner,
			List<UserResponse> members) {
	}
}
