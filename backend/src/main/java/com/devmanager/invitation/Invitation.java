package com.devmanager.invitation;

import com.devmanager.organization.Organization;
import com.devmanager.user.Role;
import com.devmanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Invitation a rejoindre une entreprise : un lien unique est envoye par email
@Entity
@Table(name = "invitations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Invitation {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String token;

	@Column(nullable = false)
	private String email;

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	private Role role;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "organization_id")
	private Organization organization;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "invited_by_id")
	private User invitedBy;

	@Column(nullable = false)
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	@Column(nullable = false)
	private LocalDateTime expiresAt;

	@Builder.Default
	private boolean accepted = false;

	public boolean isExpired() {
		return LocalDateTime.now().isAfter(expiresAt);
	}

	public boolean isPending() {
		return !accepted && !isExpired();
	}
}
