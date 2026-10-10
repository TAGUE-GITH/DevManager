package com.devmanager.auth;

import com.devmanager.user.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class AuthControllerTest {

	@Autowired
	private MockMvc mockMvc;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private PasswordResetTokenRepository resetTokenRepository;

	@BeforeEach
	void cleanDatabase() {
		resetTokenRepository.deleteAll();
		userRepository.deleteAll();
	}

	@Test
	void register_createsAccount_andFirstUserIsAdmin() throws Exception {
		register("alice@devmanager.com", "password123")
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.token").isNotEmpty())
				.andExpect(jsonPath("$.user.email").value("alice@devmanager.com"))
				.andExpect(jsonPath("$.user.role").value("ADMIN"))
				.andExpect(jsonPath("$.user.password").doesNotExist());

		register("bob@devmanager.com", "password123")
				.andExpect(jsonPath("$.user.role").value("EMPLOYEE"));
	}

	@Test
	void register_rejectsDuplicateEmail() throws Exception {
		register("alice@devmanager.com", "password123");

		register("ALICE@devmanager.com", "password123")
				.andExpect(status().isConflict());
	}

	@Test
	void register_rejectsInvalidData() throws Exception {
		register("pas-un-email", "court")
				.andExpect(status().isBadRequest())
				.andExpect(jsonPath("$.errors.email").exists())
				.andExpect(jsonPath("$.errors.password").exists());
	}

	@Test
	void login_returnsToken_withValidCredentials() throws Exception {
		register("alice@devmanager.com", "password123");

		login("alice@devmanager.com", "password123")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.token").isNotEmpty());
	}

	@Test
	void login_returns401_withWrongPassword() throws Exception {
		register("alice@devmanager.com", "password123");

		login("alice@devmanager.com", "mauvais-mot-de-passe")
				.andExpect(status().isUnauthorized());
	}

	@Test
	void protectedRoute_requiresValidToken() throws Exception {
		mockMvc.perform(get("/api/users/me"))
				.andExpect(status().isUnauthorized());

		mockMvc.perform(get("/api/users/me").header("Authorization", "Bearer jeton-invalide"))
				.andExpect(status().isUnauthorized());

		String token = tokenOf(register("alice@devmanager.com", "password123"));
		mockMvc.perform(get("/api/users/me").header("Authorization", "Bearer " + token))
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.email").value("alice@devmanager.com"));
	}

	@Test
	void forgotPassword_doesNotRevealUnknownEmail() throws Exception {
		mockMvc.perform(post("/api/auth/forgot-password")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"inconnu@devmanager.com\"}"))
				.andExpect(status().isOk());
	}

	@Test
	void resetPassword_changesPassword_andTokenIsSingleUse() throws Exception {
		register("alice@devmanager.com", "ancien-mdp-123");

		mockMvc.perform(post("/api/auth/forgot-password")
						.contentType(MediaType.APPLICATION_JSON)
						.content("{\"email\":\"alice@devmanager.com\"}"))
				.andExpect(status().isOk());

		String resetToken = resetTokenRepository.findAll().getFirst().getToken();

		resetPassword(resetToken, "nouveau-mdp-456").andExpect(status().isOk());

		login("alice@devmanager.com", "ancien-mdp-123").andExpect(status().isUnauthorized());
		login("alice@devmanager.com", "nouveau-mdp-456").andExpect(status().isOk());

		// Un jeton deja utilise est refuse
		resetPassword(resetToken, "autre-mdp-789").andExpect(status().isBadRequest());
	}

	@Test
	void resetPassword_rejectsUnknownToken() throws Exception {
		resetPassword("jeton-inexistant", "nouveau-mdp-456")
				.andExpect(status().isBadRequest());
	}

	private ResultActions register(String email, String password) throws Exception {
		return mockMvc.perform(post("/api/auth/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"firstName":"Alice","lastName":"Martin","email":"%s","password":"%s"}
						""".formatted(email, password)));
	}

	private ResultActions login(String email, String password) throws Exception {
		return mockMvc.perform(post("/api/auth/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"email":"%s","password":"%s"}
						""".formatted(email, password)));
	}

	private ResultActions resetPassword(String token, String newPassword) throws Exception {
		return mockMvc.perform(post("/api/auth/reset-password")
				.contentType(MediaType.APPLICATION_JSON)
				.content("""
						{"token":"%s","newPassword":"%s"}
						""".formatted(token, newPassword)));
	}

	private String tokenOf(ResultActions result) throws Exception {
		return JsonPath.read(result.andReturn().getResponse().getContentAsString(), "$.token");
	}
}
