package com.devmanager;

import com.devmanager.auth.PasswordResetTokenRepository;
import com.devmanager.budget.ExpenseRepository;
import com.devmanager.message.MessageRepository;
import com.devmanager.project.ProjectRepository;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.BeforeEach;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.webmvc.test.autoconfigure.AutoConfigureMockMvc;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Base des tests d'integration : demarre l'application complete et vide la base avant chaque test
@SpringBootTest
@AutoConfigureMockMvc
public abstract class IntegrationTest {

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected UserRepository userRepository;

	@Autowired
	protected ProjectRepository projectRepository;

	@Autowired
	protected ExpenseRepository expenseRepository;

	@Autowired
	protected MessageRepository messageRepository;

	@Autowired
	protected PasswordResetTokenRepository resetTokenRepository;

	@BeforeEach
	void cleanDatabase() {
		messageRepository.deleteAll();
		expenseRepository.deleteAll();
		resetTokenRepository.deleteAll();
		projectRepository.deleteAll();
		userRepository.deleteAll();
	}

	// Cree un utilisateur avec le role voulu et renvoie son jeton JWT
	protected String createUser(String email, Role role) throws Exception {
		String body = mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"firstName":"Test","lastName":"%s","email":"%s","password":"password123"}
								""".formatted(email, email)))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();

		User user = userRepository.findByEmail(email).orElseThrow();
		user.setRole(role);
		userRepository.save(user);
		return JsonPath.read(body, "$.token");
	}

	protected Long userId(String email) {
		return userRepository.findByEmail(email).orElseThrow().getId();
	}

	protected ResultActions perform(MockHttpServletRequestBuilder request, String token) throws Exception {
		return mockMvc.perform(request.header("Authorization", "Bearer " + token));
	}

	protected ResultActions perform(MockHttpServletRequestBuilder request, String token, String json) throws Exception {
		return perform(request.contentType(MediaType.APPLICATION_JSON).content(json), token);
	}

	protected Long idOf(ResultActions result) throws Exception {
		return ((Number) JsonPath.read(result.andReturn().getResponse().getContentAsString(), "$.id")).longValue();
	}
}
