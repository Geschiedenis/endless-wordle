import type { Dictionary } from "./en";

export const es: Dictionary = {
  meta: {
    description:
      "Un Wordle que nunca termina. Los intentos que no usas pasan a la siguiente palabra, y la partida solo acaba cuando te quedas sin ellos.",
    homeTitle: "Endless Wordle: Wordle ilimitado, también en español",
    playDescription:
      "Juega gratis a Endless Wordle en tu navegador: adivina palabras de cinco letras una tras otra, y los intentos que te sobran pasan a la siguiente. Sin cuenta.",
    howToPlayDescription:
      "Aprende a jugar a Endless Wordle: qué significan los colores, cómo pasan los intentos que sobran y cuánto puede durar tu racha.",
    imageAlt: "Un tablero oscuro de Endless Wordle, con el logo y el eslogan.",
    pageTitle: "{page} | Endless Wordle",
    play: "Jugar",
    howToPlay: "Cómo se juega",
    login: "Iniciar sesión",
    profile: "Perfil",
    chooseUsername: "Elige un nombre de usuario",
    resetPassword: "Nueva contraseña",
    privacy: "Privacidad",
    terms: "Condiciones",
  },

  languages: {
    en: "inglés",
    nl: "neerlandés",
    de: "alemán",
    fr: "francés",
    es: "español",
  },

  header: {
    home: "Endless Wordle, volver al inicio",
    language: "Idioma: {language}. Cambiar idioma",
    login: "Entrar",
    account: "Cuenta",
    accountMenu: "Menú de la cuenta de {name}",
    chooseUsername: "Elige un nombre de usuario",
    profile: "Perfil",
    logout: "Cerrar sesión",
    darkMode: "Modo oscuro",
    highContrast: "Alto contraste, apto para daltónicos",
    highContrastTitle: "Alto contraste / modo daltónico",
  },

  footer: {
    legal: "Legal",
    privacy: "Privacidad",
    terms: "Condiciones",
    cookieSettings: "Configuración de cookies",
  },

  home: {
    tagline:
      "Wordle, pero sin final. Los intentos que no usas pasan a la siguiente palabra, y la partida solo acaba cuando te quedas sin ellos.",
    play: "Jugar",
    howToPlay: "Cómo se juega",
  },

  stats: {
    word: "Palabra",
    streak: "Racha",
    guessesLeft: "Intentos",
    bonus: "Bonus",
    bonusDescription: "Intentos extra acumulados, {max} como máximo",
  },

  game: {
    loadError: "No se pudo cargar la partida.",
    tryAgain: "Reintentar",
    notEnoughLetters: "Faltan letras",
    notInWordList: "No está en la lista de palabras",
    expired: "Tu partida caducó, así que aquí tienes una nueva",
    slowDown: "Ve un poco más despacio e inténtalo de nuevo",
    somethingWrong: "Algo salió mal. Inténtalo de nuevo.",
    solved: "¡Acertaste!",
    solvedWithBonus: {
      one: "¡Acertaste! +{count} intento extra",
      other: "¡Acertaste! +{count} intentos extra",
    },
    enter: "Enviar",
    enterLabel: "Enviar intento",
    backspaceLabel: "Retroceso, borrar letra",
    keyboardLabel: "Teclado",
    boardLabel: "Tablero",
    word: "Palabra {number}",
    wordSolvedLabel: "Palabra {number}, acertada",
    wordRowsLabel: "Palabra {number}, {rows} filas",
    rowLabel: "Fila {number}",
    bonusRowLabel: "Fila {number}, intento extra",
    tileLabel: "Fila {row}, letra {position}: {letter}",
    emptyTile: "vacía",
    feedback: {
      correct: "en su sitio",
      present: "en otro sitio",
      absent: "no está",
    },
    announceSolved:
      "{letters}. Acertada. La palabra {number} empieza con {guesses} intentos.",
    announceLost: "{letters}. No quedan intentos.",
    announceLeft: {
      one: "{letters}. Queda {count} intento.",
      other: "{letters}. Quedan {count} intentos.",
    },
    mismatchTitle: "Tienes una partida en {language} en curso",
    mismatchBody:
      "Si empiezas una partida en {newLanguage}, esa partida terminará, y tu racha también.",
    mismatchContinue: "Seguir en {language}",
    mismatchStartNew: "Empezar una partida en {language}",
  },

  gameOver: {
    wordWas: "La palabra era",
    youSolved: "Acertaste {words}",
    words: { one: "{count} palabra", other: "{count} palabras" },
    loginToSave: "Inicia sesión para guardar tu puntuación",
    onNextGame: "en tu próxima partida.",
    scoreSaved: "Puntuación guardada.",
    scoreNotSaved: "No se pudo guardar tu puntuación.",
    playAgain: "Jugar otra vez",
  },

  share: {
    button: "Compartir",
    copied: "Copiado al portapapeles",
    failed: "No se pudo compartir. Inténtalo de nuevo.",
  },

  howTo: {
    title: "Cómo se juega",
    intro:
      "Es Wordle, pero la partida no termina tras una palabra. ¿Cuántas puedes acertar seguidas?",
    step1Title: "Adivina una palabra de cinco letras",
    step1Body:
      "Escribe una palabra real de cinco letras y pulsa Enviar. Cada palabra empieza con {guesses} intentos.",
    step1Image:
      "La palabra {word} escrita en la primera fila, con filas vacías debajo.",
    step2Title: "Fíjate en los colores",
    step2Body: "Tras cada intento, las casillas muestran lo cerca que estás.",
    step2Image: "{word} evaluada: casillas verdes, amarillas y grises.",
    green: "Verde:",
    orange: "Naranja:",
    yellow: "Amarillo:",
    blue: "Azul:",
    grey: "Gris:",
    greenMeaning: "la letra correcta en el lugar correcto.",
    yellowMeaning: "está en la palabra, pero en otro lugar.",
    greyMeaning: "no está en la palabra.",
    step3Title: "Acierta la palabra",
    step3Body:
      "Usa las pistas para acotar. Pon todas las casillas en verde para acertar la palabra.",
    step3Image: "Tres intentos, el último todo en verde: {words}.",
    step4Title: "Los intentos que sobran pasan a la siguiente",
    step4Body:
      "Cada intento que no necesitaste pasa a la siguiente palabra como intento extra, hasta {max}. Si aciertas en 3 de {base}, te sobran 3, así que la siguiente palabra tiene {total} intentos. Las filas extra tienen un borde discontinuo.",
    step4Image:
      "El tablero de la siguiente palabra: seis filas y tres filas extra con borde discontinuo.",
    step5Title: "Sigue jugando",
    step5Body:
      "La siguiente palabra aparece justo debajo de la que acertaste, y tu racha sube. Desplázate hacia arriba cuando quieras para ver las palabras que acertaste.",
    step5Image:
      "{word} acertada como palabra 1, con filas vacías para la palabra 2 debajo.",
    step6Title: "Sin intentos, se acabó",
    step6Body:
      "Si gastas todos los intentos sin acertar una palabra, la partida termina y se revela la palabra. Tu puntuación es el número de palabras acertadas. {login} para guardar tus puntuaciones en tu perfil.",
    step6Login: "Inicia sesión",
    step6Image:
      "Fin de la partida: la palabra era {word}, y acertaste 4 palabras.",
    readyTitle: "¿Listo para jugar?",
    readyBody: "No necesitas cuenta. Empieza ya.",
    playNow: "Jugar ahora",
  },

  login: {
    loginTitle: "Iniciar sesión",
    signupTitle: "Crear una cuenta",
    forgotTitle: "Restablecer la contraseña",
    loginSubmit: "Iniciar sesión",
    signupSubmit: "Registrarse",
    forgotSubmit: "Enviar enlace",
    email: "Correo electrónico",
    password: "Contraseña",
    passwordHelp: "Al menos {min} caracteres.",
    needAccount: "¿No tienes cuenta? Regístrate",
    forgotPassword: "¿Olvidaste tu contraseña?",
    backToLogin: "Volver a iniciar sesión",
    linkError:
      "Ese enlace no funcionó. Puede que haya caducado o que se abriera en otro navegador. Si estabas confirmando tu correo, prueba a iniciar sesión. Si no, pide un enlace nuevo.",
    checkEmail:
      "Revisa tu correo: te enviamos un enlace para terminar el registro.",
    resetSent:
      "Si hay una cuenta con ese correo, te llegará un enlace para restablecer la contraseña.",
    footnote:
      "La cuenta es opcional. Guarda tu correo, tu nombre de usuario y tus puntuaciones. Consulta el {privacy} y las {terms}.",
    privacyLink: "aviso de privacidad",
    termsLink: "condiciones",
  },

  username: {
    label: "Nombre de usuario",
    newLabel: "Nuevo nombre de usuario",
    help: "De {min} a {max} caracteres: letras, números y guiones bajos.",
    unavailable: "Ese nombre de usuario no está disponible.",
  },

  chooseUsername: {
    title: "Elige un nombre de usuario",
    subtitle: "Es el nombre de tu cuenta.",
    submit: "Continuar",
  },

  resetPassword: {
    title: "Nueva contraseña",
    newPassword: "Nueva contraseña",
    help: "Al menos {min} caracteres.",
    tooShort: "Usa al menos {min} caracteres.",
    submit: "Guardar contraseña",
  },

  profile: {
    loadError: "No se pudo cargar tu perfil. Inténtalo de nuevo.",
    loading: "Cargando…",
    bestScore: "Mejor puntuación",
    gamesPlayed: "Partidas",
    averageWords: "Media de palabras",
    recentGames: "Partidas recientes",
    noGames:
      "Aún no hay partidas. Las partidas terminadas aparecen aquí mientras tengas la sesión iniciada.",
    date: "Fecha",
    language: "Idioma",
    wordsSolved: "Palabras acertadas",
    guesses: "Intentos",
    changeUsername: "Cambiar nombre de usuario",
    saveUsername: "Guardar nombre",
    usernameUpdated: "Nombre de usuario actualizado.",
    deleteTitle: "Eliminar cuenta",
    deleteWarning:
      "Esto elimina para siempre tu cuenta y todas tus puntuaciones. No se puede deshacer.",
    deleteOpen: "Eliminar mi cuenta",
    deleteConfirm: "Escribe {word} para confirmar",
    deleteSubmit: "Eliminar definitivamente",
    cancel: "Cancelar",
  },

  errors: {
    invalid_request: "Solicitud no válida",
    not_in_word_list: "No está en la lista de palabras",
    no_game: "No hay ninguna partida en curso",
    game_over: "Esta partida ha terminado",
    game_conflict: "Esta partida ha cambiado. Volviendo a cargarla.",
    rate_limited:
      "Demasiadas solicitudes. Espera un momento e inténtalo de nuevo.",
    forbidden: "Solicitud no permitida",
    unauthorized: "Inicia sesión",
    invalid_credentials: "Correo o contraseña incorrectos",
    email_not_confirmed: "Confirma primero tu correo",
    weak_password: "Elige una contraseña más segura",
    username_unavailable: "Ese nombre de usuario no está disponible",
    accounts_unavailable: "Las cuentas no están disponibles en este momento",
    server_error: "Algo salió mal. Inténtalo de nuevo.",
  },

  cookies: {
    title: "Cookies en Endless Wordle",
    description:
      "Usamos cookies necesarias para que el juego funcione y mantener tu sesión iniciada. Con tu consentimiento, también podríamos usar cookies analíticas y publicitarias. Todavía no usamos ninguna, y solo funcionarán si aceptas. Puedes cambiar tu elección cuando quieras en Configuración de cookies, al final de la página.",
    details: "Detalles de las cookies",
    reject: "Rechazar",
    accept: "Aceptar",
    privacyNotice: "Aviso de privacidad",
    alwaysOn: "Siempre activas",
    notUsedYet: "Aún no se usan",
    withConsent: "Con consentimiento",
    kept: "Se conserva: {duration}",
    cookie: "Cookie",
    localStorage: "Almacenamiento local",
    categories: {
      necessary: {
        title: "Necesarias",
        description:
          "Imprescindibles para que el sitio funcione, así que siempre están activas.",
      },
      analytics: {
        title: "Analíticas",
        description:
          "Nos ayudan a entender cómo se usa el sitio. Solo con tu consentimiento.",
      },
      advertising: {
        title: "Publicidad",
        description:
          "Sirven para mostrar y medir anuncios. Solo con tu consentimiento.",
      },
    },
    items: {
      game: {
        purpose: "Guarda la partida en curso de un invitado.",
        duration: "30 días",
      },
      session: {
        purpose: "Mantiene tu sesión iniciada.",
        duration: "Hasta que cierres sesión, 400 días como máximo",
      },
      verifier: {
        purpose:
          "Protege los enlaces de los correos de registro y de cambio de contraseña.",
        duration: "Hasta que se use el enlace, 400 días como máximo",
      },
      language: { purpose: "Recuerda tu idioma.", duration: "12 meses" },
      preferences: {
        purpose: "Recuerdan tus preferencias de modo oscuro y contraste.",
        duration: "Hasta que las borres",
      },
      consent: {
        purpose: "Recuerda tu elección de cookies.",
        duration: "12 meses",
      },
    },
  },

  legal: {
    englishOnly: "Esta página solo está disponible en inglés.",
  },
};
