package com.devmanager.dashboard;

import com.devmanager.budget.Expense;
import com.devmanager.budget.ExpenseCategory;
import com.devmanager.budget.ExpenseRepository;
import com.devmanager.message.MessageService;
import com.devmanager.project.ProjectDtos.ProjectResponse;
import com.devmanager.project.ProjectService;
import com.devmanager.project.ProjectStatus;
import com.devmanager.task.Task;
import com.devmanager.task.TaskRepository;
import com.devmanager.task.TaskStatus;
import com.devmanager.user.CurrentUser;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.util.*;
import java.util.function.Function;
import java.util.stream.Stream;

// Statistiques de la page d'accueil, calculees uniquement sur les projets visibles par l'utilisateur
@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class DashboardService {

	// Nombre de mois affiches dans l'evolution des depenses (mois en cours inclus)
	static final int MONTHS = 6;

	private final ProjectService projectService;
	private final ExpenseRepository expenseRepository;
	private final TaskRepository taskRepository;
	private final MessageService messageService;
	private final CurrentUser currentUser;

	public record MonthlyAmount(String month, BigDecimal amount) {
	}

	public record DashboardResponse(
			int totalProjects,
			Map<ProjectStatus, Long> projectsByStatus,
			BigDecimal totalBudget,
			BigDecimal totalSpent,
			Map<ExpenseCategory, BigDecimal> expensesByCategory,
			List<MonthlyAmount> monthlyExpenses,
			Map<TaskStatus, Long> tasksByStatus,
			long overdueTasks,
			long myOpenTasks,
			long unreadMessages) {
	}

	public DashboardResponse get() {
		List<ProjectResponse> projects = projectService.findVisible();
		List<Long> projectIds = projects.stream().map(ProjectResponse::id).toList();
		List<Expense> expenses = projectIds.isEmpty() ? List.of() : expenseRepository.findByProjectIdIn(projectIds);
		List<Task> tasks = projectIds.isEmpty() ? List.of() : taskRepository.findByProjectIdIn(projectIds);
		Long userId = currentUser.get().getId();

		return new DashboardResponse(
				projects.size(),
				countBy(ProjectStatus.class, projects, ProjectResponse::status),
				sum(projects.stream().map(ProjectResponse::budget)),
				sum(projects.stream().map(ProjectResponse::spent)),
				expensesByCategory(expenses),
				monthlyExpenses(expenses),
				countBy(TaskStatus.class, tasks, Task::getStatus),
				tasks.stream().filter(Task::isOverdue).count(),
				tasks.stream()
						.filter(task -> task.getStatus() != TaskStatus.DONE)
						.filter(task -> task.getAssignee() != null && task.getAssignee().getId().equals(userId))
						.count(),
				messageService.unreadCount());
	}

	private Map<ExpenseCategory, BigDecimal> expensesByCategory(List<Expense> expenses) {
		Map<ExpenseCategory, BigDecimal> totals = new EnumMap<>(ExpenseCategory.class);
		for (ExpenseCategory category : ExpenseCategory.values()) {
			totals.put(category, BigDecimal.ZERO);
		}
		expenses.forEach(expense -> totals.merge(expense.getCategory(), expense.getAmount(), BigDecimal::add));
		return totals;
	}

	// Total par mois sur les MONTHS derniers mois ; les mois sans depense valent 0
	private List<MonthlyAmount> monthlyExpenses(List<Expense> expenses) {
		YearMonth current = YearMonth.from(LocalDate.now());
		Map<YearMonth, BigDecimal> totals = new LinkedHashMap<>();
		for (int i = MONTHS - 1; i >= 0; i--) {
			totals.put(current.minusMonths(i), BigDecimal.ZERO);
		}
		for (Expense expense : expenses) {
			YearMonth month = YearMonth.from(expense.getDate());
			totals.computeIfPresent(month, (key, total) -> total.add(expense.getAmount()));
		}
		return totals.entrySet().stream()
				.map(entry -> new MonthlyAmount(entry.getKey().toString(), entry.getValue()))
				.toList();
	}

	// Compte les elements par valeur d'enumeration, toutes les valeurs etant presentes (0 par defaut)
	private <E extends Enum<E>, T> Map<E, Long> countBy(Class<E> type, Collection<T> items, Function<T, E> key) {
		Map<E, Long> counts = new EnumMap<>(type);
		for (E value : type.getEnumConstants()) {
			counts.put(value, 0L);
		}
		items.forEach(item -> counts.merge(key.apply(item), 1L, Long::sum));
		return counts;
	}

	private BigDecimal sum(Stream<BigDecimal> amounts) {
		return amounts.reduce(BigDecimal.ZERO, BigDecimal::add);
	}
}
