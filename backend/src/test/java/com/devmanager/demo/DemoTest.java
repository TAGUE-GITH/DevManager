package com.devmanager.demo;

import com.devmanager.IntegrationTest;
import com.devmanager.organization.Organization;
import com.devmanager.user.Role;
import com.jayway.jsonpath.JsonPath;
import org.junit.jupiter.api.Test;

import java.time.LocalDateTime;

import static org.assertj.core.api.Assertions.assertThat;
import static org.hamcrest.Matchers.greaterThan;
import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class DemoTest extends IntegrationTest {

	@Test
	void demoLogin_opensPrefilledDemoCompany() throws Exception {
		String token = demoToken();

		perform(get("/api/users/me"), token)
				.andExpect(jsonPath("$.demo").value(true))
				.andExpect(jsonPath("$.role").value("ADMIN"))
				.andExpect(jsonPath("$.organizationPlan").value("PRO"));

		perform(get("/api/projects"), token).andExpect(jsonPath("$", hasSize(5)));
		perform(get("/api/users"), token).andExpect(jsonPath("$", hasSize(4)));
		perform(get("/api/dashboard"), token)
				.andExpect(jsonPath("$.totalSpent").value(greaterThan(0.0)))
				.andExpect(jsonPath("$.unreadMessages").value(2))
				.andExpect(jsonPath("$.overdueTasks").value(greaterThan(0)));
	}

	@Test
	void demoData_isReused_thenRecreatedWhenOutdated() throws Exception {
		demoToken();
		Long firstId = demoOrganization().getId();

		demoToken();
		assertThat(demoOrganization().getId()).isEqualTo(firstId);

		// Donnees trop anciennes : elles sont supprimees puis recreees
		Organization organization = demoOrganization();
		organization.setCreatedAt(LocalDateTime.now().minusHours(DemoService.RESET_AFTER_HOURS + 1));
		organizationRepository.save(organization);

		demoToken();
		assertThat(demoOrganization().getId()).isNotEqualTo(firstId);
		assertThat(organizationRepository.findAll().stream().filter(Organization::isDemo)).hasSize(1);
	}

	@Test
	void demo_cannotSendInvitations() throws Exception {
		perform(post("/api/invitations"), demoToken(), "{\"email\":\"victime@gmail.com\",\"role\":\"EMPLOYEE\"}")
				.andExpect(status().isForbidden());
	}

	@Test
	void demo_isIsolatedFromRealCompanies() throws Exception {
		String realAdmin = createUser("admin@devmanager.com", Role.ADMIN);
		demoToken();

		perform(get("/api/projects"), realAdmin).andExpect(jsonPath("$", hasSize(0)));
		perform(get("/api/users"), realAdmin).andExpect(jsonPath("$", hasSize(1)));
	}

	private String demoToken() throws Exception {
		String body = mockMvc.perform(post("/api/auth/demo"))
				.andExpect(status().isOk())
				.andReturn().getResponse().getContentAsString();
		return JsonPath.read(body, "$.token");
	}

	private Organization demoOrganization() {
		return userRepository.findByEmail(DemoService.DEMO_LOGIN).orElseThrow().getOrganization();
	}
}
