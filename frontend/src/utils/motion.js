// Respecte le reglage systeme "reduire les animations" (accessibilite)
export const prefersReducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false
