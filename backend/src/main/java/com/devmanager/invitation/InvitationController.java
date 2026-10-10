package com.devmanager.invitation;

import com.devmanager.invitation.InvitationDtos.InvitationInfoResponse;
import com.devmanager.invitation.InvitationDtos.InvitationRequest;
import com.devmanager.invitation.InvitationDtos.InvitationResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class InvitationController {

	private final InvitationService invitationService;

	@PostMapping("/invitations")
	@ResponseStatus(HttpStatus.CREATED)
	@PreAuthorize("hasRole('ADMIN')")
	public InvitationResponse invite(@Valid @RequestBody InvitationRequest request) {
		return invitationService.invite(request);
	}

	@GetMapping("/invitations")
	@PreAuthorize("hasRole('ADMIN')")
	public List<InvitationResponse> findPending() {
		return invitationService.findPending();
	}

	@DeleteMapping("/invitations/{id}")
	@ResponseStatus(HttpStatus.NO_CONTENT)
	@PreAuthorize("hasRole('ADMIN')")
	public void revoke(@PathVariable Long id) {
		invitationService.revoke(id);
	}

	// Public : consulte par la personne invitee avant de creer son compte
	@GetMapping("/auth/invitations/{token}")
	public InvitationInfoResponse getInfo(@PathVariable String token) {
		return invitationService.getInfo(token);
	}
}
