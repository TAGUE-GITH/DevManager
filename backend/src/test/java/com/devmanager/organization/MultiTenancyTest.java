package com.devmanager.organization;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Verifie qu'une entreprise ne peut jamais voir ni modifier les donnees d'une autre
class MultiTenancyTest extends IntegrationTest {

	private String adminA;
	private String adminB;
	private Long projectA;

	@BeforeEach
	void createTwoCompanies() throws Exception {
		adminA = createUser("admin@entreprise-a.com", Role.ADMIN);
		createUser("employe@entreprise-a.com", Role.EMPLOYEE);
		projectA = idOf(perform(post("/api/projects"), adminA, "{\"name\":\"Projet secret A\",\"budget\":1000}"));

		adminB = registerCompany("Entreprise B", "admin@entreprise-b.com");
	}

	@Test
	void projects_areIsolated() throws Exception {
		perform(get("/api/projects"), adminB).andExpect(jsonPath("$", hasSize(0)));
		perform(get("/api/projects/" + projectA), adminB).andExpect(status().isNotFound());
		perform(get("/api/projects/" + projectA + "/expenses"), adminB).andExpect(status().isNotFound());
		perform(delete("/api/projects/" + projectA), adminB).andExpect(status().isNotFound());
		perform(get("/api/dashboard"), adminB).andExpect(jsonPath("$.totalProjects").value(0));
	}

	@Test
	void users_areIsolated() throws Exception {
		perform(get("/api/users"), adminB)
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].email").value("admin@entreprise-b.com"));

		Long employeeA = userId("employe@entreprise-a.com");
		perform(patch("/api/users/" + employeeA + "/role"), adminB, "{\"role\":\"ADMIN\"}")
				.andExpect(status().isNotFound());
	}

	@Test
	void cannotMessage_orAddMember_fromAnotherCompany() throws Exception {
		Long employeeA = userId("employe@entreprise-a.com");

		perform(post("/api/messages"), adminB,
				"{\"recipientId\":%d,\"subject\":\"Bonjour\",\"content\":\"Test\"}".formatted(employeeA))
				.andExpect(status().isNotFound());

		perform(post("/api/projects"), adminB,
				"{\"name\":\"Projet B\",\"budget\":1000,\"memberIds\":[%d]}".formatted(employeeA))
				.andExpect(status().isBadRequest());
	}
}
