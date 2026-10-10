package com.devmanager.organization;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

import java.math.BigDecimal;

// Offres d'abonnement et leurs limites (null = illimite)
@Getter
@RequiredArgsConstructor
public enum Plan {
	FREE(3, 5, BigDecimal.ZERO),
	PRO(null, null, new BigDecimal("15000"));

	private final Integer maxProjects;
	private final Integer maxMembers;
	// Prix mensuel en francs CFA
	private final BigDecimal monthlyPrice;

	public boolean allowsProjects(long count) {
		return maxProjects == null || count < maxProjects;
	}

	public boolean allowsMembers(long count) {
		return maxMembers == null || count < maxMembers;
	}
}
