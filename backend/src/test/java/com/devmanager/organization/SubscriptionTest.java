package com.devmanager.organization;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.web.servlet.ResultActions;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.startsWith;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class SubscriptionTest extends IntegrationTest {

	private String adminToken;

	@BeforeEach
	void createAdmin() throws Exception {
		adminToken = createUser("admin@devmanager.com", Role.ADMIN);
	}

	@Test
	void freePlan_isLimitedTo3Projects_untilUpgradeToPro() throws Exception {
		for (int i = 1; i <= 3; i++) {
			createProject("Projet " + i).andExpect(status().isCreated());
		}
		createProject("Projet 4")
				.andExpect(status().isPaymentRequired())
				.andExpect(jsonPath("$.message").value(startsWith("L’offre Gratuite est limitée à 3 projets")));

		perform(post("/api/organization/subscription"), adminToken, "{\"method\":\"MOBILE_MONEY\"}")
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.plan").value("PRO"))
				.andExpect(jsonPath("$.currentPeriodEnd").isNotEmpty())
				.andExpect(jsonPath("$.usage.maxProjects").doesNotExist())
				.andExpect(jsonPath("$.payments", hasSize(1)))
				.andExpect(jsonPath("$.payments[0].amount").value(15000.0))
				.andExpect(jsonPath("$.payments[0].currency").value("XAF"))
				.andExpect(jsonPath("$.payments[0].reference").value(startsWith("DEMO-")));

		createProject("Projet 4").andExpect(status().isCreated());
	}

	@Test
	void freePlan_isLimitedTo5Members_includingPendingInvitations() throws Exception {
		createUser("membre1@devmanager.com", Role.EMPLOYEE);
		createUser("membre2@devmanager.com", Role.EMPLOYEE);
		createUser("membre3@devmanager.com", Role.EMPLOYEE);

		// 4 membres + 1 invitation en attente = 5 places occupees
		invite("membre4@devmanager.com").andExpect(status().isCreated());
		invite("membre5@devmanager.com").andExpect(status().isPaymentRequired());

		perform(get("/api/organization"), adminToken)
				.andExpect(jsonPath("$.usage.members").value(5))
				.andExpect(jsonPath("$.usage.maxMembers").value(5));
	}

	@Test
	void cancel_returnsToFreePlan_andKeepsExistingData() throws Exception {
		perform(post("/api/organization/subscription"), adminToken, "{\"method\":\"CARD\"}");
		for (int i = 1; i <= 4; i++) {
			createProject("Projet " + i);
		}

		perform(delete("/api/organization/subscription"), adminToken)
				.andExpect(jsonPath("$.plan").value("FREE"))
				.andExpect(jsonPath("$.usage.projects").value(4));

		// Les 4 projets restent visibles, mais on ne peut plus en ajouter
		perform(get("/api/projects"), adminToken).andExpect(jsonPath("$", hasSize(4)));
		createProject("Projet 5").andExpect(status().isPaymentRequired());
	}

	@Test
	void onlyAdmins_manageSubscription_andCompanyName() throws Exception {
		String managerToken = createUser("manager@devmanager.com", Role.MANAGER);

		perform(get("/api/organization"), managerToken).andExpect(status().isForbidden());
		perform(post("/api/organization/subscription"), managerToken, "{\"method\":\"CARD\"}")
				.andExpect(status().isForbidden());

		perform(put("/api/organization"), adminToken, "{\"name\":\"Kamga Services SARL\"}")
				.andExpect(jsonPath("$.name").value("Kamga Services SARL"));
		perform(get("/api/users/me"), managerToken)
				.andExpect(jsonPath("$.organizationName").value("Kamga Services SARL"))
				.andExpect(jsonPath("$.organizationPlan").value("FREE"));
	}

	private ResultActions createProject(String name) throws Exception {
		return perform(post("/api/projects"), adminToken, "{\"name\":\"%s\",\"budget\":1000}".formatted(name));
	}

	private ResultActions invite(String email) throws Exception {
		return perform(post("/api/invitations"), adminToken, "{\"email\":\"%s\",\"role\":\"EMPLOYEE\"}".formatted(email));
	}
}
