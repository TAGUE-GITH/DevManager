package com.devmanager.organization;

import com.devmanager.image.Image;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

// Une entreprise cliente : ses utilisateurs, projets et messages sont isoles de ceux des autres entreprises
@Entity
@Table(name = "organizations")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Organization {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, length = 150)
	private String name;

	@Column(nullable = false)
	@Builder.Default
	private LocalDateTime createdAt = LocalDateTime.now();

	@Enumerated(EnumType.STRING)
	@Column(nullable = false)
	@Builder.Default
	private Plan plan = Plan.FREE;

	// Fin de la periode payee en cours (offre Pro)
	private LocalDateTime currentPeriodEnd;

	// Entreprise de demonstration : donnees fictives, reinitialisees regulierement
	@Builder.Default
	private boolean demo = false;

	// Logo de l'entreprise (facultatif)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "logo_id")
	private Image logo;
}
