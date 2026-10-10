// Contenu du centre d'aide, en francais et en anglais : un article par sujet, regroupes par categorie
const FR = [
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
      {
        id: 'langue',
        question: 'Comment changer la langue de l’application ?',
        answer: [
          'Utilisez les boutons FR et EN en bas du menu, sur les pages de connexion ou dans « Mon profil ». Votre choix est mémorisé sur cet appareil.',
          'Les dates, les montants, les messages d’erreur et la réunion vidéo s’affichent aussi dans la langue choisie.',
        ],
      },
    ],
  },
]

const EN = [
  {
    id: 'demarrer',
    title: 'Getting started',
    articles: [
      {
        id: 'creer-espace',
        question: 'How do I create my company’s workspace?',
        answer: [
          'Click “Get started” on the home page, then enter your company name, your name, your email and a password.',
          'You automatically become the administrator of this workspace. Your company’s data is isolated: no other company can see it.',
        ],
      },
      {
        id: 'demo',
        question: 'Can I try it without creating an account?',
        answer: [
          'Yes: the “Try the demo” button on the home page opens a fictitious company already filled with data (projects, tasks, expenses, messages).',
          'Demo data is shared between visitors and reset regularly. Invitations are disabled there.',
        ],
      },
      {
        id: 'inviter',
        question: 'How do I invite my team?',
        answer: [
          'In the Team menu (administrators), enter your colleague’s email, choose their role, then click “Invite”.',
          'They receive an email with a link valid for 7 days. If the email does not arrive, use “Copy link” to send it another way (WhatsApp, SMS…).',
        ],
      },
    ],
  },
  {
    id: 'projets',
    title: 'Projects and tasks',
    articles: [
      {
        id: 'creer-projet',
        question: 'How do I create a project?',
        answer: [
          'In Projects, click “New project”. Enter its name, its budget in XAF, its dates and the team members.',
          'Only administrators and managers can create projects. The creator becomes the project owner.',
        ],
      },
      {
        id: 'kanban',
        question: 'How do I use the Kanban board?',
        answer: [
          'In a project, the Tasks tab shows four columns: To do, In progress, In review and Done.',
          'Drag a card to another column to change its status, or within the same column to change its order. On a phone, hold the card for a split second before moving it.',
          'With the keyboard: reach a card with Tab, press Space to pick it up, move it with the arrow keys, then press Space to drop it.',
        ],
      },
      {
        id: 'reunion',
        question: 'How do I start a video meeting with my team?',
        answer: [
          'In a project, click “Meeting”. The project’s meeting room opens inside the app: video, microphone, chat and screen sharing, with several participants.',
          'Each project has its own room, reserved for people who have access to it. Use “Copy link” to invite someone, or “Open in a tab” if your browser blocks the video.',
          'Video conferencing is provided by Jitsi Meet: the first person to open the room may need to sign in (Google, GitHub or Facebook) to start it.',
        ],
      },
      {
        id: 'mes-taches',
        question: 'Where can I see the tasks assigned to me?',
        answer: [
          'The “My tasks” page gathers all the tasks assigned to you, across all projects, with overdue ones highlighted.',
          'You can change a task’s status there without opening the project.',
        ],
      },
    ],
  },
  {
    id: 'budget',
    title: 'Budget and dashboard',
    articles: [
      {
        id: 'depenses',
        question: 'How do I track a project’s budget?',
        answer: [
          'In a project, the “Budget and team” tab shows the allocated budget, the amount spent, what remains and the percentage used.',
          'Add each expense with its amount, category and date. If the budget is exceeded, the gauge turns red with an alert.',
        ],
      },
      {
        id: 'graphiques',
        question: 'How do I read the dashboard charts?',
        answer: [
          'Hover over a bar to see its exact value. The “Table” button at the top of each chart shows the same data as a table.',
          'Statistics only cover the projects you are allowed to see.',
        ],
      },
    ],
  },
  {
    id: 'compte',
    title: 'Account, roles and plans',
    articles: [
      {
        id: 'roles',
        question: 'What is the difference between the roles?',
        answer: [
          'Administrator: manages the team, the company and the subscription, and has access to all projects.',
          'Manager: sees all projects, creates projects and manages the ones they own.',
          'Employee: sees the projects they are a member of and works on their tasks.',
        ],
      },
      {
        id: 'offres',
        question: 'What are the limits of the Free plan?',
        answer: [
          'The Free plan allows 3 projects and 5 members (pending invitations included). The Pro plan, at 15,000 XAF per month, is unlimited.',
          'This demo project simulates payment: no money is charged and no bank details are requested.',
        ],
      },
      {
        id: 'mot-de-passe',
        question: 'I forgot my password, what should I do?',
        answer: [
          'On the login page, click “Forgot your password?” and enter your email. You will receive a link valid for 30 minutes that can be used only once.',
          'Remember to check your spam folder.',
        ],
      },
      {
        id: 'profil',
        question: 'How do I add my photo or my company’s logo?',
        answer: [
          'Click your name at the bottom of the menu to open “My profile”. There you can change your photo, name, job title and password.',
          'Administrators add the company logo from the Company menu. Images are automatically cropped to a square.',
        ],
      },
      {
        id: 'theme',
        question: 'How do I turn on dark mode?',
        answer: [
          'At the bottom of the app menu, choose the light theme, the dark theme or your system’s theme (sun, moon and screen icons).',
        ],
      },
      {
        id: 'langue',
        question: 'How do I change the app’s language?',
        answer: [
          'Use the FR and EN buttons at the bottom of the menu, on the login pages or in “My profile”. Your choice is remembered on this device.',
          'Dates, amounts, error messages and the video meeting also follow the chosen language.',
        ],
      },
    ],
  },
]

// Articles dans la langue de l'interface (francais par defaut)
export const helpCategories = (language) => (language === 'en' ? EN : FR)
