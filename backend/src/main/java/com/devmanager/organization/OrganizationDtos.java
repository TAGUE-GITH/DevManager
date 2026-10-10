package com.devmanager.organization;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public final class OrganizationDtos {

	private OrganizationDtos() {
	}

	public record UpdateOrganizationRequest(
			@NotBlank(message = "Le nom de l'entreprise est obligatoire")
			@Size(max = 150, message = "150 caractères maximum") String name) {
	}

	public record SubscribeRequest(@NotNull(message = "Le moyen de paiement est obligatoire") PaymentMethod method) {
	}

	// Limites de l'offre (null = illimite) et utilisation actuelle
	public record Usage(long projects, Integer maxProjects, long members, Integer maxMembers) {
	}

	public record PaymentResponse(Long id, BigDecimal amount, String currency, PaymentMethod method, String reference,
								  LocalDateTime periodEnd, LocalDateTime createdAt) {

		public static PaymentResponse from(Payment payment) {
			return new PaymentResponse(payment.getId(), payment.getAmount(), payment.getCurrency(), payment.getMethod(),
					payment.getReference(), payment.getPeriodEnd(), payment.getCreatedAt());
		}
	}

	public record OrganizationResponse(Long id, String name, Plan plan, BigDecimal proMonthlyPrice,
									   LocalDateTime currentPeriodEnd, Usage usage, List<PaymentResponse> payments) {
	}
}
