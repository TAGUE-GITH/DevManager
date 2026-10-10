package com.devmanager.image;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Image envoyee par un utilisateur, stockee en base64 (photo de profil, logo d'entreprise)
@Entity
@Table(name = "images")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Image {

	// Identifiant aleatoire (UUID) : sert aussi d'adresse publique, impossible a deviner
	@Id
	@Column(length = 36)
	private String id;

	@Column(nullable = false, length = 30)
	private String contentType;

	// Contenu en base64 (sans le prefixe "data:...;base64,")
	@Column(nullable = false, length = 300000)
	private String data;

	@Column(nullable = false)
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();
}
