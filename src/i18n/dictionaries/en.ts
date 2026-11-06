/**
 * All text on the site, in English. Every other language must have the same keys,
 * which TypeScript checks. Placeholders such as {count} are filled in by format()
 * and rich() in src/i18n/format.ts. Plurals have a "one" and an "other" form.
 */
export const en = {
  meta: {
    description:
      "A Wordle that never stops. Spare guesses roll over to the next word, and the game only ends when you run out.",
    homeTitle: "Endless Wordle: unlimited Wordle that never stops",
    playDescription:
      "Play Endless Wordle free in your browser: guess five-letter words one after another, with spare guesses rolling over to the next word. No account needed.",
    howToPlayDescription:
      "Learn how to play Endless Wordle: what the colours mean, how spare guesses roll over, and how long your streak can last.",
    imageAlt: "A dark Endless Wordle board, with the logo and the tagline.",
    pageTitle: "{page} | Endless Wordle",
    play: "Play",
    howToPlay: "How to play",
    login: "Log in",
    profile: "Profile",
    chooseUsername: "Choose a username",
    resetPassword: "Set a new password",
    privacy: "Privacy",
    terms: "Terms",
  },

  /** Language names as written in this language, for sentences like "a game in Dutch". */
  languages: {
    en: "English",
    nl: "Dutch",
    de: "German",
    fr: "French",
    es: "Spanish",
  },

  header: {
    home: "Endless Wordle, back to home",
    language: "Language: {language}. Change language",
    login: "Login",
    account: "Account",
    accountMenu: "Account menu for {name}",
    chooseUsername: "Choose a username",
    profile: "Profile",
    logout: "Logout",
    darkMode: "Dark mode",
    highContrast: "High contrast, colour-blind friendly mode",
    highContrastTitle: "High contrast / colour-blind mode",
  },

  footer: {
    legal: "Legal",
    privacy: "Privacy",
    terms: "Terms",
    cookieSettings: "Cookie settings",
  },

  home: {
    tagline:
      "Wordle, but it never stops. Spare guesses roll over to the next word, and the game only ends when you run out.",
    play: "Play",
    howToPlay: "How to play",
  },

  stats: {
    word: "Word",
    streak: "Streak",
    guessesLeft: "Guesses left",
    bonus: "Bonus",
    bonusDescription: "Bonus guesses banked, out of {max} at most",
  },

  game: {
    loadError: "The game couldn't load.",
    tryAgain: "Try again",
    notEnoughLetters: "Not enough letters",
    notInWordList: "Not in word list",
    expired: "Your game expired, so here's a new one",
    slowDown: "Slow down a little, then try again",
    somethingWrong: "Something went wrong. Try again.",
    solved: "Solved!",
    solvedWithBonus: {
      one: "Solved! +{count} bonus guess",
      other: "Solved! +{count} bonus guesses",
    },
    enter: "Enter",
    enterLabel: "Enter, submit guess",
    backspaceLabel: "Backspace, delete letter",
    keyboardLabel: "Keyboard",
    boardLabel: "Game board",
    word: "Word {number}",
    wordSolvedLabel: "Word {number}, solved",
    wordRowsLabel: "Word {number}, {rows} rows",
    rowLabel: "Row {number}",
    bonusRowLabel: "Row {number}, bonus guess",
    tileLabel: "Row {row}, letter {position}: {letter}",
    emptyTile: "empty",
    feedback: { correct: "correct", present: "present", absent: "absent" },
    announceSolved:
      "{letters}. Solved. Word {number} starts with {guesses} guesses.",
    announceLost: "{letters}. No guesses left.",
    announceLeft: {
      one: "{letters}. {count} guess left.",
      other: "{letters}. {count} guesses left.",
    },
    mismatchTitle: "You have a game in {language} in progress",
    mismatchBody:
      "Starting a game in {newLanguage} ends it, along with your streak.",
    mismatchContinue: "Continue in {language}",
    mismatchStartNew: "Start a game in {language}",
  },

  gameOver: {
    wordWas: "The word was",
    youSolved: "You solved {words}",
    words: { one: "{count} word", other: "{count} words" },
    loginToSave: "Log in to save your score",
    onNextGame: "on your next game.",
    scoreSaved: "Score saved.",
    scoreNotSaved: "Your score couldn't be saved.",
    playAgain: "Play again",
  },

  share: {
    button: "Share",
    copied: "Copied to clipboard",
    failed: "Sharing didn't work. Try again.",
  },

  howTo: {
    title: "How to play",
    intro:
      "It's Wordle, except the game doesn't stop after one word. See how many you can solve in a row.",
    step1Title: "Guess a five-letter word",
    step1Body:
      "Type any real five-letter word and press Enter. Each word starts with {guesses} guesses.",
    step1Image:
      "The word {word} typed into the first row, with empty rows below.",
    step2Title: "Read the colours",
    step2Body: "After each guess, the tiles show how close you were.",
    step2Image: "{word} scored: green, yellow and grey tiles.",
    green: "Green:",
    orange: "Orange:",
    yellow: "Yellow:",
    blue: "Blue:",
    grey: "Grey:",
    greenMeaning: "the right letter in the right spot.",
    yellowMeaning: "in the word, but in a different spot.",
    greyMeaning: "not in the word at all.",
    step3Title: "Solve the word",
    step3Body:
      "Use the clues to narrow it down. Turn every tile green to solve the word.",
    step3Image: "Three guesses, the last one all green: {words}.",
    step4Title: "Spare guesses roll over",
    step4Body:
      "Every guess you didn't need carries over to the next word as a bonus guess, up to {max}. Solving in 3 of {base} leaves 3 spare, so the next word gets {total} guesses. Bonus rows have a dashed border.",
    step4Image: "The next word's board: six rows plus three dashed bonus rows.",
    step5Title: "Keep going",
    step5Body:
      "The next word appears right below the one you solved, and your streak goes up. Scroll up any time to see the words you've solved.",
    step5Image: "{word} solved as word 1, with empty rows for word 2 below it.",
    step6Title: "Run out, and it's game over",
    step6Body:
      "If you use every guess without solving a word, the game ends and the word is revealed. Your score is the number of words you solved. {login} to save your scores to your profile.",
    step6Login: "Log in",
    step6Image:
      "Game over screen: the word was {word}, and you solved 4 words.",
    readyTitle: "Ready to play?",
    readyBody: "No account needed. Jump straight in.",
    playNow: "Play now",
  },

  login: {
    loginTitle: "Log in",
    signupTitle: "Create an account",
    forgotTitle: "Reset your password",
    loginSubmit: "Log in",
    signupSubmit: "Sign up",
    forgotSubmit: "Send reset link",
    email: "Email",
    password: "Password",
    passwordHelp: "At least {min} characters.",
    needAccount: "Need an account? Sign up",
    forgotPassword: "Forgot your password?",
    backToLogin: "Back to log in",
    linkError:
      "That link didn't work. It may have expired, or been opened in a different browser. If you were confirming your email, try logging in. Otherwise, please request a new link.",
    checkEmail: "Check your email for a link to finish signing up.",
    resetSent: "If that email has an account, a reset link is on its way.",
    footnote:
      "Accounts are optional. An account stores your email, username and scores. See the {privacy} and {terms}.",
    privacyLink: "privacy notice",
    termsLink: "terms",
  },

  username: {
    label: "Username",
    newLabel: "New username",
    help: "{min} to {max} characters: letters, numbers and underscores.",
    unavailable: "That username isn't available.",
  },

  chooseUsername: {
    title: "Choose a username",
    subtitle: "This is the name on your account.",
    submit: "Continue",
  },

  resetPassword: {
    title: "Set a new password",
    newPassword: "New password",
    help: "At least {min} characters.",
    tooShort: "Use at least {min} characters.",
    submit: "Save password",
  },

  profile: {
    loadError: "Your profile couldn't load. Please try again.",
    loading: "Loading…",
    bestScore: "Best score",
    gamesPlayed: "Games played",
    averageWords: "Average words",
    recentGames: "Recent games",
    noGames: "No games yet. Finished games appear here while you're logged in.",
    date: "Date",
    language: "Language",
    wordsSolved: "Words solved",
    guesses: "Guesses",
    changeUsername: "Change username",
    saveUsername: "Save username",
    usernameUpdated: "Username updated.",
    deleteTitle: "Delete account",
    deleteWarning:
      "This permanently removes your account and all your scores. It can't be undone.",
    deleteOpen: "Delete my account",
    deleteConfirm: "Type {word} to confirm",
    deleteSubmit: "Delete permanently",
    cancel: "Cancel",
  },

  errors: {
    invalid_request: "Invalid request",
    not_in_word_list: "Not in word list",
    no_game: "No game in progress",
    game_over: "This game has ended",
    game_conflict: "This game changed. Reloading it.",
    rate_limited: "Too many requests. Wait a moment and try again.",
    forbidden: "Request not allowed",
    unauthorized: "Please log in",
    invalid_credentials: "Incorrect email or password",
    email_not_confirmed: "Please confirm your email first",
    weak_password: "Please choose a stronger password",
    username_unavailable: "That username isn't available",
    accounts_unavailable: "Accounts aren't available right now",
    server_error: "Something went wrong. Try again.",
  },

  cookies: {
    title: "Cookies on Endless Wordle",
    description:
      "We use necessary cookies to run the game and keep you logged in. If you accept, we also use Google Analytics to understand how the site is used. We don't use advertising cookies. You can change your choice at any time under Cookie settings at the bottom of the page.",
    details: "Cookie details",
    reject: "Reject",
    accept: "Accept",
    privacyNotice: "Privacy notice",
    alwaysOn: "Always on",
    notUsedYet: "Not used yet",
    withConsent: "With consent",
    kept: "Kept: {duration}",
    cookie: "Cookie",
    localStorage: "Local storage",
    categories: {
      necessary: {
        title: "Necessary",
        description: "Needed for the site to work, so they're always on.",
      },
      analytics: {
        title: "Analytics",
        description:
          "Google Analytics shows us which pages are visited and how, so we can improve the game. Only with your consent.",
      },
      advertising: {
        title: "Advertising",
        description: "Used to show and measure ads. Only with your consent.",
      },
    },
    items: {
      game: {
        purpose: "Saves a guest's game in progress.",
        duration: "30 days",
      },
      session: {
        purpose: "Keeps you logged in.",
        duration: "Until you log out, at most 400 days",
      },
      verifier: {
        purpose: "Secures the links in sign-up and password reset emails.",
        duration: "Until the link is used, at most 400 days",
      },
      language: { purpose: "Remembers your language.", duration: "12 months" },
      preferences: {
        purpose: "Remember your dark mode and contrast choices.",
        duration: "Until you clear them",
      },
      analytics: {
        purpose:
          "Google Analytics: tells visits apart, to count visitors and pages.",
        duration: "2 years",
      },
      consent: {
        purpose: "Remembers your cookie choice.",
        duration: "12 months",
      },
    },
  },

  legal: {
    englishOnly: "This page is only available in English.",
  },
};

export type Dictionary = typeof en;
export type Plural = { one: string; other: string };
