package com.devmanager.invitation;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class InvitationControllerTest extends IntegrationTest {

	private String adminToken;

	@BeforeEach
	void createAdmin() throws Exception {
		adminToken = createUser("admin@devmanager.com", Role.ADMIN);
	}

	@Test
	void invitedPerson_joinsCompanyWithInvitedRole() throws Exception {
		perform(post("/api/invitations"), adminToken, "{\"email\":\"Bob@devmanager.com\",\"role\":\"MANAGER\"}")
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.email").value("bob@devmanager.com"))
				.andExpect(jsonPath("$.link").value(containsString("/invitation?token=")));

		String token = invitationRepository.findAll().getFirst().getToken();

		// Page publique "Rejoindre l'equipe"
		mockMvc.perform(get("/api/auth/invitations/" + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.organizationName").value("Entreprise de test"))
				.andExpect(jsonPath("$.role").value("MANAGER"));

		accept(token)
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.user.email").value("bob@devmanager.com"))
				.andExpect(jsonPath("$.user.role").value("MANAGER"))
				.andExpect(jsonPath("$.user.organizationName").value("Entreprise de test"));

		// Bob fait maintenant partie de l'equipe de l'administrateur
		perform(get("/api/users"), adminToken)
				.andExpect(jsonPath("$", hasSize(2)));

		// L'invitation ne peut servir qu'une fois
		accept(token).andExpect(status().isBadRequest());
	}

	@Test
	void onlyAdmins_canInvite() throws Exception {
		String managerToken = createUser("manager@devmanager.com", Role.MANAGER);

		perform(post("/api/invitations"), managerToken, "{\"email\":\"bob@devmanager.com\",\"role\":\"EMPLOYEE\"}")
				.andExpect(status().isForbidden());
	}

	@Test
	void cannotInvite_existingAccount() throws Exception {
		perform(post("/api/invitations"), adminToken, "{\"email\":\"admin@devmanager.com\",\"role\":\"EMPLOYEE\"}")
				.andExpect(status().isConflict());
	}

	@Test
	void revokedInvitation_cannotBeAccepted() throws Exception {
		Long id = idOf(perform(post("/api/invitations"), adminToken, "{\"email\":\"bob@devmanager.com\",\"role\":\"EMPLOYEE\"}"));
		String token = invitationRepository.findAll().getFirst().getToken();

		perform(get("/api/invitations"), adminToken).andExpect(jsonPath("$", hasSize(1)));
		perform(delete("/api/invitations/" + id), adminToken).andExpect(status().isNoContent());
		perform(get("/api/invitations"), adminToken).andExpect(jsonPath("$", hasSize(0)));

		accept(token).andExpect(status().isBadRequest());
	}

	private ResultActions accept(String token) throws Exception {
		return mockMvc.perform(post("/api/auth/accept-invitation")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"token":"%s","firstName":"Bob","lastName":"Kamga","password":"password123"}
						""".formatted(token)));
	}
}
