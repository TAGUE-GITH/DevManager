package com.devmanager.project;

import com.devmanager.project.ProjectDtos.ProjectRequest;
import com.devmanager.project.ProjectDtos.ProjectResponse;
import com.devmanager.project.ProjectDtos.StatusRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

	private final ProjectService projectService;

	@GetMapping
	public List<ProjectResponse> findAll() {
		return projectService.findVisible();
	}

	@GetMapping("/{id}")
	public ProjectResponse findById(@PathVariable Long id) {
		return projectService.findById(id);
	}

	@PostMapping
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasAnyRole('ADMIN', 'MANAGER')")
	public ProjectResponse create(@Valid @RequestBody ProjectRequest request) {
		return projectService.create(request);
	}

	@PutMapping("/{id}")
	public ProjectResponse update(@PathVariable Long id, @Valid @RequestBody ProjectRequest request) {
		return projectService.update(id, request);
	}

	@PatchMapping("/{id}/status")
	public ProjectResponse updateStatus(@PathVariable Long id, @Valid @RequestBody StatusRequest request) {
		return projectService.updateStatus(id, request.status());
	}

	@DeleteMapping("/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	public void delete(@PathVariable Long id) {
		projectService.delete(id);
	}
}
