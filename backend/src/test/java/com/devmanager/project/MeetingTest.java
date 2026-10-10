package com.devmanager.project;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MeetingTest extends IntegrationTest {

	@Test
	void projectMeeting_hasStableRandomRoom_forTeamOnly() throws Exception {
		String ownerToken = createUser("owner@devmanager.com", Role.MANAGER);
		String memberToken = createUser("member@devmanager.com", Role.EMPLOYEE);
		String outsiderToken = createUser("outsider@devmanager.com", Role.EMPLOYEE);
		Long projectId = idOf(perform(post("/api/projects"), ownerToken,
				"{\"name\":\"Refonte\",\"budget\":1000,\"memberIds\":[%d]}".formatted(userId("member@devmanager.com"))));

		String body = perform(get("/api/projects/" + projectId + "/meeting"), ownerToken)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.domain").value("meet.jit.si"))
				.andExpect(jsonPath("$.roomName").value(startsWith("DevManager")))
				.andExpect(jsonPath("$.url").value(startsWith("https://meet.jit.si/DevManager")))
				.andReturn().getResponse().getContentAsString();
		String room = JsonPath.read(body, "$.roomName");
		assertThat(room).hasSizeGreaterThan(30);

		// Meme salle pour tous les membres du projet, a chaque reunion
		perform(get("/api/projects/" + projectId + "/meeting"), memberToken)
				.andExpect(jsonPath("$.roomName").value(room));

		// Les personnes sans acces au projet n'obtiennent pas la salle
		perform(get("/api/projects/" + projectId + "/meeting"), outsiderToken).andExpect(status().isForbidden());
		String otherCompany = registerCompany("Autre SARL", "admin@autre.com");
		perform(get("/api/projects/" + projectId + "/meeting"), otherCompany).andExpect(status().isNotFound());
	}
}
