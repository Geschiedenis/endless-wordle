import type { Locale } from "@/i18n/config";

/**
 * The sections below the first screen of the home page, per language. They give
 * visitors and search engines a proper description of the game. {base} and {max} are
 * the guesses per word and the bonus cap from src/lib/game/constants.ts.
 */
export interface HomeContent {
  /** The link at the bottom of the first screen that scrolls down to the sections. */
  more: string;
  howTitle: string;
  howIntro: string;
  /** Guess, roll over, streak: in that order, each with its own picture. */
  steps: [Item, Item, Item];
  featuresTitle: string;
  /** No daily limit, bonus guesses, five languages, free: in that order, each with its own icon. */
  features: [Item, Item, Item, Item];
  languagesTitle: string;
  languagesIntro: string;
  /** Each language's name in this language. */
  languageNames: Record<Locale, string>;
  faqTitle: string;
  faqAll: string;
}

type Item = { title: string; body: string };

/** The FAQ questions shown on the home page, by their place in src/content/faq.ts. */
export const HOME_FAQ_ITEMS = [0, 2, 1, 10];

export const HOME: Record<Locale, HomeContent> = {
  en: {
    more: "More about the game",
    howTitle: "How Endless Lingle works",
    howIntro:
      "The rules of Wordle, without the daily limit. One game is a run of words, and it lasts as long as your guesses do.",
    steps: [
      {
        title: "Guess the word",
        body: "Find the hidden five-letter word in {base} guesses. Green tiles are in the right spot, yellow ones are in the word but somewhere else.",
      },
      {
        title: "Keep your spare guesses",
        body: "Solve a word early and the guesses you didn't use carry over to the next word, up to {max} extra.",
      },
      {
        title: "Build your streak",
        body: "Words keep coming until you run out of guesses on one. Your score is the number of words you solved in a row.",
      },
    ],
    featuresTitle: "Wordle unlimited, with a twist",
    features: [
      {
        title: "No daily limit",
        body: "Wordle gives you one word a day. Here you can play as many as you like, whenever you like.",
      },
      {
        title: "Bonus guesses",
        body: "Fast solves pay off: spare guesses become bonus rows on the next word, so a good run is easier to keep going.",
      },
      {
        title: "Five languages",
        body: "Play in English, Dutch, German, French or Spanish, each with its own list of common five-letter words.",
      },
      {
        title: "Free, no sign-up",
        body: "Start playing straight away in your browser, on your phone or computer. An account only saves your scores.",
      },
    ],
    languagesTitle: "Play Wordle in your language",
    languagesIntro: "Every language has its own words and its own keyboard. Pick one to switch the whole site.",
    languageNames: { en: "English", nl: "Dutch", de: "German", fr: "French", es: "Spanish" },
    faqTitle: "Frequently asked questions",
    faqAll: "All questions",
  },

  nl: {
    more: "Meer over het spel",
    howTitle: "Zo werkt Endless Lingle",
    howIntro:
      "De regels van Wordle en Lingo, zonder daglimiet. Eén spel is een reeks woorden, en het duurt zolang je pogingen het volhouden.",
    steps: [
      {
        title: "Raad het woord",
        body: "Vind het verborgen woord van vijf letters in {base} pogingen. Groene letters staan op de goede plek, gele zitten wel in het woord maar staan ergens anders.",
      },
      {
        title: "Houd pogingen over",
        body: "Raad je een woord snel, dan gaan de pogingen die je niet nodig had mee naar het volgende woord, tot maximaal {max} extra.",
      },
      {
        title: "Bouw je reeks op",
        body: "Er blijven woorden komen tot je pogingen voor een woord op zijn. Je score is het aantal woorden dat je op rij hebt geraden.",
      },
    ],
    featuresTitle: "Onbeperkt Wordle, met een twist",
    features: [
      {
        title: "Geen daglimiet",
        body: "Bij Wordle krijg je één woord per dag. Hier speel je er zoveel als je wilt, wanneer je maar wilt.",
      },
      {
        title: "Bonuspogingen",
        body: "Snel raden loont: overgebleven pogingen worden bonusrijen bij het volgende woord, zodat je een goede reeks makkelijker volhoudt.",
      },
      {
        title: "Vijf talen",
        body: "Speel in het Nederlands, Engels, Duits, Frans of Spaans, elk met een eigen lijst van gangbare woorden van vijf letters.",
      },
      {
        title: "Gratis, zonder account",
        body: "Begin meteen in je browser, op je telefoon of computer. Een account bewaart alleen je scores.",
      },
    ],
    languagesTitle: "Speel Wordle in het Nederlands of een andere taal",
    languagesIntro: "Elke taal heeft eigen woorden en een eigen toetsenbord. Kies er een om de hele site om te zetten.",
    languageNames: { en: "Engels", nl: "Nederlands", de: "Duits", fr: "Frans", es: "Spaans" },
    faqTitle: "Veelgestelde vragen",
    faqAll: "Alle vragen",
  },

  de: {
    more: "Mehr über das Spiel",
    howTitle: "So funktioniert Endless Lingle",
    howIntro:
      "Die Regeln von Wordle, ohne Tageslimit. Ein Spiel ist eine Reihe von Wörtern und dauert so lange, wie deine Versuche reichen.",
    steps: [
      {
        title: "Errate das Wort",
        body: "Finde das gesuchte Wort mit fünf Buchstaben in {base} Versuchen. Grüne Felder stehen an der richtigen Stelle, gelbe sind im Wort, aber woanders.",
      },
      {
        title: "Behalte übrige Versuche",
        body: "Löst du ein Wort früh, wandern die Versuche, die du nicht gebraucht hast, zum nächsten Wort mit, bis zu {max} extra.",
      },
      {
        title: "Bau deine Serie aus",
        body: "Es kommen so lange neue Wörter, bis dir bei einem die Versuche ausgehen. Deine Punktzahl ist die Zahl der Wörter, die du in Folge gelöst hast.",
      },
    ],
    featuresTitle: "Wordle unbegrenzt, mit einem Twist",
    features: [
      {
        title: "Kein Tageslimit",
        body: "Bei Wordle gibt es ein Wort pro Tag. Hier spielst du so viele, wie du willst, wann du willst.",
      },
      {
        title: "Bonusversuche",
        body: "Schnelles Lösen zahlt sich aus: Übrige Versuche werden beim nächsten Wort zu Bonuszeilen, so hält eine gute Serie leichter.",
      },
      {
        title: "Fünf Sprachen",
        body: "Spiel auf Deutsch, Englisch, Niederländisch, Französisch oder Spanisch, jeweils mit einer eigenen Liste gängiger Wörter mit fünf Buchstaben.",
      },
      {
        title: "Kostenlos, ohne Anmeldung",
        body: "Spiel sofort im Browser los, auf dem Handy oder am Computer. Ein Konto speichert nur deine Ergebnisse.",
      },
    ],
    languagesTitle: "Wordle auf Deutsch und in anderen Sprachen",
    languagesIntro: "Jede Sprache hat eigene Wörter und eine eigene Tastatur. Wähl eine aus, um die ganze Seite umzustellen.",
    languageNames: { en: "Englisch", nl: "Niederländisch", de: "Deutsch", fr: "Französisch", es: "Spanisch" },
    faqTitle: "Häufige Fragen",
    faqAll: "Alle Fragen",
  },

  fr: {
    more: "En savoir plus sur le jeu",
    howTitle: "Comment fonctionne Endless Lingle",
    howIntro:
      "Les règles de Wordle, sans limite quotidienne. Une partie est une suite de mots, et elle dure tant qu'il vous reste des essais.",
    steps: [
      {
        title: "Devinez le mot",
        body: "Trouvez le mot caché de cinq lettres en {base} essais. Les cases vertes sont bien placées, les jaunes sont dans le mot mais ailleurs.",
      },
      {
        title: "Gardez vos essais en trop",
        body: "Si vous trouvez un mot rapidement, les essais non utilisés passent au mot suivant, jusqu'à {max} en plus.",
      },
      {
        title: "Allongez votre série",
        body: "Les mots s'enchaînent jusqu'à ce que vous n'ayez plus d'essais sur l'un d'eux. Votre score est le nombre de mots trouvés d'affilée.",
      },
    ],
    featuresTitle: "Wordle illimité, avec un petit plus",
    features: [
      {
        title: "Pas de limite quotidienne",
        body: "Wordle propose un mot par jour. Ici, vous jouez autant que vous voulez, quand vous voulez.",
      },
      {
        title: "Essais bonus",
        body: "La rapidité est récompensée. Les essais en trop deviennent des lignes bonus au mot suivant, et une bonne série est plus facile à prolonger.",
      },
      {
        title: "Cinq langues",
        body: "Jouez en français, anglais, néerlandais, allemand ou espagnol, chaque langue avec sa propre liste de mots courants de cinq lettres.",
      },
      {
        title: "Gratuit, sans inscription",
        body: "Commencez tout de suite dans votre navigateur, sur téléphone ou ordinateur. Un compte sert seulement à garder vos scores.",
      },
    ],
    languagesTitle: "Jouez à Wordle en français ou dans une autre langue",
    languagesIntro:
      "Chaque langue a ses propres mots et son propre clavier. Choisissez-en une pour passer tout le site dans cette langue.",
    languageNames: { en: "Anglais", nl: "Néerlandais", de: "Allemand", fr: "Français", es: "Espagnol" },
    faqTitle: "Questions fréquentes",
    faqAll: "Toutes les questions",
  },

  es: {
    more: "Más sobre el juego",
    howTitle: "Cómo funciona Endless Lingle",
    howIntro:
      "Las reglas de Wordle, sin límite diario. Una partida es una serie de palabras y dura mientras te queden intentos.",
    steps: [
      {
        title: "Adivina la palabra",
        body: "Encuentra la palabra oculta de cinco letras en {base} intentos. Las casillas verdes están en su sitio; las amarillas están en la palabra, pero en otra posición.",
      },
      {
        title: "Guarda los intentos que sobran",
        body: "Si aciertas una palabra pronto, los intentos que no usaste pasan a la siguiente, hasta {max} extra.",
      },
      {
        title: "Alarga tu racha",
        body: "Las palabras siguen llegando hasta que te quedas sin intentos en una. Tu puntuación es el número de palabras que aciertas seguidas.",
      },
    ],
    featuresTitle: "Wordle ilimitado, con un giro",
    features: [
      {
        title: "Sin límite diario",
        body: "Wordle te da una palabra al día. Aquí juegas tantas como quieras, cuando quieras.",
      },
      {
        title: "Intentos extra",
        body: "Acertar rápido tiene premio: los intentos que sobran se convierten en filas extra en la siguiente palabra, así una buena racha es más fácil de mantener.",
      },
      {
        title: "Cinco idiomas",
        body: "Juega en español, inglés, neerlandés, alemán o francés, cada uno con su propia lista de palabras comunes de cinco letras.",
      },
      {
        title: "Gratis y sin registro",
        body: "Empieza a jugar ya en tu navegador, en el móvil o el ordenador. Una cuenta solo sirve para guardar tus puntuaciones.",
      },
    ],
    languagesTitle: "Juega a Wordle en español o en otro idioma",
    languagesIntro: "Cada idioma tiene sus propias palabras y su propio teclado. Elige uno para cambiar todo el sitio.",
    languageNames: { en: "Inglés", nl: "Neerlandés", de: "Alemán", fr: "Francés", es: "Español" },
    faqTitle: "Preguntas frecuentes",
    faqAll: "Todas las preguntas",
  },
};
