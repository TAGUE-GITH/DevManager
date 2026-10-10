package com.devmanager.project;

import com.devmanager.organization.Organization;
import com.devmanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity
@Table(name = "projects")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Project {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String name;

	@Column(length = 2000)
	private String description;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private ProjectStatus status = ProjectStatus.TODO;

	// Budget alloue au projet
	@Column(nullable = false, precision = 15, scale = 2)
	@Builder.Default
	private BigDecimal budget = BigDecimal.ZERO;

	private LocalDate startDate;

	private LocalDate endDate;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "owner_id")
	private User owner;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "organization_id")
	private Organization organization;

	// Nom de la salle de reunion video (aleatoire, donc impossible a deviner)
	@Column(length = 64)
	private String meetingRoom;

	@ManyToMany
	@JoinTable(
			name = "project_members",
			joinColumns = @JoinColumn(name = "project_id"),
			inverseJoinColumns = @JoinColumn(name = "user_id"))
	@Builder.Default
	private Set<User> members = new HashSet<>();
}
