package com.devmanager.user;

import com.devmanager.image.Image;
import com.devmanager.organization.Organization;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false)
	private String firstName;

	@Column(nullable = false)
	private String lastName;

	@Column(nullable = false, unique = true)
	private String email;

	@Column(nullable = false)
	private String password;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	@ManyToOne(optional = false)
	@JoinColumn(name = "organization_id")
	private Organization organization;

	// Poste occupe, ex. "Chef de projet" (facultatif)
	@Column(length = 100)
	private String jobTitle;

	// Photo de profil (facultative)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "avatar_id")
	private Image avatar;
}
