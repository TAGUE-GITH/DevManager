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
			@NotBlank(message = "{validation.required}") @Size(max = 150, message = "{validation.size.max}") String name,
			@Size(max = 2000, message = "{validation.size.max}") String description,
			@NotNull(message = "{validation.required}") @PositiveOrZero(message = "{validation.positive}") BigDecimal budget,
			LocalDate startDate,
			LocalDate endDate,
			Set<Long> memberIds) {
	}

	public record StatusRequest(@NotNull(message = "{validation.required}") ProjectStatus status) {
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
			List<UserResponse> members,
			long taskCount,
			long completedTaskCount) {
	}
}
