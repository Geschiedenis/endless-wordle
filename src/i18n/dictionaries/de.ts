import type { Dictionary } from "./en";

export const de: Dictionary = {
  meta: {
    description:
      "Ein Wortspiel wie Wordle, das nie aufhört. Übrige Versuche wandern zum nächsten Wort, und das Spiel endet erst, wenn dir keine mehr bleiben.",
    homeTitle:
      "Endless Lingle: unbegrenztes Wortspiel wie Wordle, auch auf Deutsch",
    playDescription:
      "Spiele Endless Lingle kostenlos im Browser: Rate ein Wort mit fünf Buchstaben nach dem anderen, und übrige Versuche wandern zum nächsten Wort. Kein Konto nötig.",
    howToPlayDescription:
      "So wird Endless Lingle gespielt: was die Farben bedeuten, wie übrige Versuche mitwandern und wie lang deine Serie werden kann.",
    imageAlt: "Ein dunkles Endless-Lingle-Spielfeld mit Logo und Slogan.",
    pageTitle: "{page} | Endless Lingle",
    play: "Spielen",
    howToPlay: "So wird gespielt",
    login: "Anmelden",
    profile: "Profil",
    chooseUsername: "Benutzernamen wählen",
    resetPassword: "Neues Passwort festlegen",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    faq: "Häufige Fragen",
    tips: "Tipps",
    faqDescription:
      "Antworten auf häufige Fragen zu Endless Lingle: Bonusversuche, die Farben, Sprachen, Spielstände und das Teilen von Ergebnissen.",
    tipsDescription:
      "Tipps für längere Serien bei Endless Lingle: gute Startwörter, Bonusversuche nutzen, häufige Endungen und mehr.",
    settings: "Einstellungen",
  },

  languages: {
    en: "Englisch",
    nl: "Niederländisch",
    de: "Deutsch",
    fr: "Französisch",
    es: "Spanisch",
  },

  header: {
    home: "Endless Lingle, zurück zur Startseite",
    language: "Sprache: {language}. Sprache ändern",
    login: "Anmelden",
    account: "Konto",
    accountMenu: "Kontomenü für {name}",
    chooseUsername: "Benutzernamen wählen",
    profile: "Profil",
    logout: "Abmelden",
    darkMode: "Dunkelmodus",
    highContrast: "Hoher Kontrast, geeignet bei Farbenblindheit",
    highContrastTitle: "Hoher Kontrast / Farbenblind-Modus",
    settings: "Einstellungen",
    back: "Zurück",
  },

  footer: {
    legal: "Rechtliches",
    privacy: "Datenschutz",
    terms: "Nutzungsbedingungen",
    cookieSettings: "Cookie-Einstellungen",
    faq: "FAQ",
    tips: "Tipps",
    settings: "Einstellungen",
  },

  home: {
    tagline:
      "Wie Wordle, aber ohne Ende. Übrige Versuche wandern zum nächsten Wort, und das Spiel endet erst, wenn dir keine mehr bleiben.",
    play: "Spielen",
    howToPlay: "So wird gespielt",
  },

  stats: {
    word: "Wort",
    streak: "Serie",
    guessesLeft: "Versuche übrig",
    bonus: "Bonus",
    bonusDescription: "Gesparte Bonusversuche, höchstens {max}",
    guessesLeftWithBonus: "Noch {total} Versuche, davon {bonus} Bonus",
  },

  game: {
    loadError: "Das Spiel konnte nicht geladen werden.",
    tryAgain: "Erneut versuchen",
    notEnoughLetters: "Zu wenige Buchstaben",
    notInWordList: "Nicht in der Wortliste",
    expired: "Dein Spiel ist abgelaufen, hier ist ein neues",
    slowDown: "Etwas langsamer, dann versuch es noch einmal",
    somethingWrong: "Etwas ist schiefgelaufen. Versuch es noch einmal.",
    solved: "Gelöst!",
    solvedWithBonus: {
      one: "Gelöst! +{count} Bonusversuch",
      other: "Gelöst! +{count} Bonusversuche",
    },
    enter: "Enter",
    enterLabel: "Enter, Versuch abschicken",
    backspaceLabel: "Rücktaste, Buchstaben löschen",
    keyboardLabel: "Tastatur",
    boardLabel: "Spielfeld",
    word: "Wort {number}",
    wordSolvedLabel: "Wort {number}, gelöst",
    wordRowsLabel: "Wort {number}, {rows} Zeilen",
    rowLabel: "Zeile {number}",
    bonusRowLabel: "Zeile {number}, Bonusversuch",
    tileLabel: "Zeile {row}, Buchstabe {position}: {letter}",
    emptyTile: "leer",
    feedback: {
      correct: "richtig",
      present: "an anderer Stelle",
      absent: "nicht im Wort",
    },
    announceSolved:
      "{letters}. Gelöst. Wort {number} beginnt mit {guesses} Versuchen.",
    announceLost: "{letters}. Keine Versuche mehr übrig.",
    announceLeft: {
      one: "{letters}. Noch {count} Versuch übrig.",
      other: "{letters}. Noch {count} Versuche übrig.",
    },
    mismatchTitle: "Du hast ein laufendes Spiel auf {language}",
    mismatchBody:
      "Wenn du ein Spiel auf {newLanguage} beginnst, endet das laufende Spiel und damit auch deine Serie.",
    mismatchContinue: "Weiter auf {language}",
    mismatchStartNew: "Spiel auf {language} beginnen",
  },

  gameOver: {
    wordWas: "Das Wort war",
    youSolved: "Du hast {words} gelöst",
    words: { one: "{count} Wort", other: "{count} Wörter" },
    loginToSave: "Melde dich an, um deinen Punktestand zu speichern",
    onNextGame: "beim nächsten Spiel.",
    scoreSaved: "Punktestand gespeichert.",
    scoreNotSaved: "Dein Punktestand konnte nicht gespeichert werden.",
    playAgain: "Nochmal spielen",
  },

  share: {
    button: "Teilen",
    copied: "In die Zwischenablage kopiert",
    failed: "Teilen hat nicht geklappt. Versuch es noch einmal.",
    resultTitle: "Endless-Lingle-Ergebnis",
    resultChallenge: "Schaffst du mehr?",
    resultHeading: "{words} am Stück",
    resultImage: "Ein Endless-Lingle-Ergebnis: {words}",
    resultInvalid:
      "Dieser Ergebnislink funktioniert nicht. Starte einfach dein eigenes Spiel.",
  },

  howTo: {
    title: "So wird gespielt",
    intro:
      "Es spielt sich wie Wordle, nur hört das Spiel nach einem Wort nicht auf. Wie viele Wörter schaffst du am Stück?",
    step1Title: "Rate ein Wort mit fünf Buchstaben",
    step1Body:
      "Tippe ein echtes Wort mit fünf Buchstaben und drücke Enter. Jedes Wort beginnt mit {guesses} Versuchen.",
    step1Image:
      "Das Wort {word} in der ersten Zeile, mit leeren Zeilen darunter.",
    step2Title: "Lies die Farben",
    step2Body: "Nach jedem Versuch zeigen die Felder, wie nah du dran warst.",
    step2Image: "{word} bewertet: grüne, gelbe und graue Felder.",
    green: "Grün:",
    orange: "Orange:",
    yellow: "Gelb:",
    blue: "Blau:",
    grey: "Grau:",
    greenMeaning: "der richtige Buchstabe an der richtigen Stelle.",
    yellowMeaning: "im Wort, aber an einer anderen Stelle.",
    greyMeaning: "gar nicht im Wort.",
    step3Title: "Löse das Wort",
    step3Body:
      "Nutze die Hinweise, um das Wort einzugrenzen. Mach alle Felder grün, um es zu lösen.",
    step3Image: "Drei Versuche, der letzte komplett grün: {words}.",
    step4Title: "Übrige Versuche wandern mit",
    step4Body:
      "Jeder Versuch, den du nicht gebraucht hast, wandert als Bonusversuch zum nächsten Wort, bis zu {max}. Löst du ein Wort in 3 von {base}, bleiben 3 übrig, und das nächste Wort hat {total} Versuche. Bonuszeilen haben einen gestrichelten Rand.",
    step4Image:
      "Das Spielfeld des nächsten Worts: sechs Zeilen plus drei gestrichelte Bonuszeilen.",
    step5Title: "Mach weiter",
    step5Body:
      "Das nächste Wort erscheint direkt unter dem gelösten, und deine Serie wächst. Scrolle jederzeit nach oben, um deine gelösten Wörter zu sehen.",
    step5Image: "{word} als Wort 1 gelöst, darunter leere Zeilen für Wort 2.",
    step6Title: "Keine Versuche mehr, Spiel vorbei",
    step6Body:
      "Verbrauchst du alle Versuche, ohne das Wort zu lösen, endet das Spiel und das Wort wird aufgedeckt. Dein Punktestand ist die Anzahl gelöster Wörter. {login}, um deine Punktestände im Profil zu speichern.",
    step6Login: "Melde dich an",
    step6Image: "Spielende: Das Wort war {word}, und du hast 4 Wörter gelöst.",
    readyTitle: "Bereit zum Spielen?",
    readyBody: "Kein Konto nötig. Leg direkt los.",
    playNow: "Jetzt spielen",
    moreTips: "Willst du länger durchhalten? Lies unsere {tips}.",
    moreTipsLink: "Tipps für längere Serien",
  },

  login: {
    loginTitle: "Anmelden",
    signupTitle: "Konto erstellen",
    forgotTitle: "Passwort zurücksetzen",
    loginSubmit: "Anmelden",
    signupSubmit: "Registrieren",
    forgotSubmit: "Link zum Zurücksetzen senden",
    email: "E-Mail",
    password: "Passwort",
    passwordHelp: "Mindestens {min} Zeichen.",
    needAccount: "Noch kein Konto? Registrieren",
    forgotPassword: "Passwort vergessen?",
    backToLogin: "Zurück zur Anmeldung",
    linkError:
      "Dieser Link hat nicht funktioniert. Vielleicht ist er abgelaufen oder wurde in einem anderen Browser geöffnet. Wolltest du deine E-Mail-Adresse bestätigen, melde dich einfach an. Fordere sonst bitte einen neuen Link an.",
    checkEmail:
      "Sieh in deinen E-Mails nach einem Link, um die Registrierung abzuschließen.",
    resetSent:
      "Falls zu dieser E-Mail-Adresse ein Konto gehört, ist ein Link zum Zurücksetzen unterwegs.",
    footnote:
      "Ein Konto ist freiwillig. Es speichert deine E-Mail-Adresse, deinen Benutzernamen und deine Punktestände. Siehe {privacy} und {terms}.",
    privacyLink: "Datenschutzhinweise",
    termsLink: "Nutzungsbedingungen",
    repeatPassword: "Passwort wiederholen",
    passwordMismatch: "Die Passwörter stimmen nicht überein.",
    showPassword: "Passwort anzeigen",
    hidePassword: "Passwort verbergen",
  },

  username: {
    label: "Benutzername",
    newLabel: "Neuer Benutzername",
    help: "{min} bis {max} Zeichen: Buchstaben, Zahlen und Unterstriche.",
    unavailable: "Dieser Benutzername ist nicht verfügbar.",
  },

  chooseUsername: {
    title: "Benutzernamen wählen",
    subtitle: "Das ist der Name deines Kontos.",
    submit: "Weiter",
  },

  resetPassword: {
    title: "Neues Passwort festlegen",
    newPassword: "Neues Passwort",
    help: "Mindestens {min} Zeichen.",
    tooShort: "Verwende mindestens {min} Zeichen.",
    submit: "Passwort speichern",
  },

  profile: {
    loadError:
      "Dein Profil konnte nicht geladen werden. Bitte versuch es noch einmal.",
    loading: "Lädt…",
    bestScore: "Bestwert",
    gamesPlayed: "Spiele",
    averageWords: "Ø Wörter",
    recentGames: "Letzte Spiele",
    noGames:
      "Noch keine Spiele. Beendete Spiele erscheinen hier, solange du angemeldet bist.",
    date: "Datum",
    language: "Sprache",
    wordsSolved: "Gelöste Wörter",
    guesses: "Versuche",
    changeUsername: "Benutzernamen ändern",
    saveUsername: "Benutzernamen speichern",
    usernameUpdated: "Benutzername aktualisiert.",
    deleteTitle: "Konto löschen",
    deleteWarning:
      "Damit löschst du dein Konto und alle Punktestände endgültig. Das kann nicht rückgängig gemacht werden.",
    deleteOpen: "Mein Konto löschen",
    deleteConfirm: "Gib {word} zur Bestätigung ein",
    deleteSubmit: "Endgültig löschen",
    cancel: "Abbrechen",
    statsTitle: "Statistik",
    accountTitle: "Konto",
  },

  settings: {
    title: "Einstellungen",
    guestBody:
      "Du spielst als Gast. Melde dich an, um deine Punktestände zu speichern und deine Statistik zu sehen.",
    guestCta: "Anmelden oder registrieren",
    displayTitle: "Darstellung",
    darkModeLabel: "Dunkelmodus",
    darkModeDescription: "Angenehmer für die Augen bei wenig Licht.",
    highContrastLabel: "Hoher Kontrast",
    highContrastDescription:
      "Orange und blaue Felder mit Häkchen und Punkt, damit sich die Farben besser unterscheiden lassen.",
    cookiesTitle: "Cookies",
    cookiesDescription:
      "Wähle, ob wir Analyse-Cookies verwenden dürfen. Notwendige Cookies sind immer aktiv.",
    cookiesButton: "Cookie-Einstellungen ändern",
  },

  errors: {
    invalid_request: "Ungültige Anfrage",
    not_in_word_list: "Nicht in der Wortliste",
    no_game: "Kein laufendes Spiel",
    game_over: "Dieses Spiel ist beendet",
    game_conflict: "Dieses Spiel hat sich geändert. Es wird neu geladen.",
    rate_limited: "Zu viele Anfragen. Warte kurz und versuch es noch einmal.",
    forbidden: "Anfrage nicht erlaubt",
    unauthorized: "Bitte melde dich an",
    invalid_credentials: "E-Mail-Adresse oder Passwort ist falsch",
    email_not_confirmed: "Bitte bestätige zuerst deine E-Mail-Adresse",
    weak_password: "Bitte wähle ein stärkeres Passwort",
    username_unavailable: "Dieser Benutzername ist nicht verfügbar",
    accounts_unavailable: "Konten sind gerade nicht verfügbar",
    server_error: "Etwas ist schiefgelaufen. Versuch es noch einmal.",
  },

  cookies: {
    title: "Cookies bei Endless Lingle",
    description:
      "Wir verwenden notwendige Cookies, damit das Spiel funktioniert und du angemeldet bleibst. Wenn du zustimmst, verwenden wir außerdem Google Analytics, um zu verstehen, wie die Seite genutzt wird. Werbe-Cookies verwenden wir nicht. Du kannst deine Wahl jederzeit in den Einstellungen ändern.",
    details: "Details zu Cookies",
    reject: "Ablehnen",
    accept: "Akzeptieren",
    privacyNotice: "Datenschutzhinweise",
    alwaysOn: "Immer aktiv",
    notUsedYet: "Noch nicht genutzt",
    withConsent: "Mit Einwilligung",
    kept: "Gespeichert: {duration}",
    cookie: "Cookie",
    localStorage: "Lokaler Speicher",
    categories: {
      necessary: {
        title: "Notwendig",
        description: "Nötig, damit die Seite funktioniert, daher immer aktiv.",
      },
      analytics: {
        title: "Analyse",
        description:
          "Google Analytics zeigt uns, welche Seiten wie besucht werden, damit wir das Spiel verbessern können. Nur mit deiner Einwilligung.",
      },
      advertising: {
        title: "Werbung",
        description:
          "Zum Anzeigen und Messen von Werbung. Nur mit deiner Einwilligung.",
      },
    },
    items: {
      game: {
        purpose: "Speichert das laufende Spiel eines Gasts.",
        duration: "30 Tage",
      },
      session: {
        purpose: "Hält dich angemeldet.",
        duration: "Bis zur Abmeldung, höchstens 400 Tage",
      },
      verifier: {
        purpose:
          "Sichert die Links in E-Mails zur Registrierung und zum Zurücksetzen des Passworts.",
        duration: "Bis der Link verwendet wurde, höchstens 400 Tage",
      },
      language: { purpose: "Merkt sich deine Sprache.", duration: "12 Monate" },
      preferences: {
        purpose:
          "Merken sich deine Einstellungen für Dunkelmodus und Kontrast.",
        duration: "Bis du sie löschst",
      },
      analytics: {
        purpose:
          "Google Analytics: unterscheidet Besuche, um Besucher und Seitenaufrufe zu zählen.",
        duration: "2 Jahre",
      },
      consent: {
        purpose: "Merkt sich deine Cookie-Auswahl.",
        duration: "12 Monate",
      },
    },
  },

  legal: {
    englishOnly: "Diese Seite ist nur auf Englisch verfügbar.",
  },
};
