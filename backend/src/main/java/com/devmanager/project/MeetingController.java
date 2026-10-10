package com.devmanager.project;

import lombok.RequiredArgsConstructor;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.UUID;

/**
 * Reunion video d'un projet, via Jitsi Meet (visioconference open source : video, partage d'ecran, groupe).
 * Le nom de la salle est aleatoire et n'est communique qu'aux personnes qui ont acces au projet.
 */
@RestController
@RequiredArgsConstructor
public class MeetingController {

	static final String JITSI_DOMAIN = "meet.jit.si";

	private final ProjectService projectService;

	public record MeetingResponse(String domain, String roomName, String url, String projectName) {
	}

	@GetMapping("/api/projects/{id}/meeting")
	@Transactional
	public MeetingResponse get(@PathVariable Long id) {
		Project project = projectService.getVisibleProject(id);
		if (project.getMeetingRoom() == null) {
			project.setMeetingRoom("DevManager" + UUID.randomUUID().toString().replace("-", ""));
		}
		String room = project.getMeetingRoom();
		return new MeetingResponse(JITSI_DOMAIN, room, "https://" + JITSI_DOMAIN + "/" + room, project.getName());
	}
}
