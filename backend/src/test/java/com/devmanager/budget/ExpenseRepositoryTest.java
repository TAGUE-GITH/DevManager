package com.devmanager.budget;

import com.devmanager.organization.Organization;
import com.devmanager.organization.OrganizationRepository;
import com.devmanager.project.Project;
import com.devmanager.project.ProjectRepository;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.data.jpa.test.autoconfigure.DataJpaTest;

import java.math.BigDecimal;
import java.time.LocalDate;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
class ExpenseRepositoryTest {

	@Autowired
	private OrganizationRepository organizationRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private ProjectRepository projectRepository;

	@Autowired
	private ExpenseRepository expenseRepository;

	private Project project;

	@BeforeEach
	void setUp() {
		Organization organization = organizationRepository.save(Organization.builder().name("Entreprise").build());
		User owner = userRepository.save(User.builder()
				.firstName("Alice").lastName("Martin")
				.email("alice@devmanager.com").password("secret")
				.role(Role.MANAGER).organization(organization).build());
		project = projectRepository.save(Project.builder()
				.name("Site vitrine").budget(new BigDecimal("10000"))
				.owner(owner).organization(organization).build());
	}

	@Test
	void sumAmountByProjectId_returnsZero_whenNoExpense() {
		assertThat(expenseRepository.sumAmountByProjectId(project.getId()))
				.isEqualByComparingTo("0");
	}

	@Test
	void sumAmountByProjectId_returnsTotalOfExpenses() {
		saveExpense("Licence IDE", "1500.50");
		saveExpense("Serveur", "2499.50");

		assertThat(expenseRepository.sumAmountByProjectId(project.getId()))
				.isEqualByComparingTo("4000");
	}

	private void saveExpense(String label, String amount) {
		expenseRepository.save(Expense.builder()
				.label(label).amount(new BigDecimal(amount))
				.category(ExpenseCategory.SOFTWARE).date(LocalDate.now())
				.project(project).build());
	}
}
