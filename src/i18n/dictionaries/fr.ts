import type { Dictionary } from "./en";

export const fr: Dictionary = {
  meta: {
    daily: "Mot du jour",
    dailyDescription:
      "Le mot du jour d'Endless Lingle : un mot de cinq lettres par jour, le même pour tous, en six essais. Un Wordle quotidien gratuit en cinq langues.",
    description:
      "Un jeu de mots façon Wordle qui ne s'arrête jamais. Les essais non utilisés passent au mot suivant, et la partie ne se termine que lorsque vous n'en avez plus.",
    homeTitle:
      "Endless Lingle : jeu de mots illimité façon Wordle, aussi en français",
    playDescription:
      "Jouez gratuitement à Endless Lingle dans votre navigateur : devinez des mots de cinq lettres à la suite, et reportez vos essais restants sur le mot suivant. Aucun compte nécessaire.",
    howToPlayDescription:
      "Découvrez comment jouer à Endless Lingle : la signification des couleurs, le report des essais restants et la durée possible de votre série.",
    imageAlt: "Une grille Endless Lingle sombre, avec le logo et le slogan.",
    pageTitle: "{page} | Endless Lingle",
    play: "Jouer",
    howToPlay: "Comment jouer",
    login: "Connexion",
    profile: "Profil",
    chooseUsername: "Choisir un nom d'utilisateur",
    resetPassword: "Définir un nouveau mot de passe",
    privacy: "Confidentialité",
    terms: "Conditions",
    faq: "Questions fréquentes",
    tips: "Astuces",
    faqDescription:
      "Réponses aux questions fréquentes sur Endless Lingle : essais bonus, couleurs, langues, sauvegarde de la partie et partage des résultats.",
    tipsDescription:
      "Astuces pour des séries plus longues sur Endless Lingle : bons mots de départ, essais bonus, terminaisons courantes et plus encore.",
    settings: "Paramètres",
  },

  languages: {
    en: "anglais",
    nl: "néerlandais",
    de: "allemand",
    fr: "français",
    es: "espagnol",
  },

  header: {
    home: "Endless Lingle, retour à l'accueil",
    language: "Langue : {language}. Changer de langue",
    login: "Connexion",
    account: "Compte",
    accountMenu: "Menu du compte de {name}",
    chooseUsername: "Choisir un nom d'utilisateur",
    profile: "Profil",
    logout: "Déconnexion",
    darkMode: "Mode sombre",
    highContrast: "Contraste élevé, adapté au daltonisme",
    highContrastTitle: "Contraste élevé / mode daltonien",
    settings: "Paramètres",
    back: "Retour",
  },

  footer: {
    legal: "Mentions légales",
    privacy: "Confidentialité",
    terms: "Conditions",
    cookieSettings: "Paramètres des cookies",
    faq: "FAQ",
    tips: "Astuces",
    settings: "Paramètres",
  },

  home: {
    daily: "Mot du jour",
    tagline:
      "Comme Wordle, mais sans fin. Les essais non utilisés passent au mot suivant, et la partie ne se termine que lorsque vous n'en avez plus.",
    play: "Jouer",
    howToPlay: "Comment jouer",
  },

  stats: {
    word: "Mot",
    streak: "Série",
    guessesLeft: "Essais restants",
    bonus: "Bonus",
    bonusDescription: "Essais bonus en réserve, {max} au maximum",
    guessesLeftWithBonus: "Encore {total} essais, dont {bonus} en bonus",
  },

  game: {
    loadError: "Impossible de charger la partie.",
    tryAgain: "Réessayer",
    notEnoughLetters: "Pas assez de lettres",
    notInWordList: "Pas dans la liste de mots",
    expired: "Votre partie a expiré, en voici une nouvelle",
    slowDown: "Doucement, puis réessayez",
    somethingWrong: "Un problème est survenu. Réessayez.",
    solved: "Trouvé !",
    solvedWithBonus: {
      one: "Trouvé ! +{count} essai bonus",
      other: "Trouvé ! +{count} essais bonus",
    },
    enter: "Entrée",
    enterLabel: "Entrée, valider l'essai",
    backspaceLabel: "Retour arrière, effacer une lettre",
    keyboardLabel: "Clavier",
    boardLabel: "Plateau de jeu",
    word: "Mot {number}",
    wordSolvedLabel: "Mot {number}, trouvé",
    wordRowsLabel: "Mot {number}, {rows} lignes",
    rowLabel: "Ligne {number}",
    bonusRowLabel: "Ligne {number}, essai bonus",
    tileLabel: "Ligne {row}, lettre {position} : {letter}",
    emptyTile: "vide",
    feedback: {
      correct: "bien placée",
      present: "mal placée",
      absent: "absente",
    },
    announceSolved:
      "{letters}. Trouvé. Le mot {number} commence avec {guesses} essais.",
    announceLost: "{letters}. Plus aucun essai.",
    announceLeft: {
      one: "{letters}. Encore {count} essai.",
      other: "{letters}. Encore {count} essais.",
    },
    mismatchTitle: "Vous avez une partie en {language} en cours",
    mismatchBody:
      "Commencer une partie en {newLanguage} y mettra fin, ainsi qu'à votre série.",
    mismatchContinue: "Continuer en {language}",
    mismatchStartNew: "Commencer une partie en {language}",
  },

  gameOver: {
    wordWas: "Le mot était",
    youSolved: "Vous avez trouvé {words}",
    words: { one: "{count} mot", other: "{count} mots" },
    loginToSave: "Connectez-vous pour enregistrer votre score",
    onNextGame: "lors de votre prochaine partie.",
    scoreSaved: "Score enregistré.",
    scoreNotSaved: "Votre score n'a pas pu être enregistré.",
    playAgain: "Rejouer",
  },

  daily: {
    heading: "Mot du jour #{number}",
    solved: "Trouvé en {guesses}/6",
    comeBack: "Revenez demain !",
    playEndless: "Jouer en mode infini",
    announceSolved: "{letters}. Vous avez trouvé le mot du jour.",
  },

  share: {
    button: "Partager",
    copied: "Copié dans le presse-papiers",
    failed: "Le partage n'a pas fonctionné. Réessayez.",
    resultTitle: "Résultat Endless Lingle",
    resultChallenge: "Pouvez-vous faire mieux ?",
    resultHeading: "{words} d'affilée",
    resultImage: "Un résultat Endless Lingle : {words}",
    resultInvalid:
      "Ce lien de résultat ne fonctionne pas. Lancez plutôt votre propre partie.",
  },

  howTo: {
    title: "Comment jouer",
    intro:
      "Ça se joue comme Wordle, sauf que la partie ne s'arrête pas après un mot. Combien de mots trouverez-vous d'affilée ?",
    step1Title: "Devinez un mot de cinq lettres",
    step1Body:
      "Tapez un vrai mot de cinq lettres et appuyez sur Entrée. Chaque mot commence avec {guesses} essais.",
    step1Image:
      "Le mot {word} saisi sur la première ligne, avec des lignes vides en dessous.",
    step2Title: "Lisez les couleurs",
    step2Body:
      "Après chaque essai, les cases indiquent à quel point vous êtes proche.",
    step2Image: "{word} évalué : cases vertes, jaunes et grises.",
    green: "Vert :",
    orange: "Orange :",
    yellow: "Jaune :",
    blue: "Bleu :",
    grey: "Gris :",
    greenMeaning: "la bonne lettre au bon endroit.",
    yellowMeaning: "dans le mot, mais à un autre endroit.",
    greyMeaning: "absente du mot.",
    step3Title: "Trouvez le mot",
    step3Body:
      "Servez-vous des indices pour affiner. Rendez toutes les cases vertes pour trouver le mot.",
    step3Image: "Trois essais, le dernier tout vert : {words}.",
    step4Title: "Les essais restants sont reportés",
    step4Body:
      "Chaque essai dont vous n'avez pas eu besoin passe au mot suivant comme essai bonus, jusqu'à {max}. Trouver en 3 essais sur {base} en laisse 3, et le mot suivant a donc {total} essais. Les lignes bonus ont une bordure en pointillés.",
    step4Image:
      "La grille du mot suivant : six lignes et trois lignes bonus en pointillés.",
    step5Title: "Continuez",
    step5Body:
      "Le mot suivant apparaît juste sous celui que vous avez trouvé, et votre série augmente. Faites défiler vers le haut pour revoir vos mots trouvés.",
    step5Image:
      "{word} trouvé comme mot 1, avec des lignes vides pour le mot 2 en dessous.",
    step6Title: "Plus d'essais, fin de partie",
    step6Body:
      "Si vous utilisez tous vos essais sans trouver le mot, la partie se termine et le mot est révélé. Votre score est le nombre de mots trouvés. {login} pour enregistrer vos scores dans votre profil.",
    step6Login: "Connectez-vous",
    step6Image:
      "Fin de partie : le mot était {word}, et vous avez trouvé 4 mots.",
    readyTitle: "Prêt à jouer ?",
    readyBody: "Aucun compte nécessaire. Lancez-vous.",
    playNow: "Jouer maintenant",
    moreTips: "Envie de tenir plus longtemps ? Lisez nos {tips}.",
    moreTipsLink: "astuces pour des séries plus longues",
  },

  login: {
    loginTitle: "Connexion",
    signupTitle: "Créer un compte",
    forgotTitle: "Réinitialiser votre mot de passe",
    loginSubmit: "Se connecter",
    signupSubmit: "S'inscrire",
    forgotSubmit: "Envoyer le lien",
    email: "E-mail",
    password: "Mot de passe",
    passwordHelp: "Au moins {min} caractères.",
    needAccount: "Pas encore de compte ? Inscrivez-vous",
    forgotPassword: "Mot de passe oublié ?",
    backToLogin: "Retour à la connexion",
    linkError:
      "Ce lien n'a pas fonctionné. Il a peut-être expiré ou été ouvert dans un autre navigateur. Si vous confirmiez votre e-mail, essayez de vous connecter. Sinon, demandez un nouveau lien.",
    checkEmail:
      "Consultez vos e-mails pour trouver le lien qui termine votre inscription.",
    resetSent:
      "Si un compte correspond à cette adresse, un lien de réinitialisation est en route.",
    footnote:
      "Le compte est facultatif. Il conserve votre e-mail, votre nom d'utilisateur et vos scores. Consultez la {privacy} et les {terms}.",
    privacyLink: "politique de confidentialité",
    termsLink: "conditions",
    repeatPassword: "Répétez le mot de passe",
    passwordMismatch: "Les mots de passe ne correspondent pas.",
    showPassword: "Afficher le mot de passe",
    hidePassword: "Masquer le mot de passe",
  },

  username: {
    label: "Nom d'utilisateur",
    newLabel: "Nouveau nom d'utilisateur",
    help: "{min} à {max} caractères : lettres, chiffres et tirets bas.",
    unavailable: "Ce nom d'utilisateur n'est pas disponible.",
  },

  chooseUsername: {
    title: "Choisir un nom d'utilisateur",
    subtitle: "C'est le nom de votre compte.",
    submit: "Continuer",
  },

  resetPassword: {
    title: "Définir un nouveau mot de passe",
    newPassword: "Nouveau mot de passe",
    help: "Au moins {min} caractères.",
    tooShort: "Utilisez au moins {min} caractères.",
    submit: "Enregistrer le mot de passe",
  },

  profile: {
    distributionTitle: "Répartition des essais",
    distributionEmpty:
      "Trouvez un mot pour voir combien d'essais il vous faut d'habitude.",
    loadError: "Impossible de charger votre profil. Réessayez.",
    loading: "Chargement…",
    bestScore: "Meilleur score",
    gamesPlayed: "Parties",
    averageWords: "Mots en moy.",
    recentGames: "Parties récentes",
    noGames:
      "Aucune partie pour l'instant. Les parties terminées apparaissent ici lorsque vous êtes connecté.",
    date: "Date",
    language: "Langue",
    wordsSolved: "Mots trouvés",
    guesses: "Essais",
    changeUsername: "Changer de nom d'utilisateur",
    saveUsername: "Enregistrer le nom",
    usernameUpdated: "Nom d'utilisateur mis à jour.",
    deleteTitle: "Supprimer le compte",
    deleteWarning:
      "Cela supprime définitivement votre compte et tous vos scores. Cette action est irréversible.",
    deleteOpen: "Supprimer mon compte",
    deleteConfirm: "Tapez {word} pour confirmer",
    deleteSubmit: "Supprimer définitivement",
    cancel: "Annuler",
    statsTitle: "Statistiques",
    accountTitle: "Compte",
  },

  settings: {
    title: "Paramètres",
    guestBody:
      "Vous jouez en tant qu'invité. Connectez-vous pour enregistrer vos scores et voir vos statistiques.",
    guestCta: "Se connecter ou s'inscrire",
    displayTitle: "Affichage",
    darkModeLabel: "Mode sombre",
    darkModeDescription: "Plus doux pour les yeux en faible lumière.",
    highContrastLabel: "Contraste élevé",
    highContrastDescription:
      "Cases orange et bleues avec une coche et un point, pour mieux distinguer les couleurs.",
    cookiesTitle: "Cookies",
    cookiesDescription:
      "Choisissez si nous pouvons utiliser des cookies de mesure d'audience. Les cookies nécessaires sont toujours actifs.",
    cookiesButton: "Modifier les paramètres des cookies",
  },

  errors: {
    invalid_request: "Requête invalide",
    not_in_word_list: "Pas dans la liste de mots",
    no_game: "Aucune partie en cours",
    game_over: "Cette partie est terminée",
    game_conflict: "Cette partie a changé. Rechargement en cours.",
    rate_limited: "Trop de requêtes. Patientez un instant puis réessayez.",
    forbidden: "Requête non autorisée",
    unauthorized: "Veuillez vous connecter",
    invalid_credentials: "E-mail ou mot de passe incorrect",
    email_not_confirmed: "Veuillez d'abord confirmer votre e-mail",
    weak_password: "Veuillez choisir un mot de passe plus solide",
    username_unavailable: "Ce nom d'utilisateur n'est pas disponible",
    accounts_unavailable: "Les comptes ne sont pas disponibles pour le moment",
    server_error: "Un problème est survenu. Réessayez.",
  },

  cookies: {
    title: "Cookies sur Endless Lingle",
    description:
      "Nous utilisons des cookies nécessaires pour faire fonctionner le jeu et vous garder connecté. Si vous acceptez, nous utilisons aussi Google Analytics pour comprendre comment le site est utilisé. Nous n'utilisons pas de cookies publicitaires. Vous pouvez modifier votre choix à tout moment dans les Paramètres.",
    details: "Détails des cookies",
    reject: "Refuser",
    accept: "Accepter",
    privacyNotice: "Politique de confidentialité",
    alwaysOn: "Toujours actifs",
    notUsedYet: "Pas encore utilisés",
    withConsent: "Avec consentement",
    kept: "Conservé : {duration}",
    cookie: "Cookie",
    localStorage: "Stockage local",
    categories: {
      necessary: {
        title: "Nécessaires",
        description:
          "Indispensables au fonctionnement du site, donc toujours actifs.",
      },
      analytics: {
        title: "Mesure d'audience",
        description:
          "Google Analytics nous montre quelles pages sont visitées et comment, pour améliorer le jeu. Uniquement avec votre consentement.",
      },
      advertising: {
        title: "Publicité",
        description:
          "Servent à afficher et mesurer des publicités. Uniquement avec votre consentement.",
      },
    },
    items: {
      game: {
        purpose: "Enregistre la partie en cours d'un invité.",
        duration: "30 jours",
      },
      daily: {
        purpose: "Enregistre les essais d'un invité sur le mot du jour, pour qu'il ne puisse pas être rejoué.",
        duration: "3 jours",
      },
      session: {
        purpose: "Vous garde connecté.",
        duration: "Jusqu'à la déconnexion, 400 jours au plus",
      },
      verifier: {
        purpose:
          "Sécurise les liens des e-mails d'inscription et de réinitialisation du mot de passe.",
        duration: "Jusqu'à l'utilisation du lien, 400 jours au plus",
      },
      language: { purpose: "Mémorise votre langue.", duration: "12 mois" },
      preferences: {
        purpose: "Mémorisent vos choix de mode sombre et de contraste.",
        duration: "Jusqu'à leur effacement",
      },
      analytics: {
        purpose:
          "Google Analytics : distingue les visites, pour compter les visiteurs et les pages.",
        duration: "2 ans",
      },
      consent: {
        purpose: "Mémorise votre choix de cookies.",
        duration: "12 mois",
      },
    },
  },

  legal: {
    englishOnly: "Cette page n'est disponible qu'en anglais.",
  },
};
