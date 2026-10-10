package com.devmanager.project;

import com.devmanager.budget.ExpenseRepository;
import com.devmanager.common.ApiException;
import com.devmanager.project.ProjectDtos.ProjectRequest;
import com.devmanager.project.ProjectDtos.ProjectResponse;
import com.devmanager.user.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Comparator;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * Regles d'acces aux projets :
 * - ADMIN : peut tout faire sur tous les projets
 * - MANAGER : voit tous les projets, cree des projets et gere ceux dont il est responsable
 * - EMPLOYEE : voit les projets dont il est membre et peut changer leur statut
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ProjectService {

	private final ProjectRepository projectRepository;
	private final ExpenseRepository expenseRepository;
	private final UserRepository userRepository;
	private final CurrentUser currentUser;

	public List<ProjectResponse> findVisible() {
		User user = currentUser.get();
		List<Project> projects = canSeeAll(user)
				? projectRepository.findByOrganizationIdOrderByIdDesc(organizationId(user))
				: projectRepository.findVisibleBy(organizationId(user), user.getId());
		return projects.stream().map(this::toResponse).toList();
	}

	public ProjectResponse findById(Long id) {
		return toResponse(getVisibleProject(id));
	}

	@Transactional
	public ProjectResponse create(ProjectRequest request) {
		User user = currentUser.get();
		Project project = Project.builder().owner(user).organization(user.getOrganization()).build();
		apply(project, request, user);
		return toResponse(projectRepository.save(project));
	}

	@Transactional
	public ProjectResponse update(Long id, ProjectRequest request) {
		Project project = getManageableProject(id);
		apply(project, request, currentUser.get());
		return toResponse(project);
	}

	@Transactional
	public ProjectResponse updateStatus(Long id, ProjectStatus status) {
		User user = currentUser.get();
		Project project = getVisibleProject(id);
		if (!canManage(user, project) && !isMember(user, project)) {
			throw ApiException.forbidden("Seuls les membres du projet peuvent changer son statut");
		}
		project.setStatus(status);
		return toResponse(project);
	}

	@Transactional
	public void delete(Long id) {
		Project project = getManageableProject(id);
		expenseRepository.deleteByProjectId(project.getId());
		projectRepository.delete(project);
	}

	public Project getVisibleProject(Long id) {
		User user = currentUser.get();
		// Un projet d'une autre entreprise est introuvable, comme s'il n'existait pas
		Project project = projectRepository.findByIdAndOrganizationId(id, organizationId(user))
				.orElseThrow(() -> ApiException.notFound("Projet introuvable"));
		if (!canSeeAll(user) && !isOwner(user, project) && !isMember(user, project)) {
			throw ApiException.forbidden("Vous n'avez pas accès à ce projet");
		}
		return project;
	}

	public Project getManageableProject(Long id) {
		Project project = getVisibleProject(id);
		if (!canManage(currentUser.get(), project)) {
			throw ApiException.forbidden("Seul le responsable du projet ou un administrateur peut effectuer cette action");
		}
		return project;
	}

	private void apply(Project project, ProjectRequest request, User user) {
		if (request.startDate() != null && request.endDate() != null
				&& request.endDate().isBefore(request.startDate())) {
			throw ApiException.badRequest("La date de fin doit être après la date de début");
		}
		project.setName(request.name().trim());
		project.setDescription(request.description());
		project.setBudget(request.budget());
		project.setStartDate(request.startDate());
		project.setEndDate(request.endDate());
		project.setMembers(findMembers(request.memberIds(), organizationId(user)));
	}

	private Set<User> findMembers(Set<Long> memberIds, Long organizationId) {
		if (memberIds == null || memberIds.isEmpty()) {
			return new HashSet<>();
		}
		// Seuls les utilisateurs de la meme entreprise peuvent etre membres
		List<User> members = userRepository.findAllById(memberIds).stream()
				.filter(member -> member.getOrganization().getId().equals(organizationId))
				.toList();
		if (members.size() != memberIds.size()) {
			throw ApiException.badRequest("Un ou plusieurs membres sont introuvables");
		}
		return new HashSet<>(members);
	}

	private ProjectResponse toResponse(Project project) {
		BigDecimal spent = expenseRepository.sumAmountByProjectId(project.getId());
		BigDecimal budget = project.getBudget();
		List<UserResponse> members = project.getMembers().stream()
				.sorted(Comparator.comparing(User::getLastName))
				.map(UserResponse::from)
				.toList();
		return new ProjectResponse(
				project.getId(),
				project.getName(),
				project.getDescription(),
				project.getStatus(),
				budget,
				spent,
				budget.subtract(spent),
				consumedPercent(budget, spent),
				project.getStartDate(),
				project.getEndDate(),
				UserResponse.from(project.getOwner()),
				members);
	}

	// Pourcentage du budget deja depense (peut depasser 100 en cas de depassement)
	private int consumedPercent(BigDecimal budget, BigDecimal spent) {
		if (budget.signum() == 0) {
			return spent.signum() > 0 ? 100 : 0;
		}
		return spent.multiply(BigDecimal.valueOf(100)).divide(budget, 0, RoundingMode.HALF_UP).intValue();
	}

	private Long organizationId(User user) {
		return user.getOrganization().getId();
	}

	private boolean canSeeAll(User user) {
		return user.getRole() == Role.ADMIN || user.getRole() == Role.MANAGER;
	}

	private boolean canManage(User user, Project project) {
		return user.getRole() == Role.ADMIN || isOwner(user, project);
	}

	private boolean isOwner(User user, Project project) {
		return project.getOwner().getId().equals(user.getId());
	}

	private boolean isMember(User user, Project project) {
		return project.getMembers().stream().anyMatch(member -> member.getId().equals(user.getId()));
	}
}
