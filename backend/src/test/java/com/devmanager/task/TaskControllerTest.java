package com.devmanager.task;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.ResultActions;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class TaskControllerTest extends IntegrationTest {

	private String ownerToken;
	private String memberToken;
	private String otherManagerToken;
	private Long memberId;
	private Long projectId;

	@BeforeEach
	void createProject() throws Exception {
		ownerToken = createUser("owner@devmanager.com", Role.MANAGER);
		memberToken = createUser("member@devmanager.com", Role.EMPLOYEE);
		otherManagerToken = createUser("other@devmanager.com", Role.MANAGER);
		createUser("outsider@devmanager.com", Role.EMPLOYEE);
		memberId = userId("member@devmanager.com");

		projectId = idOf(perform(post("/api/projects"), ownerToken,
				"{\"name\":\"Application mobile\",\"budget\":1000,\"memberIds\":[%d]}".formatted(memberId)));
	}

	@Test
	void member_createsTask_assignedToTeammate() throws Exception {
		createTask(memberToken, "Maquettes", memberId)
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.status").value("TODO"))
				.andExpect(jsonPath("$.priority").value("HIGH"))
				.andExpect(jsonPath("$.assignee.email").value("member@devmanager.com"))
				.andExpect(jsonPath("$.createdBy.email").value("member@devmanager.com"));

		perform(get("/api/projects/" + projectId + "/tasks"), ownerToken)
				.andExpect(jsonPath("$", hasSize(1)));
	}

	@Test
	void task_cannotBeAssigned_outsideProjectTeam() throws Exception {
		createTask(ownerToken, "Tâche", userId("outsider@devmanager.com"))
				.andExpect(status().isBadRequest());
	}

	@Test
	void nonParticipantManager_canSeeTasks_butNotCreateThem() throws Exception {
		createTask(ownerToken, "Tâche", null);

		perform(get("/api/projects/" + projectId + "/tasks"), otherManagerToken)
				.andExpect(jsonPath("$", hasSize(1)));
		createTask(otherManagerToken, "Intrusion", null)
				.andExpect(status().isForbidden());
	}

	@Test
	void move_reordersColumns() throws Exception {
		Long a = idOf(createTask(ownerToken, "A", null));
		Long b = idOf(createTask(ownerToken, "B", null));
		Long c = idOf(createTask(ownerToken, "C", null));

		// B passe "En cours" : A et C se resserrent dans "A faire"
		perform(patch("/api/tasks/" + b + "/move"), memberToken, "{\"status\":\"IN_PROGRESS\",\"position\":0}")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("IN_PROGRESS"))
				.andExpect(jsonPath("$.position").value(0));

		// C remonte en tete de "A faire"
		perform(patch("/api/tasks/" + c + "/move"), memberToken, "{\"status\":\"TODO\",\"position\":0}");

		perform(get("/api/projects/" + projectId + "/tasks"), ownerToken)
				.andExpect(jsonPath("$[?(@.id == %d)].position".formatted(c)).value(0))
				.andExpect(jsonPath("$[?(@.id == %d)].position".formatted(a)).value(1))
				.andExpect(jsonPath("$[?(@.id == %d)].position".formatted(b)).value(0));
	}

	@Test
	void onlyAuthorOrProjectOwner_canDeleteTask() throws Exception {
		Long taskId = idOf(createTask(ownerToken, "Tâche du responsable", null));

		perform(delete("/api/tasks/" + taskId), memberToken).andExpect(status().isForbidden());
		perform(delete("/api/tasks/" + taskId), ownerToken).andExpect(status().isNoContent());
	}

	@Test
	void myTasks_listsTasksAssignedToMe_andProjectShowsProgress() throws Exception {
		Long done = idOf(createTask(ownerToken, "Terminée", memberId));
		createTask(ownerToken, "En attente", memberId);
		createTask(ownerToken, "Pour personne", null);
		perform(patch("/api/tasks/" + done + "/move"), memberToken, "{\"status\":\"DONE\",\"position\":0}");

		perform(get("/api/tasks/mine"), memberToken)
				.andExpect(jsonPath("$", hasSize(2)))
				.andExpect(jsonPath("$[0].title").value("En attente"))
				.andExpect(jsonPath("$[0].projectName").value("Application mobile"));

		perform(get("/api/projects/" + projectId), ownerToken)
				.andExpect(jsonPath("$.taskCount").value(3))
				.andExpect(jsonPath("$.completedTaskCount").value(1));
	}

	@Test
	void deletingProject_deletesItsTasks() throws Exception {
		createTask(ownerToken, "Tâche", null);

		perform(delete("/api/projects/" + projectId), ownerToken).andExpect(status().isNoContent());

		assertThat(taskRepository.count()).isZero();
	}

	private ResultActions createTask(String token, String title, Long assigneeId) throws Exception {
		return perform(post("/api/projects/" + projectId + "/tasks"), token, """
				{"title":"%s","priority":"HIGH","dueDate":"2026-12-31","assigneeId":%s}
				""".formatted(title, assigneeId));
	}
}
