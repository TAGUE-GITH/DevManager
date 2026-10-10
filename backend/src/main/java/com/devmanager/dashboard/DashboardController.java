package com.devmanager.dashboard;

import com.devmanager.message.MessageService;
import com.devmanager.project.ProjectDtos.ProjectResponse;
import com.devmanager.project.ProjectService;
import com.devmanager.project.ProjectStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.EnumMap;
import java.util.List;
import java.util.Map;

// Statistiques de la page d'accueil, calculees sur les projets visibles par l'utilisateur
@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

	private final ProjectService projectService;
	private final MessageService messageService;

	public record DashboardResponse(int totalProjects, Map<ProjectStatus, Long> projectsByStatus,
									BigDecimal totalBudget, BigDecimal totalSpent, long unreadMessages) {
	}

	@GetMapping
	public DashboardResponse get() {
		List<ProjectResponse> projects = projectService.findVisible();

		Map<ProjectStatus, Long> byStatus = new EnumMap<>(ProjectStatus.class);
		for (ProjectStatus status : ProjectStatus.values()) {
			byStatus.put(status, projects.stream().filter(p -> p.status() == status).count());
		}

		BigDecimal totalBudget = projects.stream().map(ProjectResponse::budget).reduce(BigDecimal.ZERO, BigDecimal::add);
		BigDecimal totalSpent = projects.stream().map(ProjectResponse::spent).reduce(BigDecimal.ZERO, BigDecimal::add);

		return new DashboardResponse(projects.size(), byStatus, totalBudget, totalSpent, messageService.unreadCount());
	}
}
