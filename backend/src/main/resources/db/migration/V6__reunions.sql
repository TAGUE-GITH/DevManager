-- Salle de reunion video (Jitsi Meet) de chaque projet : nom aleatoire, cree a la premiere reunion
ALTER TABLE projects ADD COLUMN meeting_room VARCHAR(64);
