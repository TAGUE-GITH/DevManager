package com.devmanager.task;

import com.devmanager.project.Project;
import com.devmanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Task {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 200)
	private String title;

	@Column(length = 2000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private TaskStatus status = TaskStatus.TODO;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private TaskPriority priority = TaskPriority.MEDIUM;

	private LocalDate dueDate;

	// Rang de la tache dans sa colonne (0 = en haut)
	@Column(name = "sort_order", nullable = false)
	private int position;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "project_id")
	private Project project;

	// Personne chargee de la tache (facultatif)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "assignee_id")
	private User assignee;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "created_by_id")
	private User createdBy;

	@Column(nullable = false)
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	public boolean isOverdue() {
		return dueDate != null && status != TaskStatus.DONE && dueDate.isBefore(LocalDate.now());
	}
}
