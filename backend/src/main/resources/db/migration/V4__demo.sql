-- Entreprise de demonstration (bouton "Essayer la demo") : reinitialisee automatiquement
ALTER TABLE organizations ADD COLUMN demo BOOLEAN DEFAULT FALSE NOT NULL;
