import type { Locale } from "@/i18n/config";

/**
 * The daily word archive, per language. {number}, {date} and {word} are filled in per
 * day. Wiktionary has an edition per language, so "look it up" stays in the player's
 * language.
 */
export interface ArchiveContent {
  title: string;
  intro: string;
  empty: string;
  metaDescription: string;
  dayTitle: string;
  dayIntro: string;
  dayMetaTitle: string;
  dayMetaDescription: string;
  lookUp: string;
  wiktionary: string;
  statsTitle: string;
  plays: string;
  solvedRate: string;
  average: string;
  distributionTitle: string;
  noStats: string;
  previous: string;
  next: string;
  all: string;
  playToday: string;
  playTodayNote: string;
  /** In the footer and under the daily word's result. */
  link: string;
}

export const ARCHIVE: Record<Locale, ArchiveContent> = {
  en: {
    title: "Daily word archive",
    intro:
      "Every past daily word, with how many players guessed it and in how many tries. A day's word only appears here once that day is over everywhere in the world.",
    empty: "The first daily words will appear here soon.",
    metaDescription:
      "Every past Endless Lingle daily word, with how many players guessed it and in how many tries.",
    dayTitle: "Daily word #{number}",
    dayIntro: "The daily word for {date} was:",
    dayMetaTitle: "Daily word #{number} ({date}): {word}",
    dayMetaDescription:
      "The Endless Lingle daily word for {date} was {word}. See how many players guessed it, and in how many tries.",
    lookUp: "What does it mean?",
    wiktionary: "Look up {word} on Wiktionary",
    statsTitle: "How players did",
    plays: "Players",
    solvedRate: "Guessed it",
    average: "Average guesses",
    distributionTitle: "Solved in",
    noStats: "Not enough games were played on this day to show statistics.",
    previous: "Previous day",
    next: "Next day",
    all: "All daily words",
    playToday: "Play today's word",
    playTodayNote: "A new word every day, the same for everyone.",
    link: "Daily word archive",
  },
  nl: {
    title: "Archief van het woord van de dag",
    intro:
      "Alle eerdere woorden van de dag, met hoeveel spelers ze raadden en in hoeveel pogingen. Het woord van een dag verschijnt hier pas als die dag overal ter wereld voorbij is.",
    empty: "De eerste woorden van de dag verschijnen hier binnenkort.",
    metaDescription:
      "Alle eerdere woorden van de dag van Endless Lingle, met hoeveel spelers ze raadden en in hoeveel pogingen.",
    dayTitle: "Woord van de dag #{number}",
    dayIntro: "Het woord van de dag op {date} was:",
    dayMetaTitle: "Woord van de dag #{number} ({date}): {word}",
    dayMetaDescription:
      "Het woord van de dag van Endless Lingle op {date} was {word}. Bekijk hoeveel spelers het raadden, en in hoeveel pogingen.",
    lookUp: "Wat betekent het?",
    wiktionary: "Zoek {word} op in WikiWoordenboek",
    statsTitle: "Hoe spelers het deden",
    plays: "Spelers",
    solvedRate: "Geraden",
    average: "Gemiddeld aantal pogingen",
    distributionTitle: "Geraden in",
    noStats: "Op deze dag zijn te weinig spellen gespeeld om statistieken te tonen.",
    previous: "Vorige dag",
    next: "Volgende dag",
    all: "Alle woorden van de dag",
    playToday: "Speel het woord van vandaag",
    playTodayNote: "Elke dag een nieuw woord, voor iedereen hetzelfde.",
    link: "Archief woord van de dag",
  },
  de: {
    title: "Archiv der Wörter des Tages",
    intro:
      "Alle bisherigen Wörter des Tages, mit wie vielen Spielern sie erraten haben und in wie vielen Versuchen. Das Wort eines Tages erscheint hier erst, wenn dieser Tag überall auf der Welt vorbei ist.",
    empty: "Die ersten Wörter des Tages erscheinen hier bald.",
    metaDescription:
      "Alle bisherigen Wörter des Tages von Endless Lingle, mit wie vielen Spielern sie erraten haben und in wie vielen Versuchen.",
    dayTitle: "Wort des Tages #{number}",
    dayIntro: "Das Wort des Tages am {date} war:",
    dayMetaTitle: "Wort des Tages #{number} ({date}): {word}",
    dayMetaDescription:
      "Das Wort des Tages von Endless Lingle am {date} war {word}. Sieh, wie viele Spieler es erraten haben und in wie vielen Versuchen.",
    lookUp: "Was bedeutet es?",
    wiktionary: "{word} im Wiktionary nachschlagen",
    statsTitle: "So haben die Spieler abgeschnitten",
    plays: "Spieler",
    solvedRate: "Erraten",
    average: "Versuche im Schnitt",
    distributionTitle: "Gelöst in",
    noStats: "An diesem Tag wurden zu wenige Spiele gespielt, um Statistiken zu zeigen.",
    previous: "Vorheriger Tag",
    next: "Nächster Tag",
    all: "Alle Wörter des Tages",
    playToday: "Das heutige Wort spielen",
    playTodayNote: "Jeden Tag ein neues Wort, für alle gleich.",
    link: "Archiv Wort des Tages",
  },
  fr: {
    title: "Archives du mot du jour",
    intro:
      "Tous les mots du jour passés, avec le nombre de joueurs qui les ont trouvés et en combien d'essais. Le mot d'un jour n'apparaît ici qu'une fois ce jour terminé partout dans le monde.",
    empty: "Les premiers mots du jour apparaîtront bientôt ici.",
    metaDescription:
      "Tous les mots du jour passés d'Endless Lingle, avec le nombre de joueurs qui les ont trouvés et en combien d'essais.",
    dayTitle: "Mot du jour n° {number}",
    dayIntro: "Le mot du jour du {date} était :",
    dayMetaTitle: "Mot du jour n° {number} ({date}) : {word}",
    dayMetaDescription:
      "Le mot du jour d'Endless Lingle du {date} était {word}. Voyez combien de joueurs l'ont trouvé, et en combien d'essais.",
    lookUp: "Que veut-il dire ?",
    wiktionary: "Chercher {word} sur le Wiktionnaire",
    statsTitle: "Comment les joueurs s'en sont sortis",
    plays: "Joueurs",
    solvedRate: "Trouvé",
    average: "Essais en moyenne",
    distributionTitle: "Trouvé en",
    noStats: "Trop peu de parties ont été jouées ce jour-là pour afficher des statistiques.",
    previous: "Jour précédent",
    next: "Jour suivant",
    all: "Tous les mots du jour",
    playToday: "Jouer le mot du jour",
    playTodayNote: "Un nouveau mot chaque jour, le même pour tous.",
    link: "Archives du mot du jour",
  },
  es: {
    title: "Archivo de la palabra del día",
    intro:
      "Todas las palabras del día anteriores, con cuántos jugadores las adivinaron y en cuántos intentos. La palabra de un día solo aparece aquí cuando ese día ha terminado en todo el mundo.",
    empty: "Las primeras palabras del día aparecerán aquí pronto.",
    metaDescription:
      "Todas las palabras del día anteriores de Endless Lingle, con cuántos jugadores las adivinaron y en cuántos intentos.",
    dayTitle: "Palabra del día n.º {number}",
    dayIntro: "La palabra del día del {date} fue:",
    dayMetaTitle: "Palabra del día n.º {number} ({date}): {word}",
    dayMetaDescription:
      "La palabra del día de Endless Lingle del {date} fue {word}. Mira cuántos jugadores la adivinaron y en cuántos intentos.",
    lookUp: "¿Qué significa?",
    wiktionary: "Buscar {word} en Wikcionario",
    statsTitle: "Cómo les fue a los jugadores",
    plays: "Jugadores",
    solvedRate: "La adivinaron",
    average: "Intentos de media",
    distributionTitle: "Adivinada en",
    noStats: "Ese día se jugaron muy pocas partidas para mostrar estadísticas.",
    previous: "Día anterior",
    next: "Día siguiente",
    all: "Todas las palabras del día",
    playToday: "Jugar la palabra de hoy",
    playTodayNote: "Una palabra nueva cada día, la misma para todos.",
    link: "Archivo de la palabra del día",
  },
};
