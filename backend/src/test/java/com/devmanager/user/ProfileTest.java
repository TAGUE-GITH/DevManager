package com.devmanager.user;

import com.devmanager.IntegrationTest;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.nullValue;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

class ProfileTest extends IntegrationTest {

	// Image PNG de 1 x 1 pixel
	private static final String PNG = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=";

	private String token;

	@BeforeEach
	void createUser() throws Exception {
		token = createUser("alice@devmanager.com", Role.ADMIN);
	}

	@Test
	void updateProfile_changesNameAndJobTitle() throws Exception {
		perform(put("/api/users/me"), token, "{\"firstName\":\"Alice\",\"lastName\":\"Martin\",\"jobTitle\":\"Cheffe de projet\"}")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.firstName").value("Alice"))
				.andExpect(jsonPath("$.jobTitle").value("Cheffe de projet"));
	}

	@Test
	void avatar_isStored_servedPublicly_andReplaced() throws Exception {
		String body = perform(put("/api/users/me/avatar"), token, "{\"dataUrl\":\"%s\"}".formatted(PNG))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.avatarUrl").value(startsWith("/api/images/")))
				.andReturn().getResponse().getContentAsString();
		String url = JsonPath.read(body, "$.avatarUrl");

		// Une balise <img> n'envoie pas de jeton : l'image est publique a son adresse aleatoire
		mockMvc.perform(get(url))
				.andExpect(status().isOk())
				.andExpect(content().contentType(MediaType.IMAGE_PNG))
				.andExpect(header().string("Cache-Control", org.hamcrest.Matchers.containsString("immutable")));

		// Nouvelle photo : l'ancienne est supprimee
		perform(put("/api/users/me/avatar"), token, "{\"dataUrl\":\"%s\"}".formatted(PNG));
		mockMvc.perform(get(url)).andExpect(status().isNotFound());
		assertThat(imageRepository.count()).isEqualTo(1);

		perform(delete("/api/users/me/avatar"), token).andExpect(jsonPath("$.avatarUrl").value(nullValue()));
		assertThat(imageRepository.count()).isZero();
	}

	@Test
	void avatar_rejectsInvalidImages() throws Exception {
		perform(put("/api/users/me/avatar"), token, "{\"dataUrl\":\"data:text/html;base64,PHNjcmlwdD4=\"}")
				.andExpect(status().isBadRequest());
		perform(put("/api/users/me/avatar"), token, "{\"dataUrl\":\"pas une image\"}")
				.andExpect(status().isBadRequest());
	}

	@Test
	void changePassword_requiresCurrentPassword() throws Exception {
		perform(put("/api/users/me/password"), token, "{\"currentPassword\":\"faux-mot-de-passe\",\"newPassword\":\"nouveau-mdp-123\"}")
				.andExpect(status().isBadRequest());

		perform(put("/api/users/me/password"), token, "{\"currentPassword\":\"%s\",\"newPassword\":\"nouveau-mdp-123\"}".formatted(PASSWORD))
				.andExpect(status().isNoContent());

		mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"alice@devmanager.com\",\"password\":\"nouveau-mdp-123\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void companyLogo_isManagedByAdmins_andVisibleToMembers() throws Exception {
		String employeeToken = createUser("bob@devmanager.com", Role.EMPLOYEE);

		perform(put("/api/organization/logo"), employeeToken, "{\"dataUrl\":\"%s\"}".formatted(PNG))
				.andExpect(status().isForbidden());
		perform(put("/api/organization/logo"), token, "{\"dataUrl\":\"%s\"}".formatted(PNG))
				.andExpect(jsonPath("$.logoUrl").value(startsWith("/api/images/")));

		perform(get("/api/users/me"), employeeToken)
				.andExpect(jsonPath("$.organizationLogoUrl").value(startsWith("/api/images/")));
	}

	@Test
	void demoAccount_cannotUploadImages_orChangePassword() throws Exception {
		String demoToken = JsonPath.read(mockMvc.perform(post("/api/auth/demo")).andReturn().getResponse().getContentAsString(), "$.token");

		perform(put("/api/users/me/avatar"), demoToken, "{\"dataUrl\":\"%s\"}".formatted(PNG)).andExpect(status().isForbidden());
		perform(put("/api/organization/logo"), demoToken, "{\"dataUrl\":\"%s\"}".formatted(PNG)).andExpect(status().isForbidden());
		perform(put("/api/users/me/password"), demoToken, "{\"currentPassword\":\"x\",\"newPassword\":\"nouveau-mdp-123\"}")
				.andExpect(status().isForbidden());
	}
}
