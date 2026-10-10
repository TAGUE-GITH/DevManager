package com.devmanager;

import com.devmanager.auth.PasswordResetTokenRepository;
import com.devmanager.budget.ExpenseRepository;
import com.devmanager.invitation.InvitationRepository;
import com.devmanager.message.MessageRepository;
import com.devmanager.organization.Organization;
import com.devmanager.organization.OrganizationRepository;
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
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.ResultActions;
import org.springframework.test.web.servlet.request.MockHttpServletRequestBuilder;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

// Base des tests d'integration : demarre l'application complete, vide la base
// et cree une entreprise de test avant chaque test
@SpringBootTest
@AutoConfigureMockMvc
public abstract class IntegrationTest {

	protected static final String PASSWORD = "password123";

	@Autowired
	protected MockMvc mockMvc;

	@Autowired
	protected OrganizationRepository organizationRepository;

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

	@Autowired
	protected InvitationRepository invitationRepository;

	@Autowired
	private PasswordEncoder passwordEncoder;

	// Entreprise dans laquelle createUser() ajoute les utilisateurs
	protected Organization organization;

	@BeforeEach
	void resetDatabase() {
		messageRepository.deleteAll();
		expenseRepository.deleteAll();
		resetTokenRepository.deleteAll();
		invitationRepository.deleteAll();
		projectRepository.deleteAll();
		userRepository.deleteAll();
		organizationRepository.deleteAll();

		organization = organizationRepository.save(Organization.builder().name("Entreprise de test").build());
	}

	// Cree un utilisateur dans l'entreprise de test et renvoie son jeton JWT
	protected String createUser(String email, Role role) throws Exception {
		userRepository.save(User.builder()
				.firstName("Test").lastName(email).email(email)
				.password(passwordEncoder.encode(PASSWORD))
				.role(role).organization(organization)
				.build());
		return login(email);
	}

	// Inscrit une nouvelle entreprise via l'API et renvoie le jeton de son administrateur
	protected String registerCompany(String companyName, String email) throws Exception {
		String body = mockMvc.perform(post("/api/auth/register")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"companyName":"%s","firstName":"Admin","lastName":"%s","email":"%s","password":"%s"}
								""".formatted(companyName, companyName, email, PASSWORD)))
				.andExpect(status().isCreated())
				.andReturn().getResponse().getContentAsString();
		return JsonPath.read(body, "$.token");
	}

	protected String login(String email) throws Exception {
		String body = mockMvc.perform(post("/api/auth/login")
						.contentType(MediaType.APPLICATION_JSON)
						.content("""
								{"email":"%s","password":"%s"}
								""".formatted(email, PASSWORD)))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
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
