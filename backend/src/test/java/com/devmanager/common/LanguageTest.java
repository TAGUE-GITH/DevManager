package com.devmanager.common;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Le serveur repond dans la langue demandee par le navigateur (en-tete Accept-Language), en francais par defaut
class LanguageTest extends IntegrationTest {

	@Test
	void validationErrors_areTranslated() throws Exception {
		mockMvc.perform(post("/api/auth/login").contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"x\",\"password\":\"\"}"))
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.message").value("Données invalides"))
				.andExpect(jsonPath("$.errors.email").value("Email invalide"))
				.andExpect(jsonPath("$.errors.password").value("Ce champ est obligatoire"));

		mockMvc.perform(post("/api/auth/login").header("Accept-Language", "en-US,en;q=0.9")
						.contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"x\",\"password\":\"\"}"))
				.andExpect(jsonPath("$.message").value("Invalid data"))
				.andExpect(jsonPath("$.errors.email").value("Invalid email address"))
				.andExpect(jsonPath("$.errors.password").value("This field is required"));
	}

	@Test
	void businessErrors_areTranslated_withArguments() throws Exception {
		String token = createUser("admin@devmanager.com", Role.ADMIN);

		mockMvc.perform(get("/api/projects/999").header("Authorization", "Bearer " + token).header("Accept-Language", "en"))
				.andExpect(status().isNotFound())
				.andExpect(jsonPath("$.message").value("Project not found"));

		for (int i = 1; i <= 3; i++) {
			perform(post("/api/projects"), token, "{\"name\":\"P%d\",\"budget\":1000}".formatted(i));
		}
		mockMvc.perform(post("/api/projects").header("Authorization", "Bearer " + token).header("Accept-Language", "en")
						.contentType(MediaType.APPLICATION_JSON).content("{\"name\":\"P4\",\"budget\":1000}"))
				.andExpect(status().isPaymentRequired())
				.andExpect(jsonPath("$.message").value("The Free plan is limited to 3 projects. Upgrade to the Pro plan to create more."));
	}

	@Test
	void unsupportedLanguage_fallsBackToFrench() throws Exception {
		mockMvc.perform(post("/api/auth/login").header("Accept-Language", "de-DE")
						.contentType(MediaType.APPLICATION_JSON).content("{\"email\":\"a@b.com\",\"password\":\"mauvais\"}"))
				.andExpect(status().isUnauthorized())
				.andExpect(jsonPath("$.message").value("Email ou mot de passe incorrect"));
	}
}
