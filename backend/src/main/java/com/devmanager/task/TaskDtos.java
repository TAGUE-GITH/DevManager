package com.devmanager.task;

import com.devmanager.user.UserResponse;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;
import java.time.LocalDateTime;

public final class TaskDtos {

	private TaskDtos() {
	}

	public record TaskRequest(
			@NotBlank(message = "{validation.required}") @Size(max = 200, message = "{validation.size.max}") String title,
			@Size(max = 2000, message = "{validation.size.max}") String description,
			@NotNull(message = "{validation.required}") TaskPriority priority,
			LocalDate dueDate,
			Long assigneeId) {
	}

	// Deplacement d'une carte : nouvelle colonne et nouveau rang dans cette colonne
	public record MoveRequest(
			@NotNull(message = "{validation.required}") TaskStatus status,
			@NotNull(message = "{validation.required}") @Min(value = 0, message = "{validation.position}") Integer position) {
	}

	public record TaskResponse(
			Long id,
			String title,
			String description,
			TaskStatus status,
			TaskPriority priority,
			LocalDate dueDate,
			boolean overdue,
			int position,
			Long projectId,
			String projectName,
			UserResponse assignee,
			UserResponse createdBy,
			LocalDateTime createdAt) {

		public static TaskResponse from(Task task) {
			return new TaskResponse(task.getId(), task.getTitle(), task.getDescription(), task.getStatus(),
					task.getPriority(), task.getDueDate(), task.isOverdue(), task.getPosition(),
					task.getProject().getId(), task.getProject().getName(),
					task.getAssignee() == null ? null : UserResponse.from(task.getAssignee()),
					UserResponse.from(task.getCreatedBy()), task.getCreatedAt());
		}
	}
}
