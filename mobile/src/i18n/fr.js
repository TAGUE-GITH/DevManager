// Textes de l'application mobile en francais (langue par defaut)
export default {
  common: {
    or: 'ou',
    language: 'Langue',
    loading: 'Chargement',
  },
  errors: {
    generic: 'Une erreur est survenue. Veuillez réessayer.',
    network: 'Impossible de contacter le serveur. Vérifiez votre connexion.',
  },
  fields: {
    email: 'Email',
    emailPlaceholder: 'vous@entreprise.com',
    firstName: 'Prénom',
    lastName: 'Nom',
    password: 'Mot de passe',
    passwordPlaceholder: '8 caractères minimum',
    confirmPassword: 'Confirmer le mot de passe',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    companyName: 'Nom de l’entreprise',
    companyPlaceholder: 'Ex. Kamga Services SARL',
  },
  auth: {
    tagline: 'Projets, budgets et équipe, au même endroit',
    wakeUp: 'Le premier chargement peut prendre jusqu’à une minute (réveil du serveur).',
    login: {
      title: 'Connexion',
      subtitle: 'Heureux de vous revoir ! Connectez-vous à votre espace.',
      forgot: 'Mot de passe oublié ?',
      submit: 'Se connecter',
      noAccount: 'Pas encore de compte ?',
      createAccount: 'Créer un compte',
    },
    register: {
      title: 'Créer votre espace',
      subtitle: 'Vous en serez l’administrateur et pourrez inviter votre équipe.',
      submit: 'Créer mon espace',
      hasAccount: 'Déjà inscrit ?',
    },
    forgot: {
      title: 'Mot de passe oublié',
      subtitle: 'Saisissez votre email : nous vous enverrons un lien pour choisir un nouveau mot de passe.',
      submit: 'Envoyer le lien',
      back: 'Retour à la connexion',
    },
  },
  demo: {
    try: 'Essayer la démo, sans compte',
    preparing: 'Préparation de la démo…',
  },
  home: {
    greeting: 'Bonjour {{name}} 👋',
    soon: 'Le tableau de bord, les projets, les tâches et la messagerie arrivent à l’étape suivante.',
    logout: 'Se déconnecter',
  },
  enums: {
    role: { ADMIN: 'Administrateur', MANAGER: 'Manager', EMPLOYEE: 'Employé' },
  },
}
