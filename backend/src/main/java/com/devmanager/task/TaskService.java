package com.devmanager.task;

import com.devmanager.common.ApiException;
import com.devmanager.project.Project;
import com.devmanager.project.ProjectService;
import com.devmanager.task.TaskDtos.MoveRequest;
import com.devmanager.task.TaskDtos.TaskRequest;
import com.devmanager.task.TaskDtos.TaskResponse;
import com.devmanager.user.CurrentUser;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;

/**
 * Regles d'acces aux taches :
 * - tous ceux qui voient le projet voient ses taches ;
 * - les participants (admin, responsable, membres) creent et deplacent les taches ;
 * - une tache est modifiee ou supprimee par l'administrateur, le responsable du projet ou son auteur.
 */
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskService {

	private final TaskRepository taskRepository;
	private final ProjectService projectService;
	private final UserRepository userRepository;
	private final CurrentUser currentUser;

	public List<TaskResponse> findByProject(Long projectId) {
		projectService.getVisibleProject(projectId);
		return taskRepository.findByProjectIdOrderByPositionAsc(projectId).stream()
				.map(TaskResponse::from)
				.toList();
	}

	// Taches confiees a l'utilisateur connecte : non terminees d'abord, puis par echeance
	public List<TaskResponse> findMine() {
		return taskRepository.findByAssigneeId(currentUser.get().getId()).stream()
				.sorted(Comparator.comparing((Task task) -> task.getStatus() == TaskStatus.DONE)
						.thenComparing(Task::getDueDate, Comparator.nullsLast(Comparator.naturalOrder())))
				.map(TaskResponse::from)
				.toList();
	}

	@Transactional
	public TaskResponse create(Long projectId, TaskRequest request) {
		User user = currentUser.get();
		Project project = projectService.getVisibleProject(projectId);
		if (!projectService.isParticipant(user, project)) {
			throw ApiException.forbidden("error.task.create");
		}

		// Une nouvelle tache arrive en bas de la colonne "A faire"
		int position = taskRepository.findByProjectIdAndStatusOrderByPositionAsc(projectId, TaskStatus.TODO).size();
		Task task = Task.builder()
				.project(project)
				.createdBy(user)
				.position(position)
				.build();
		apply(task, request);
		return TaskResponse.from(taskRepository.save(task));
	}

	@Transactional
	public TaskResponse update(Long id, TaskRequest request) {
		Task task = getEditableTask(id);
		apply(task, request);
		return TaskResponse.from(task);
	}

	// Deplace une carte dans une colonne (eventuellement la meme) et renumerote les colonnes concernees
	@Transactional
	public TaskResponse move(Long id, MoveRequest request) {
		Task task = getTask(id);
		User user = currentUser.get();
		if (!projectService.isParticipant(user, task.getProject())) {
			throw ApiException.forbidden("error.task.move");
		}

		Long projectId = task.getProject().getId();
		TaskStatus previousStatus = task.getStatus();

		List<Task> target = new ArrayList<>(
				taskRepository.findByProjectIdAndStatusOrderByPositionAsc(projectId, request.status()));
		target.removeIf(other -> other.getId().equals(task.getId()));
		target.add(Math.min(request.position(), target.size()), task);
		task.setStatus(request.status());
		renumber(target);

		if (previousStatus != request.status()) {
			List<Task> source = new ArrayList<>(
					taskRepository.findByProjectIdAndStatusOrderByPositionAsc(projectId, previousStatus));
			source.removeIf(other -> other.getId().equals(task.getId()));
			renumber(source);
		}
		return TaskResponse.from(task);
	}

	@Transactional
	public void delete(Long id) {
		Task task = getEditableTask(id);
		Long projectId = task.getProject().getId();
		TaskStatus status = task.getStatus();
		taskRepository.delete(task);
		taskRepository.flush();
		renumber(taskRepository.findByProjectIdAndStatusOrderByPositionAsc(projectId, status));
	}

	private void apply(Task task, TaskRequest request) {
		task.setTitle(request.title().trim());
		task.setDescription(request.description());
		task.setPriority(request.priority());
		task.setDueDate(request.dueDate());
		task.setAssignee(findAssignee(request.assigneeId(), task.getProject()));
	}

	// Une tache ne peut etre confiee qu'a un membre de l'equipe du projet
	private User findAssignee(Long assigneeId, Project project) {
		if (assigneeId == null) {
			return null;
		}
		return userRepository.findByIdAndOrganizationId(assigneeId, project.getOrganization().getId())
				.filter(user -> projectService.isOnTeam(user, project))
				.orElseThrow(() -> ApiException.badRequest("error.task.assignee"));
	}

	private Task getTask(Long id) {
		Task task = taskRepository.findById(id)
				.orElseThrow(() -> ApiException.notFound("error.task.notFound"));
		// Verifie que le projet est visible (meme entreprise, droits d'acces)
		projectService.getVisibleProject(task.getProject().getId());
		return task;
	}

	private Task getEditableTask(Long id) {
		Task task = getTask(id);
		User user = currentUser.get();
		boolean isAuthor = task.getCreatedBy().getId().equals(user.getId());
		if (!isAuthor && !projectService.canManage(user, task.getProject())) {
			throw ApiException.forbidden("error.task.edit");
		}
		return task;
	}

	private void renumber(List<Task> column) {
		for (int i = 0; i < column.size(); i++) {
			column.get(i).setPosition(i);
		}
	}
}
