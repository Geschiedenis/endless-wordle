import type { Dictionary } from "./en";

export const nl: Dictionary = {
  meta: {
    description:
      "Een woordspel zoals Wordle, maar dan zonder einde. Ongebruikte pogingen gaan mee naar het volgende woord, en het spel eindigt pas als je ze allemaal hebt opgebruikt.",
    homeTitle:
      "Endless Lingle: onbeperkt woordspel zoals Wordle, ook in het Nederlands",
    playDescription:
      "Speel Endless Lingle gratis in je browser: raad het ene woord van vijf letters na het andere, en neem ongebruikte pogingen mee naar het volgende woord. Geen account nodig.",
    howToPlayDescription:
      "Lees hoe Endless Lingle werkt: wat de kleuren betekenen, hoe ongebruikte pogingen meegaan en hoe lang je reeks kan worden.",
    imageAlt: "Een donker Endless Lingle-bord, met het logo en de slogan.",
    pageTitle: "{page} | Endless Lingle",
    play: "Spelen",
    howToPlay: "Hoe werkt het",
    login: "Inloggen",
    profile: "Profiel",
    chooseUsername: "Kies een gebruikersnaam",
    resetPassword: "Nieuw wachtwoord instellen",
    privacy: "Privacy",
    terms: "Voorwaarden",
    faq: "Veelgestelde vragen",
    tips: "Tips",
    faqDescription:
      "Antwoorden op veelgestelde vragen over Endless Lingle: bonuspogingen, de kleuren, talen, je spel bewaren en resultaten delen.",
    tipsDescription:
      "Tips voor langere reeksen in Endless Lingle: goede startwoorden, je bonuspogingen gebruiken, veelvoorkomende uitgangen en meer.",
    settings: "Instellingen",
  },

  languages: {
    en: "het Engels",
    nl: "het Nederlands",
    de: "het Duits",
    fr: "het Frans",
    es: "het Spaans",
  },

  header: {
    home: "Endless Lingle, terug naar de startpagina",
    language: "Taal: {language}. Taal wijzigen",
    login: "Inloggen",
    account: "Account",
    accountMenu: "Accountmenu voor {name}",
    chooseUsername: "Kies een gebruikersnaam",
    profile: "Profiel",
    logout: "Uitloggen",
    darkMode: "Donkere modus",
    highContrast: "Hoog contrast, geschikt bij kleurenblindheid",
    highContrastTitle: "Hoog contrast / kleurenblindmodus",
    settings: "Instellingen",
    back: "Terug",
  },

  footer: {
    legal: "Juridisch",
    privacy: "Privacy",
    terms: "Voorwaarden",
    cookieSettings: "Cookie-instellingen",
    faq: "Veelgestelde vragen",
    tips: "Tips",
    settings: "Instellingen",
  },

  home: {
    tagline:
      "Net als Wordle, maar dan zonder einde. Ongebruikte pogingen gaan mee naar het volgende woord, en het spel eindigt pas als je ze allemaal hebt opgebruikt.",
    play: "Spelen",
    howToPlay: "Hoe werkt het",
  },

  stats: {
    word: "Woord",
    streak: "Reeks",
    guessesLeft: "Pogingen over",
    bonus: "Bonus",
    bonusDescription: "Opgespaarde bonuspogingen, maximaal {max}",
    guessesLeftWithBonus: "Nog {total} pogingen, waarvan {bonus} bonus",
  },

  game: {
    loadError: "Het spel kon niet worden geladen.",
    tryAgain: "Opnieuw proberen",
    notEnoughLetters: "Niet genoeg letters",
    notInWordList: "Staat niet in de woordenlijst",
    expired: "Je spel was verlopen, dus hier is een nieuw spel",
    slowDown: "Iets rustiger aan, en probeer het dan opnieuw",
    somethingWrong: "Er ging iets mis. Probeer het opnieuw.",
    solved: "Geraden!",
    solvedWithBonus: {
      one: "Geraden! +{count} bonuspoging",
      other: "Geraden! +{count} bonuspogingen",
    },
    enter: "Enter",
    enterLabel: "Enter, poging insturen",
    backspaceLabel: "Backspace, letter wissen",
    keyboardLabel: "Toetsenbord",
    boardLabel: "Speelbord",
    word: "Woord {number}",
    wordSolvedLabel: "Woord {number}, geraden",
    wordRowsLabel: "Woord {number}, {rows} rijen",
    rowLabel: "Rij {number}",
    bonusRowLabel: "Rij {number}, bonuspoging",
    tileLabel: "Rij {row}, letter {position}: {letter}",
    emptyTile: "leeg",
    feedback: {
      correct: "goed",
      present: "op een andere plek",
      absent: "niet in het woord",
    },
    announceSolved:
      "{letters}. Geraden. Woord {number} begint met {guesses} pogingen.",
    announceLost: "{letters}. Geen pogingen meer over.",
    announceLeft: {
      one: "{letters}. Nog {count} poging over.",
      other: "{letters}. Nog {count} pogingen over.",
    },
    mismatchTitle: "Je hebt een spel in {language} bezig",
    mismatchBody:
      "Als je een spel in {newLanguage} begint, stopt dat spel, en daarmee ook je reeks.",
    mismatchContinue: "Verder in {language}",
    mismatchStartNew: "Begin een spel in {language}",
  },

  gameOver: {
    wordWas: "Het woord was",
    youSolved: "Je hebt {words} geraden",
    words: { one: "{count} woord", other: "{count} woorden" },
    loginToSave: "Log in om je score op te slaan",
    onNextGame: "bij je volgende spel.",
    scoreSaved: "Score opgeslagen.",
    scoreNotSaved: "Je score kon niet worden opgeslagen.",
    playAgain: "Opnieuw spelen",
  },

  share: {
    button: "Delen",
    copied: "Gekopieerd naar het klembord",
    failed: "Delen lukte niet. Probeer het opnieuw.",
    resultTitle: "Endless Lingle-resultaat",
    resultChallenge: "Kun jij deze score verbeteren?",
    resultHeading: "{words} op rij",
    resultImage: "Een Endless Lingle-resultaat: {words}",
    resultInvalid: "Deze resultaatlink werkt niet. Begin gewoon je eigen spel.",
  },

  howTo: {
    title: "Hoe werkt het",
    intro:
      "Het speelt als Wordle, maar het spel stopt niet na één woord. Kijk hoeveel woorden je achter elkaar kunt raden.",
    step1Title: "Raad een woord van vijf letters",
    step1Body:
      "Typ een bestaand woord van vijf letters en druk op Enter. Elk woord begint met {guesses} pogingen.",
    step1Image: "Het woord {word} in de eerste rij, met lege rijen eronder.",
    step2Title: "Lees de kleuren",
    step2Body: "Na elke poging laten de tegels zien hoe dichtbij je zat.",
    step2Image: "{word} beoordeeld: groene, gele en grijze tegels.",
    green: "Groen:",
    orange: "Oranje:",
    yellow: "Geel:",
    blue: "Blauw:",
    grey: "Grijs:",
    greenMeaning: "de juiste letter op de juiste plek.",
    yellowMeaning: "zit in het woord, maar op een andere plek.",
    greyMeaning: "zit helemaal niet in het woord.",
    step3Title: "Raad het woord",
    step3Body:
      "Gebruik de hints om het woord te vinden. Maak alle tegels groen om het te raden.",
    step3Image: "Drie pogingen, de laatste helemaal groen: {words}.",
    step4Title: "Ongebruikte pogingen gaan mee",
    step4Body:
      "Elke poging die je niet nodig had, gaat als bonuspoging mee naar het volgende woord, tot maximaal {max}. Raad je het in 3 van de {base}, dan houd je er 3 over en krijgt het volgende woord {total} pogingen. Bonusrijen hebben een gestippelde rand.",
    step4Image:
      "Het bord van het volgende woord: zes rijen plus drie gestippelde bonusrijen.",
    step5Title: "Ga door",
    step5Body:
      "Het volgende woord verschijnt direct onder het woord dat je hebt geraden, en je reeks groeit. Scrol omhoog om je geraden woorden terug te zien.",
    step5Image:
      "{word} geraden als woord 1, met lege rijen voor woord 2 eronder.",
    step6Title: "Op is op",
    step6Body:
      "Gebruik je al je pogingen zonder het woord te raden, dan is het spel voorbij en zie je het woord. Je score is het aantal geraden woorden. {login} om je scores in je profiel op te slaan.",
    step6Login: "Log in",
    step6Image:
      "Einde van het spel: het woord was {word}, en je hebt 4 woorden geraden.",
    readyTitle: "Klaar om te spelen?",
    readyBody: "Geen account nodig. Begin meteen.",
    playNow: "Nu spelen",
    moreTips: "Wil je het langer volhouden? Lees onze {tips}.",
    moreTipsLink: "tips voor langere reeksen",
  },

  login: {
    loginTitle: "Inloggen",
    signupTitle: "Account aanmaken",
    forgotTitle: "Wachtwoord herstellen",
    loginSubmit: "Inloggen",
    signupSubmit: "Registreren",
    forgotSubmit: "Herstellink versturen",
    email: "E-mail",
    password: "Wachtwoord",
    passwordHelp: "Minimaal {min} tekens.",
    needAccount: "Nog geen account? Registreer je",
    forgotPassword: "Wachtwoord vergeten?",
    backToLogin: "Terug naar inloggen",
    linkError:
      "Die link werkte niet. Misschien is hij verlopen, of geopend in een andere browser. Wilde je je e-mailadres bevestigen? Probeer dan in te loggen. Vraag anders een nieuwe link aan.",
    checkEmail: "Check je e-mail voor een link om je registratie af te ronden.",
    resetSent:
      "Als er een account bij dat e-mailadres hoort, is er een herstellink onderweg.",
    footnote:
      "Een account is optioneel. Een account bewaart je e-mailadres, gebruikersnaam en scores. Lees de {privacy} en {terms}.",
    privacyLink: "privacyverklaring",
    termsLink: "voorwaarden",
    repeatPassword: "Herhaal wachtwoord",
    passwordMismatch: "De wachtwoorden komen niet overeen.",
    showPassword: "Wachtwoord tonen",
    hidePassword: "Wachtwoord verbergen",
  },

  username: {
    label: "Gebruikersnaam",
    newLabel: "Nieuwe gebruikersnaam",
    help: "{min} tot {max} tekens: letters, cijfers en underscores.",
    unavailable: "Die gebruikersnaam is niet beschikbaar.",
  },

  chooseUsername: {
    title: "Kies een gebruikersnaam",
    subtitle: "Dit is de naam van je account.",
    submit: "Doorgaan",
  },

  resetPassword: {
    title: "Nieuw wachtwoord instellen",
    newPassword: "Nieuw wachtwoord",
    help: "Minimaal {min} tekens.",
    tooShort: "Gebruik minimaal {min} tekens.",
    submit: "Wachtwoord opslaan",
  },

  profile: {
    loadError: "Je profiel kon niet worden geladen. Probeer het opnieuw.",
    loading: "Laden…",
    bestScore: "Beste score",
    gamesPlayed: "Gespeeld",
    averageWords: "Gem. woorden",
    recentGames: "Recente spellen",
    noGames:
      "Nog geen spellen. Afgeronde spellen verschijnen hier zolang je bent ingelogd.",
    date: "Datum",
    language: "Taal",
    wordsSolved: "Geraden woorden",
    guesses: "Pogingen",
    changeUsername: "Gebruikersnaam wijzigen",
    saveUsername: "Gebruikersnaam opslaan",
    usernameUpdated: "Gebruikersnaam bijgewerkt.",
    deleteTitle: "Account verwijderen",
    deleteWarning:
      "Hiermee verwijder je je account en al je scores voorgoed. Dit kan niet ongedaan worden gemaakt.",
    deleteOpen: "Mijn account verwijderen",
    deleteConfirm: "Typ {word} om te bevestigen",
    deleteSubmit: "Definitief verwijderen",
    cancel: "Annuleren",
    statsTitle: "Statistieken",
    accountTitle: "Account",
  },

  settings: {
    title: "Instellingen",
    guestBody:
      "Je speelt als gast. Log in om je scores te bewaren en je statistieken te zien.",
    guestCta: "Inloggen of registreren",
    displayTitle: "Weergave",
    darkModeLabel: "Donkere modus",
    darkModeDescription: "Prettiger voor je ogen bij weinig licht.",
    highContrastLabel: "Hoog contrast",
    highContrastDescription:
      "Oranje en blauwe tegels met een vinkje en een stip, zodat de kleuren beter te onderscheiden zijn.",
    cookiesTitle: "Cookies",
    cookiesDescription:
      "Kies of we analytische cookies mogen gebruiken. Noodzakelijke cookies staan altijd aan.",
    cookiesButton: "Cookie-instellingen wijzigen",
  },

  errors: {
    invalid_request: "Ongeldig verzoek",
    not_in_word_list: "Staat niet in de woordenlijst",
    no_game: "Er is geen spel bezig",
    game_over: "Dit spel is afgelopen",
    game_conflict: "Dit spel is gewijzigd. Het wordt opnieuw geladen.",
    rate_limited: "Te veel verzoeken. Wacht even en probeer het opnieuw.",
    forbidden: "Verzoek niet toegestaan",
    unauthorized: "Log eerst in",
    invalid_credentials: "Onjuist e-mailadres of wachtwoord",
    email_not_confirmed: "Bevestig eerst je e-mailadres",
    weak_password: "Kies een sterker wachtwoord",
    username_unavailable: "Die gebruikersnaam is niet beschikbaar",
    accounts_unavailable: "Accounts zijn op dit moment niet beschikbaar",
    server_error: "Er ging iets mis. Probeer het opnieuw.",
  },

  cookies: {
    title: "Cookies op Endless Lingle",
    description:
      "We gebruiken noodzakelijke cookies om het spel te laten werken en je ingelogd te houden. Als je accepteert, gebruiken we ook Google Analytics om te begrijpen hoe de site wordt gebruikt. We gebruiken geen advertentiecookies. Je kunt je keuze altijd wijzigen via Cookie-instellingen onderaan de pagina.",
    details: "Details over cookies",
    reject: "Weigeren",
    accept: "Accepteren",
    privacyNotice: "Privacyverklaring",
    alwaysOn: "Altijd aan",
    notUsedYet: "Nog niet in gebruik",
    withConsent: "Met toestemming",
    kept: "Bewaard: {duration}",
    cookie: "Cookie",
    localStorage: "Lokale opslag",
    categories: {
      necessary: {
        title: "Noodzakelijk",
        description: "Nodig om de site te laten werken, dus altijd aan.",
      },
      analytics: {
        title: "Analytisch",
        description:
          "Google Analytics laat ons zien welke pagina's worden bezocht en hoe, zodat we het spel kunnen verbeteren. Alleen met je toestemming.",
      },
      advertising: {
        title: "Advertenties",
        description:
          "Om advertenties te tonen en te meten. Alleen met je toestemming.",
      },
    },
    items: {
      game: {
        purpose: "Bewaart het spel van een gast dat nog bezig is.",
        duration: "30 dagen",
      },
      session: {
        purpose: "Houdt je ingelogd.",
        duration: "Tot je uitlogt, maximaal 400 dagen",
      },
      verifier: {
        purpose:
          "Beveiligt de links in e-mails voor registratie en wachtwoordherstel.",
        duration: "Tot de link is gebruikt, maximaal 400 dagen",
      },
      language: { purpose: "Onthoudt je taal.", duration: "12 maanden" },
      preferences: {
        purpose: "Onthouden je keuzes voor donkere modus en contrast.",
        duration: "Tot je ze wist",
      },
      analytics: {
        purpose:
          "Google Analytics: onderscheidt bezoeken, om bezoekers en pagina's te tellen.",
        duration: "2 jaar",
      },
      consent: { purpose: "Onthoudt je cookiekeuze.", duration: "12 maanden" },
    },
  },

  legal: {
    englishOnly: "Deze pagina is alleen beschikbaar in het Engels.",
  },
};
