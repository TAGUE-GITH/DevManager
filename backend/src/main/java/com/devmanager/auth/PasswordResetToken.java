package com.devmanager.auth;

import com.devmanager.user.User;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Jeton a usage unique envoye par email pour reinitialiser un mot de passe
@Entity
@Table(name = "password_reset_tokens")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PasswordResetToken {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String token;

	@ManyToOne(fetch = FetchType.LAZY, optional = false)
	@JoinColumn(name = "user_id")
	private User user;

	@Column(nullable = false)
	private LocalDateTime expiresAt;

	@Builder.Default
	private boolean used = false;

	public boolean isExpired() {
		return LocalDateTime.now().isAfter(expiresAt);
	}
}
