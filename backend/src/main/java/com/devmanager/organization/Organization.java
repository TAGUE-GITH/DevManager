package com.devmanager.organization;

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
}
