package com.devmanager.dashboard;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.time.LocalDate;
import java.time.YearMonth;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DashboardControllerTest extends IntegrationTest {

	private String managerToken;
	private Long projectId;

	@BeforeEach
	void createProject() throws Exception {
		managerToken = createUser("manager@devmanager.com", Role.MANAGER);
		projectId = idOf(perform(post("/api/projects"), managerToken, "{\"name\":\"Projet\",\"budget\":10000}"));
	}

	@Test
	void expenses_areGroupedByCategory_andByMonth() throws Exception {
		LocalDate today = LocalDate.now();
		addExpense("SOFTWARE", 1000, today);
		addExpense("SOFTWARE", 500, today);
		addExpense("TRAVEL", 300, today.minusMonths(2));
		// Trop ancienne pour l'evolution sur 6 mois, mais comptee dans les categories
		addExpense("TRAVEL", 200, today.minusMonths(8));

		String currentMonth = YearMonth.from(today).toString();
		perform(get("/api/dashboard"), managerToken)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.totalSpent").value(2000.0))
				.andExpect(jsonPath("$.expensesByCategory.SOFTWARE").value(1500.0))
				.andExpect(jsonPath("$.expensesByCategory.TRAVEL").value(500.0))
				.andExpect(jsonPath("$.expensesByCategory.SALARY").value(0))
				.andExpect(jsonPath("$.monthlyExpenses", hasSize(6)))
				.andExpect(jsonPath("$.monthlyExpenses[5].month").value(currentMonth))
				.andExpect(jsonPath("$.monthlyExpenses[5].amount").value(1500.0))
				.andExpect(jsonPath("$.monthlyExpenses[3].amount").value(300.0))
				.andExpect(jsonPath("$.monthlyExpenses[0].amount").value(0));
	}

	@Test
	void tasks_areCountedByStatus_withOverdueAndMine() throws Exception {
		Long managerId = userId("manager@devmanager.com");
		addTask("En retard", "2020-01-01", managerId);
		addTask("A venir", "2099-01-01", managerId);
		Long done = addTask("Terminée en retard", "2020-01-01", null);
		perform(patch("/api/tasks/" + done + "/move"), managerToken, "{\"status\":\"DONE\",\"position\":0}");

		perform(get("/api/dashboard"), managerToken)
				.andExpect(jsonPath("$.tasksByStatus.TODO").value(2))
				.andExpect(jsonPath("$.tasksByStatus.DONE").value(1))
				.andExpect(jsonPath("$.tasksByStatus.REVIEW").value(0))
				// Une tache terminee n'est jamais en retard
				.andExpect(jsonPath("$.overdueTasks").value(1))
				.andExpect(jsonPath("$.myOpenTasks").value(2));
	}

	private void addExpense(String category, int amount, LocalDate date) throws Exception {
		perform(post("/api/projects/" + projectId + "/expenses"), managerToken, """
				{"label":"Dépense","amount":%d,"category":"%s","date":"%s"}
				""".formatted(amount, category, date))
				.andExpect(status().isCreated());
	}

	private Long addTask(String title, String dueDate, Long assigneeId) throws Exception {
		return idOf(perform(post("/api/projects/" + projectId + "/tasks"), managerToken, """
				{"title":"%s","priority":"MEDIUM","dueDate":"%s","assigneeId":%s}
				""".formatted(title, dueDate, assigneeId)));
	}
}
