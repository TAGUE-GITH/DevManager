package com.devmanager.task;

import com.devmanager.task.TaskDtos.MoveRequest;
import com.devmanager.task.TaskDtos.TaskRequest;
import com.devmanager.task.TaskDtos.TaskResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class TaskController {

	private final TaskService taskService;

	@GetMapping("/projects/{projectId}/tasks")
	public List<TaskResponse> findByProject(@PathVariable Long projectId) {
		return taskService.findByProject(projectId);
	}

	@PostMapping("/projects/{projectId}/tasks")
	@ResponseStatus(HttpStatus.CREATED)
	public TaskResponse create(@PathVariable Long projectId, @Valid @RequestBody TaskRequest request) {
		return taskService.create(projectId, request);
	}

	@GetMapping("/tasks/mine")
	public List<TaskResponse> findMine() {
		return taskService.findMine();
	}

	@PutMapping("/tasks/{id}")
	public TaskResponse update(@PathVariable Long id, @Valid @RequestBody TaskRequest request) {
		return taskService.update(id, request);
	}

	@PatchMapping("/tasks/{id}/move")
	public TaskResponse move(@PathVariable Long id, @Valid @RequestBody MoveRequest request) {
		return taskService.move(id, request);
	}

	@DeleteMapping("/tasks/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		taskService.delete(id);
	}
}
