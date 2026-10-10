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
			@NotBlank(message = "Le titre est obligatoire") @Size(max = 200, message = "200 caractères maximum") String title,
			@Size(max = 2000, message = "2000 caractères maximum") String description,
			@NotNull(message = "La priorité est obligatoire") TaskPriority priority,
			LocalDate dueDate,
			Long assigneeId) {
	}

	// Deplacement d'une carte : nouvelle colonne et nouveau rang dans cette colonne
	public record MoveRequest(
			@NotNull(message = "Le statut est obligatoire") TaskStatus status,
			@NotNull(message = "La position est obligatoire") @Min(value = 0, message = "Position invalide") Integer position) {
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
