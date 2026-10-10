package com.devmanager.organization;

import com.devmanager.organization.OrganizationDtos.OrganizationResponse;
import com.devmanager.organization.OrganizationDtos.SubscribeRequest;
import com.devmanager.organization.OrganizationDtos.UpdateOrganizationRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

// Entreprise et abonnement : reserve aux administrateurs
@RestController
@RequestMapping("/api/organization")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class OrganizationController {

	private final OrganizationService organizationService;

	@GetMapping
	public OrganizationResponse get() {
		return organizationService.getCurrent();
	}

	@PutMapping
	public OrganizationResponse rename(@Valid @RequestBody UpdateOrganizationRequest request) {
		return organizationService.rename(request);
	}

	@PutMapping("/logo")
	public OrganizationResponse updateLogo(@Valid @RequestBody OrganizationDtos.LogoRequest request) {
		return organizationService.updateLogo(request.dataUrl());
	}

	@DeleteMapping("/logo")
	public OrganizationResponse removeLogo() {
		return organizationService.removeLogo();
	}

	@PostMapping("/subscription")
	public OrganizationResponse subscribe(@Valid @RequestBody SubscribeRequest request) {
		return organizationService.subscribe(request);
	}

	@DeleteMapping("/subscription")
	public OrganizationResponse cancel() {
		return organizationService.cancel();
	}
}
