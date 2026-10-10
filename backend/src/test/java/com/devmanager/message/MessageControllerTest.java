package com.devmanager.message;

import com.devmanager.IntegrationTest;
import com.devmanager.user.Role;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class MessageControllerTest extends IntegrationTest {

	private String aliceToken;
	private String bobToken;
	private String eveToken;

	@BeforeEach
	void createUsers() throws Exception {
		aliceToken = createUser("alice@devmanager.com", Role.MANAGER);
		bobToken = createUser("bob@devmanager.com", Role.EMPLOYEE);
		eveToken = createUser("eve@devmanager.com", Role.EMPLOYEE);
	}

	@Test
	void sendMessage_appearsInInbox_andCanBeMarkedAsRead() throws Exception {
		Long messageId = idOf(perform(post("/api/messages"), aliceToken, messageTo("bob@devmanager.com"))
				.andExpect(status().isCreated())
				.andExpect(jsonPath("$.sender.email").value("alice@devmanager.com"))
				.andExpect(jsonPath("$.read").value(false)));

		perform(get("/api/messages/inbox"), bobToken)
				.andExpect(jsonPath("$", hasSize(1)))
				.andExpect(jsonPath("$[0].subject").value("Réunion"));
		perform(get("/api/messages/sent"), aliceToken)
				.andExpect(jsonPath("$", hasSize(1)));
		perform(get("/api/messages/unread-count"), bobToken)
				.andExpect(jsonPath("$.count").value(1));

		perform(patch("/api/messages/" + messageId + "/read"), bobToken)
				.andExpect(status().isOk())
				.andExpect(jsonPath("$.read").value(true));

		perform(get("/api/messages/unread-count"), bobToken)
				.andExpect(jsonPath("$.count").value(0));
	}

	@Test
	void otherUsers_cannotReadMessage() throws Exception {
		Long messageId = idOf(perform(post("/api/messages"), aliceToken, messageTo("bob@devmanager.com")));

		perform(get("/api/messages/" + messageId), eveToken)
				.andExpect(status().isForbidden());

		// L'expediteur ne peut pas marquer le message comme lu a la place du destinataire
		perform(patch("/api/messages/" + messageId + "/read"), aliceToken)
				.andExpect(status().isForbidden());
	}

	@Test
	void cannotSendMessageToYourself() throws Exception {
		perform(post("/api/messages"), aliceToken, messageTo("alice@devmanager.com"))
				.andExpect(status().isBadRequest());
	}

	private String messageTo(String email) {
		return """
				{"recipientId":%d,"subject":"Réunion","content":"Point projet demain à 9h"}
				""".formatted(userId(email));
	}
}
