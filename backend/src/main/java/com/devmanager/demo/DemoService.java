package com.devmanager.demo;

import com.devmanager.budget.Expense;
import com.devmanager.budget.ExpenseCategory;
import com.devmanager.budget.ExpenseRepository;
import com.devmanager.message.Message;
import com.devmanager.message.MessageRepository;
import com.devmanager.organization.*;
import com.devmanager.project.Project;
import com.devmanager.project.ProjectRepository;
import com.devmanager.project.ProjectStatus;
import com.devmanager.task.Task;
import com.devmanager.task.TaskPriority;
import com.devmanager.task.TaskRepository;
import com.devmanager.task.TaskStatus;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import com.devmanager.user.UserRepository;
import jakarta.persistence.EntityManager;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

/**
 * Entreprise de demonstration ("Essayer la demo") : des donnees realistes pour decouvrir l'application sans compte.
 * - Les dates sont calculees par rapport a aujourd'hui : les graphiques sont toujours remplis.
 * - Les donnees sont recreees si elles ont plus de RESET_AFTER_HOURS heures (les visiteurs peuvent les modifier).
 * - Les adresses utilisent le domaine reserve ".example" : aucun email n'est jamais envoye.
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class DemoService {

	public static final String EMAIL_DOMAIN = "@devmanager.example";
	static final String DEMO_LOGIN = "jean.dupont" + EMAIL_DOMAIN;
	static final long RESET_AFTER_HOURS = 6;

	private final EntityManager entityManager;
	private final OrganizationRepository organizationRepository;
	private final UserRepository userRepository;
	private final ProjectRepository projectRepository;
	private final TaskRepository taskRepository;
	private final ExpenseRepository expenseRepository;
	private final MessageRepository messageRepository;
	private final PaymentRepository paymentRepository;
	private final PasswordEncoder passwordEncoder;

	// Rang des taches dans chaque colonne pendant la creation des donnees
	private final Map<String, Integer> positions = new HashMap<>();

	// Utilisateur de demonstration, apres (re)creation des donnees si necessaire.
	// synchronized : deux visiteurs simultanes ne doivent pas creer deux entreprises de demonstration
	@Transactional
	public synchronized User getDemoUser() {
		Optional<User> existing = userRepository.findByEmail(DEMO_LOGIN);
		boolean outdated = existing
				.map(user -> user.getOrganization().getCreatedAt().isBefore(LocalDateTime.now().minusHours(RESET_AFTER_HOURS)))
				.orElse(true);
		if (!outdated) {
			return existing.get();
		}
		existing.ifPresent(user -> delete(user.getOrganization()));
		log.info("Création des données de démonstration");
		return create();
	}

	// Supprime toutes les donnees d'une entreprise de demonstration (dans l'ordre des dependances)
	private void delete(Organization organization) {
		Long id = organization.getId();
		String users = "(select u.id from User u where u.organization.id = :id)";
		String projects = "(select p.id from Project p where p.organization.id = :id)";
		execute("delete from Message m where m.sender.id in " + users + " or m.recipient.id in " + users, id);
		execute("delete from Task t where t.project.id in " + projects, id);
		execute("delete from Expense e where e.project.id in " + projects, id);
		entityManager.createNativeQuery(
						"delete from project_members where project_id in (select id from projects where organization_id = :id)")
				.setParameter("id", id).executeUpdate();
		execute("delete from Project p where p.organization.id = :id", id);
		execute("delete from Invitation i where i.organization.id = :id", id);
		execute("delete from PasswordResetToken t where t.user.id in " + users, id);
		execute("delete from Payment p where p.organization.id = :id", id);
		execute("delete from User u where u.organization.id = :id", id);
		execute("delete from Organization o where o.id = :id", id);
		entityManager.flush();
		entityManager.clear();
	}

	private void execute(String jpql, Long organizationId) {
		entityManager.createQuery(jpql).setParameter("id", organizationId).executeUpdate();
	}

	private User create() {
		positions.clear();
		LocalDate today = LocalDate.now();
		Organization organization = organizationRepository.save(Organization.builder()
				.name("Kamga Services")
				.plan(Plan.PRO)
				.currentPeriodEnd(LocalDateTime.now().plusDays(21))
				.demo(true)
				.build());
		paymentRepository.save(Payment.builder()
				.organization(organization)
				.amount(Plan.PRO.getMonthlyPrice())
				.currency("XAF")
				.method(PaymentMethod.MOBILE_MONEY)
				.reference("DEMO-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase())
				.periodEnd(organization.getCurrentPeriodEnd())
				.createdAt(LocalDateTime.now().minusDays(9))
				.build());

		User jean = user(organization, "Jean", "Dupont", Role.ADMIN);
		User marie = user(organization, "Marie", "Ngono", Role.MANAGER);
		User paul = user(organization, "Paul", "Etoga", Role.EMPLOYEE);
		User aicha = user(organization, "Aïcha", "Bello", Role.EMPLOYEE);

		Project boutique = project(organization, "Boutique en ligne Douala",
				"Site e-commerce avec paiement Orange Money et MTN MoMo, livraison à Douala et Yaoundé.",
				"2500000", ProjectStatus.IN_PROGRESS, today.minusMonths(4), today.plusMonths(2), marie, paul, aicha);
		task(boutique, jean, "Maquettes de la page d'accueil", TaskStatus.DONE, TaskPriority.HIGH, today.minusDays(40), aicha);
		task(boutique, marie, "Intégration du paiement mobile money", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, today.plusDays(10), paul);
		task(boutique, marie, "Fiches produits et catalogue", TaskStatus.REVIEW, TaskPriority.MEDIUM, today.plusDays(4), aicha);
		task(boutique, marie, "Calcul des frais de livraison", TaskStatus.TODO, TaskPriority.MEDIUM, today.minusDays(3), paul);
		task(boutique, marie, "Rédaction des conditions générales de vente", TaskStatus.TODO, TaskPriority.LOW, today.plusDays(20), marie);
		task(boutique, marie, "Tests sur téléphones Android", TaskStatus.TODO, TaskPriority.HIGH, today.plusDays(25), aicha);
		expense(boutique, "Développeur freelance", "900000", ExpenseCategory.SALARY, today.minusMonths(4));
		expense(boutique, "Licences logicielles", "250000", ExpenseCategory.SOFTWARE, today.minusMonths(3));
		expense(boutique, "Hébergement et nom de domaine", "120000", ExpenseCategory.SOFTWARE, today.minusMonths(1));
		expense(boutique, "Déplacement chez les livreurs à Yaoundé", "180000", ExpenseCategory.TRAVEL, today.minusDays(12));

		Project rh = project(organization, "Application mobile RH",
				"Application de gestion des congés et des fiches de paie pour les employés.",
				"4000000", ProjectStatus.IN_PROGRESS, today.minusMonths(3), today.plusMonths(3), jean, marie, paul);
		task(rh, jean, "Cahier des charges", TaskStatus.DONE, TaskPriority.HIGH, today.minusDays(60), jean);
		task(rh, jean, "Écrans de demande de congés", TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, today.plusDays(7), marie);
		task(rh, jean, "Connexion à l'outil de paie", TaskStatus.IN_PROGRESS, TaskPriority.HIGH, today.minusDays(1), paul);
		task(rh, jean, "Validation par les managers", TaskStatus.REVIEW, TaskPriority.MEDIUM, today.plusDays(3), marie);
		task(rh, jean, "Publication sur le Play Store", TaskStatus.TODO, TaskPriority.LOW, today.plusDays(60), jean);
		expense(rh, "Équipe de développement mobile", "1400000", ExpenseCategory.SALARY, today.minusMonths(2));
		expense(rh, "Téléphones de test", "600000", ExpenseCategory.EQUIPMENT, today.minusMonths(1));
		expense(rh, "Équipe de développement mobile", "700000", ExpenseCategory.SALARY, today.minusDays(5));

		Project intranet = project(organization, "Refonte de l'intranet",
				"Nouvel intranet pour partager les documents et les annonces internes.",
				"1200000", ProjectStatus.IN_PROGRESS, today.minusMonths(2), today.plusMonths(1), jean, aicha);
		task(intranet, jean, "Migration des documents", TaskStatus.IN_PROGRESS, TaskPriority.MEDIUM, today.plusDays(12), aicha);
		task(intranet, jean, "Annuaire des employés", TaskStatus.TODO, TaskPriority.LOW, today.plusDays(30), aicha);
		expense(intranet, "Consultant SharePoint", "1350000", ExpenseCategory.SALARY, today.minusMonths(1));

		Project marketing = project(organization, "Campagne marketing Yaoundé",
				"Lancement de la boutique en ligne : réseaux sociaux, radio et affichage.",
				"800000", ProjectStatus.TODO, today.plusDays(14), today.plusMonths(2), marie, aicha);
		task(marketing, marie, "Choix de l'agence de communication", TaskStatus.TODO, TaskPriority.HIGH, today.plusDays(8), marie);
		task(marketing, marie, "Visuels pour les réseaux sociaux", TaskStatus.TODO, TaskPriority.MEDIUM, today.plusDays(18), aicha);

		Project cloud = project(organization, "Migration vers le cloud",
				"Hébergement des serveurs de l'entreprise dans le cloud.",
				"3000000", ProjectStatus.DONE, today.minusMonths(6), today.minusMonths(1), jean, paul);
		task(cloud, jean, "Inventaire des serveurs", TaskStatus.DONE, TaskPriority.MEDIUM, today.minusMonths(5), paul);
		task(cloud, jean, "Migration des bases de données", TaskStatus.DONE, TaskPriority.HIGH, today.minusMonths(3), paul);
		task(cloud, jean, "Formation de l'équipe", TaskStatus.DONE, TaskPriority.LOW, today.minusMonths(1), jean);
		expense(cloud, "Abonnement cloud", "450000", ExpenseCategory.SOFTWARE, today.minusMonths(5));
		expense(cloud, "Prestataire de migration", "1500000", ExpenseCategory.SALARY, today.minusMonths(4));
		expense(cloud, "Serveur de sauvegarde", "550000", ExpenseCategory.EQUIPMENT, today.minusMonths(3));

		message(marie, jean, "Maquettes validées", "Bonjour Jean,\nLes maquettes de la boutique sont validées par le client. On peut lancer l'intégration.\nMarie", 3, true);
		message(paul, jean, "Point sur le paiement mobile", "Bonjour Jean,\nL'intégration d'Orange Money fonctionne en test. Il me reste MTN MoMo à finaliser cette semaine.", 1, false);
		message(aicha, jean, "Budget de l'intranet", "Bonjour,\nAttention, le budget de la refonte de l'intranet est dépassé. Peut-on en parler demain ?\nAïcha", 0, false);
		message(jean, marie, "Campagne marketing", "Marie, peux-tu me proposer deux agences de communication d'ici vendredi ?\nMerci, Jean", 2, true);

		return jean;
	}

	private User user(Organization organization, String firstName, String lastName, Role role) {
		String login = (firstName.toLowerCase().replace("ï", "i") + "." + lastName.toLowerCase()) + EMAIL_DOMAIN;
		return userRepository.save(User.builder()
				.firstName(firstName)
				.lastName(lastName)
				.email(login)
				// Mot de passe aleatoire jamais communique : on n'entre dans la demo que par le bouton dedie
				.password(passwordEncoder.encode(UUID.randomUUID().toString()))
				.role(role)
				.organization(organization)
				.build());
	}

	private Project project(Organization organization, String name, String description, String budget,
							ProjectStatus status, LocalDate start, LocalDate end, User owner, User... members) {
		return projectRepository.save(Project.builder()
				.organization(organization)
				.name(name)
				.description(description)
				.budget(new BigDecimal(budget))
				.status(status)
				.startDate(start)
				.endDate(end)
				.owner(owner)
				.members(new HashSet<>(List.of(members)))
				.build());
	}

	private void task(Project project, User author, String title, TaskStatus status, TaskPriority priority,
					  LocalDate dueDate, User assignee) {
		// Rang dans la colonne : les taches sont ajoutees les unes sous les autres
		String column = project.getName() + status;
		int position = positions.merge(column, 1, Integer::sum) - 1;
		taskRepository.save(Task.builder()
				.project(project)
				.createdBy(author)
				.title(title)
				.status(status)
				.priority(priority)
				.dueDate(dueDate)
				.assignee(assignee)
				.position(position)
				.build());
	}

	private void expense(Project project, String label, String amount, ExpenseCategory category, LocalDate date) {
		expenseRepository.save(Expense.builder()
				.project(project)
				.label(label)
				.amount(new BigDecimal(amount))
				.category(category)
				.date(date)
				.build());
	}

	private void message(User sender, User recipient, String subject, String content, int daysAgo, boolean read) {
		messageRepository.save(Message.builder()
				.sender(sender)
				.recipient(recipient)
				.subject(subject)
				.content(content)
				.sentAt(LocalDateTime.now().minusDays(daysAgo).minusHours(daysAgo + 2L))
				.read(read)
				.build());
	}
}
