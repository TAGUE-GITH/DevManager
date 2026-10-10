// Contenu du centre d'aide : un article par sujet, regroupes par categorie
export const HELP_CATEGORIES = [
  {
    id: 'demarrer',
    title: 'Premiers pas',
    articles: [
      {
        id: 'creer-espace',
        question: 'Comment créer l’espace de mon entreprise ?',
        answer: [
          'Cliquez sur « Commencer » depuis la page d’accueil, puis indiquez le nom de votre entreprise, votre nom, votre email et un mot de passe.',
          'Vous devenez automatiquement l’administrateur de cet espace. Les données de votre entreprise sont isolées : aucune autre entreprise ne peut les voir.',
        ],
      },
      {
        id: 'demo',
        question: 'Puis-je essayer sans créer de compte ?',
        answer: [
          'Oui : le bouton « Essayer la démo » de la page d’accueil ouvre une entreprise fictive déjà remplie (projets, tâches, dépenses, messages).',
          'Les données de démonstration sont partagées entre les visiteurs et réinitialisées régulièrement. Les invitations y sont désactivées.',
        ],
      },
      {
        id: 'inviter',
        question: 'Comment inviter mon équipe ?',
        answer: [
          'Dans le menu Équipe (administrateurs), saisissez l’email de votre collègue et choisissez son rôle, puis cliquez sur « Inviter ».',
          'Il reçoit un email avec un lien valable 7 jours. Si l’email n’arrive pas, utilisez « Copier le lien » pour le lui envoyer autrement (WhatsApp, SMS…).',
        ],
      },
    ],
  },
  {
    id: 'projets',
    title: 'Projets et tâches',
    articles: [
      {
        id: 'creer-projet',
        question: 'Comment créer un projet ?',
        answer: [
          'Dans Projets, cliquez sur « Nouveau projet ». Indiquez son nom, son budget en FCFA, ses dates et les membres de l’équipe.',
          'Seuls les administrateurs et les managers peuvent créer des projets. Le créateur en devient le responsable.',
        ],
      },
      {
        id: 'kanban',
        question: 'Comment utiliser le tableau Kanban ?',
        answer: [
          'Dans un projet, l’onglet Tâches présente quatre colonnes : À faire, En cours, En revue et Terminé.',
          'Glissez une carte d’une colonne à l’autre pour changer son statut, ou dans la même colonne pour changer son ordre. Sur téléphone, maintenez la carte une fraction de seconde avant de la déplacer.',
          'Au clavier : placez-vous sur une carte avec Tab, appuyez sur Espace pour la saisir, déplacez-la avec les flèches, puis Espace pour la déposer.',
        ],
      },
      {
        id: 'reunion',
        question: 'Comment lancer une réunion vidéo avec mon équipe ?',
        answer: [
          'Dans un projet, cliquez sur « Réunion ». La salle de réunion du projet s’ouvre dans l’application : vidéo, micro, discussion et partage d’écran, avec plusieurs participants.',
          'Chaque projet a sa propre salle, réservée aux personnes qui y ont accès. Utilisez « Copier le lien » pour y inviter quelqu’un, ou « Ouvrir dans un onglet » si votre navigateur bloque la vidéo.',
          'La visioconférence est fournie par Jitsi Meet : la première personne à ouvrir la salle peut devoir se connecter (Google, GitHub ou Facebook) pour la démarrer.',
        ],
      },
      {
        id: 'mes-taches',
        question: 'Où voir les tâches qui me sont confiées ?',
        answer: [
          'La page « Mes tâches » regroupe toutes les tâches qui vous sont assignées, tous projets confondus, avec celles en retard en évidence.',
          'Vous pouvez y changer le statut d’une tâche sans ouvrir le projet.',
        ],
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget et tableau de bord',
    articles: [
      {
        id: 'depenses',
        question: 'Comment suivre le budget d’un projet ?',
        answer: [
          'Dans un projet, l’onglet « Budget et équipe » affiche le budget alloué, le montant dépensé, le reste et le pourcentage consommé.',
          'Ajoutez chaque dépense avec son montant, sa catégorie et sa date. En cas de dépassement, la jauge passe au rouge avec une alerte.',
        ],
      },
      {
        id: 'graphiques',
        question: 'Comment lire les graphiques du tableau de bord ?',
        answer: [
          'Survolez une barre pour voir sa valeur exacte. Le bouton « Tableau » en haut de chaque graphique affiche les mêmes données sous forme de tableau.',
          'Les statistiques ne portent que sur les projets que vous avez le droit de voir.',
        ],
      },
    ],
  },
  {
    id: 'compte',
    title: 'Compte, rôles et offres',
    articles: [
      {
        id: 'roles',
        question: 'Quelle est la différence entre les rôles ?',
        answer: [
          'Administrateur : gère l’équipe, l’entreprise et l’abonnement, et a accès à tous les projets.',
          'Manager : voit tous les projets, en crée et gère ceux dont il est responsable.',
          'Employé : voit les projets dont il est membre et travaille sur leurs tâches.',
        ],
      },
      {
        id: 'offres',
        question: 'Quelles sont les limites de l’offre Gratuite ?',
        answer: [
          'L’offre Gratuite permet 3 projets et 5 membres (invitations en attente comprises). L’offre Pro, à 15 000 FCFA par mois, est illimitée.',
          'Ce projet de démonstration simule le paiement : aucun montant n’est prélevé et aucune coordonnée bancaire n’est demandée.',
        ],
      },
      {
        id: 'mot-de-passe',
        question: 'J’ai oublié mon mot de passe, que faire ?',
        answer: [
          'Sur la page de connexion, cliquez sur « Mot de passe oublié ? » et saisissez votre email. Vous recevrez un lien valable 30 minutes, utilisable une seule fois.',
          'Pensez à vérifier vos courriers indésirables.',
        ],
      },
      {
        id: 'profil',
        question: 'Comment ajouter ma photo ou le logo de mon entreprise ?',
        answer: [
          'Cliquez sur votre nom en bas du menu pour ouvrir « Mon profil ». Vous pouvez y changer votre photo, votre nom, votre poste et votre mot de passe.',
          'Les administrateurs ajoutent le logo de l’entreprise depuis le menu Entreprise. Les images sont recadrées automatiquement en carré.',
        ],
      },
      {
        id: 'theme',
        question: 'Comment activer le mode sombre ?',
        answer: [
          'En bas du menu de l’application, choisissez le thème clair, sombre ou celui de votre système (icônes soleil, lune et écran).',
        ],
      },
    ],
  },
]
