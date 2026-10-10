package com.devmanager.message;

import com.devmanager.organization.Organization;
import com.devmanager.organization.OrganizationRepository;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class MessageRepositoryTest {

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private MessageRepository messageRepository;

	@Test
	void countUnreadMessages_ignoresReadOnes() {
		User alice = saveUser("alice@devmanager.com");
		User bob = saveUser("bob@devmanager.com");

		messageRepository.save(Message.builder().sender(alice).recipient(bob)
				.subject("Réunion").content("Demain 9h").build());
		messageRepository.save(Message.builder().sender(alice).recipient(bob)
				.subject("Budget").content("Validé").read(true).build());

		assertThat(messageRepository.countByRecipientIdAndReadFalse(bob.getId())).isEqualTo(1);
		assertThat(messageRepository.findByRecipientIdOrderBySentAtDesc(bob.getId())).hasSize(2);
	}

	private User saveUser(String email) {
		Organization organization = organizationRepository.save(Organization.builder().name("Entreprise").build());
		return userRepository.save(User.builder()
				.firstName("Test").lastName("User").email(email)
				.password("secret").role(Role.EMPLOYEE).organization(organization).build());
	}
}
