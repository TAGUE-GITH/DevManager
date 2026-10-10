-- Images envoyees par les utilisateurs (photos de profil, logos d'entreprise).
-- Elles sont stockees en base, car le disque des hebergeurs gratuits est efface a chaque redeploiement.
-- L'identifiant est aleatoire : l'adresse de l'image ne peut pas etre devinee.
CREATE TABLE images (
    id           VARCHAR(36)     PRIMARY KEY,
    content_type VARCHAR(30)     NOT NULL,
    data         VARCHAR(300000) NOT NULL,
    created_at   TIMESTAMP       NOT NULL
);

ALTER TABLE users ADD COLUMN job_title VARCHAR(100);
ALTER TABLE users ADD COLUMN avatar_id VARCHAR(36) REFERENCES images (id);
ALTER TABLE organizations ADD COLUMN logo_id VARCHAR(36) REFERENCES images (id);
