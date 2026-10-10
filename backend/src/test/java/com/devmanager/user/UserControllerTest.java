package com.devmanager.user;

import com.devmanager.IntegrationTest;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class UserControllerTest extends IntegrationTest {

	@Test
	void admin_changesRoleOfAnotherUser() throws Exception {
		String adminToken = createUser("admin@devmanager.com", Role.ADMIN);
		createUser("bob@devmanager.com", Role.EMPLOYEE);

		perform(patch("/api/users/" + userId("bob@devmanager.com") + "/role"), adminToken, "{\"role\":\"MANAGER\"}")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.role").value("MANAGER"));

		perform(get("/api/users"), adminToken)
				.andExpect(jsonPath("$", hasSize(2)));
	}

	@Test
	void nonAdmin_cannotChangeRoles() throws Exception {
		createUser("admin@devmanager.com", Role.ADMIN);
		String managerToken = createUser("manager@devmanager.com", Role.MANAGER);

		perform(patch("/api/users/" + userId("manager@devmanager.com") + "/role"), managerToken, "{\"role\":\"ADMIN\"}")
				.andExpect(status().isForbidden());
	}

	@Test
	void admin_cannotChangeOwnRole() throws Exception {
		String adminToken = createUser("admin@devmanager.com", Role.ADMIN);

		perform(patch("/api/users/" + userId("admin@devmanager.com") + "/role"), adminToken, "{\"role\":\"EMPLOYEE\"}")
				.andExpect(status().isBadRequest());
	}
}
