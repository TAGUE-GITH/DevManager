package com.devmanager.project;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class ProjectControllerTest extends IntegrationTest {

	private String adminToken;
	private String managerToken;
	private String employeeToken;

	@BeforeEach
	void createUsers() throws Exception {
		adminToken = createUser("admin@devmanager.com", Role.ADMIN);
		managerToken = createUser("manager@devmanager.com", Role.MANAGER);
		employeeToken = createUser("employee@devmanager.com", Role.EMPLOYEE);
	}

	@Test
	void manager_createsProject_andBecomesOwner() throws Exception {
		perform(post("/api/projects"), managerToken, projectJson("Site e-commerce", 10000, ""))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.name").value("Site e-commerce"))
				.andExpect(jsonPath("$.status").value("TODO"))
				.andExpect(jsonPath("$.owner.email").value("manager@devmanager.com"))
				.andExpect(jsonPath("$.budget").value(10000.0))
				.andExpect(jsonPath("$.spent").value(0.0))
				.andExpect(jsonPath("$.remaining").value(10000.0));
	}

	@Test
	void employee_cannotCreateProject() throws Exception {
		perform(post("/api/projects"), employeeToken, projectJson("Projet", 1000, ""))
				.andExpect(status().isForbidden());
	}

	@Test
	void employee_seesOnlyProjectsWhereHeIsMember() throws Exception {
		Long employeeId = userId("employee@devmanager.com");
		perform(post("/api/projects"), managerToken, projectJson("Avec employé", 1000, employeeId.toString()));
		Long otherId = idOf(perform(post("/api/projects"), managerToken, projectJson("Sans employé", 1000, "")));

		perform(get("/api/projects"), employeeToken)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].name").value("Avec employé"));

		perform(get("/api/projects/" + otherId), employeeToken)
				.andExpect(status().isForbidden());

		// Un admin voit tout
		perform(get("/api/projects"), adminToken)
				.andExpect(jsonPath("$", hasSize(2)));
	}

	@Test
	void expenses_updateBudgetSummary() throws Exception {
		Long projectId = idOf(perform(post("/api/projects"), managerToken, projectJson("Application mobile", 10000, "")));

		perform(post("/api/projects/" + projectId + "/expenses"), managerToken, expenseJson("Licences", 2500))
				.andExpect(status().isCreated());
		perform(post("/api/projects/" + projectId + "/expenses"), managerToken, expenseJson("Serveur", 1500))
				.andExpect(status().isCreated());

		perform(get("/api/projects/" + projectId), managerToken)
				.andExpect(jsonPath("$.spent").value(4000.0))
				.andExpect(jsonPath("$.remaining").value(6000.0))
				.andExpect(jsonPath("$.consumedPercent").value(40));

		perform(get("/api/projects/" + projectId + "/expenses"), managerToken)
				.andExpect(jsonPath("$", hasSize(2)));
	}

	@Test
	void member_canChangeStatus_butCannotAddExpense() throws Exception {
		Long employeeId = userId("employee@devmanager.com");
		Long projectId = idOf(perform(post("/api/projects"), managerToken,
				projectJson("Refonte", 5000, employeeId.toString())));

		perform(patch("/api/projects/" + projectId + "/status"), employeeToken, "{\"status\":\"IN_PROGRESS\"}")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.status").value("IN_PROGRESS"));

		perform(post("/api/projects/" + projectId + "/expenses"), employeeToken, expenseJson("Café", 20))
				.andExpect(status().isForbidden());
	}

	@Test
	void owner_deletesProjectWithExpenses() throws Exception {
		Long projectId = idOf(perform(post("/api/projects"), managerToken, projectJson("Temporaire", 1000, "")));
		perform(post("/api/projects/" + projectId + "/expenses"), managerToken, expenseJson("Achat", 100));

		perform(delete("/api/projects/" + projectId), managerToken)
				.andExpect(status().isNoContent());

		perform(get("/api/projects/" + projectId), managerToken)
				.andExpect(status().isNotFound());
	}

	@Test
	void project_rejectsEndDateBeforeStartDate() throws Exception {
		String json = """
				{"name":"Projet","budget":1000,"startDate":"2026-12-01","endDate":"2026-01-01"}
				""";
		perform(post("/api/projects"), managerToken, json)
				.andExpect(status().isBadRequest());
	}

	@Test
	void dashboard_aggregatesVisibleProjects() throws Exception {
		Long projectId = idOf(perform(post("/api/projects"), managerToken, projectJson("A", 3000, "")));
		perform(post("/api/projects"), managerToken, projectJson("B", 2000, ""));
		perform(post("/api/projects/" + projectId + "/expenses"), managerToken, expenseJson("Achat", 500));

		perform(get("/api/dashboard"), managerToken)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalProjects").value(2))
				.andExpect(jsonPath("$.projectsByStatus.TODO").value(2))
				.andExpect(jsonPath("$.totalBudget").value(5000.0))
				.andExpect(jsonPath("$.totalSpent").value(500.0));
	}

	private String projectJson(String name, int budget, String memberIds) {
		return """
				{"name":"%s","description":"Description","budget":%d,"memberIds":[%s]}
				""".formatted(name, budget, memberIds);
	}

	private String expenseJson(String label, int amount) {
		return """
				{"label":"%s","amount":%d,"category":"SOFTWARE","date":"2026-10-01"}
				""".formatted(label, amount);
	}
}
