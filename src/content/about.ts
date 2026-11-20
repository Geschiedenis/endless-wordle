import type { Locale } from "@/i18n/config";

/**
 * The About and Contact pages, per language. The bonus cap and guess counts follow
 * src/lib/game/constants.ts, filled in with {max} and {base}.
 */
export interface AboutContent {
  title: string;
  intro: string;
  differentTitle: string;
  different: { title: string; body: string }[];
  makerTitle: string;
  /** {operator} and {country} come from src/lib/legal.ts and the country below. */
  makerBody: string;
  country: string;
  contactCta: string;
}

export interface ContactContent {
  title: string;
  intro: string;
  reasonsTitle: string;
  reasons: string[];
  emailTitle: string;
  emailBody: string;
  emailCta: string;
  /** The subject the email app starts with. */
  subject: string;
  faqNote: string;
  faqLink: string;
}

export const ABOUT: Record<Locale, AboutContent> = {
  en: {
    title: "About Endless Lingle",
    intro:
      "Endless Lingle is a free word game in your browser. Guess the five-letter word in {base} tries, and when you get it, the next word is ready straight away. You keep going until you run out of guesses.",
    differentTitle: "What makes it different",
    different: [
      { title: "It never stops", body: "No waiting until tomorrow: solve a word and the next one starts right away." },
      { title: "A daily word too", body: "One word a day, the same for everyone, if you like a daily ritual." },
      { title: "Five languages", body: "Play in English, Dutch, German, French or Spanish, each with its own word lists and keyboard." },
      { title: "Free, no download", body: "It works on your phone and computer, without installing anything or making an account." },
    ],
    makerTitle: "Who makes it",
    makerBody:
      "Endless Lingle is made and run by {operator}, an independent maker from {country}. Ideas, word suggestions and bug reports go straight to the person who builds it.",
    country: "the Netherlands",
    contactCta: "Contact us",
  },
  nl: {
    title: "Over Endless Lingle",
    intro:
      "Endless Lingle is een gratis woordspel in je browser. Raad het woord van vijf letters in {base} pogingen, en zodra je het hebt, staat het volgende woord al klaar. Je speelt door tot je pogingen op zijn.",
    differentTitle: "Wat het anders maakt",
    different: [
      { title: "Het stopt nooit", body: "Niet wachten tot morgen: raad een woord en het volgende begint meteen." },
      { title: "Ook een woord van de dag", body: "Eén woord per dag, voor iedereen hetzelfde, als je van een dagelijks ritueel houdt." },
      { title: "Vijf talen", body: "Speel in het Nederlands, Engels, Duits, Frans of Spaans, elk met eigen woordenlijsten en toetsenbord." },
      { title: "Gratis, zonder download", body: "Het werkt op je telefoon en computer, zonder iets te installeren of een account te maken." },
    ],
    makerTitle: "Wie maakt het",
    makerBody:
      "Endless Lingle wordt gemaakt en beheerd door {operator}, een onafhankelijke maker uit {country}. Ideeën, woordsuggesties en foutmeldingen komen direct bij degene die het bouwt.",
    country: "Nederland",
    contactCta: "Neem contact op",
  },
  de: {
    title: "Über Endless Lingle",
    intro:
      "Endless Lingle ist ein kostenloses Wortspiel im Browser. Errate das Wort mit fünf Buchstaben in {base} Versuchen, und sobald du es hast, wartet schon das nächste Wort. Du spielst weiter, bis deine Versuche aufgebraucht sind.",
    differentTitle: "Was es besonders macht",
    different: [
      { title: "Es hört nie auf", body: "Kein Warten bis morgen: Löse ein Wort, und das nächste beginnt sofort." },
      { title: "Auch ein Wort des Tages", body: "Ein Wort pro Tag, für alle gleich, falls du ein tägliches Ritual magst." },
      { title: "Fünf Sprachen", body: "Spiele auf Deutsch, Englisch, Niederländisch, Französisch oder Spanisch, jeweils mit eigenen Wortlisten und eigener Tastatur." },
      { title: "Kostenlos, ohne Download", body: "Es funktioniert auf Handy und Computer, ohne Installation und ohne Konto." },
    ],
    makerTitle: "Wer es macht",
    makerBody:
      "Endless Lingle wird von {operator} entwickelt und betrieben, einem unabhängigen Entwickler aus {country}. Ideen, Wortvorschläge und Fehlermeldungen landen direkt bei der Person, die es baut.",
    country: "den Niederlanden",
    contactCta: "Kontakt aufnehmen",
  },
  fr: {
    title: "À propos d'Endless Lingle",
    intro:
      "Endless Lingle est un jeu de mots gratuit dans votre navigateur. Devinez le mot de cinq lettres en {base} essais, et dès que vous l'avez trouvé, le mot suivant est prêt. Vous continuez jusqu'à ce que vos essais soient épuisés.",
    differentTitle: "Ce qui le rend différent",
    different: [
      { title: "Il ne s'arrête jamais", body: "Pas besoin d'attendre demain : trouvez un mot et le suivant commence aussitôt." },
      { title: "Un mot du jour aussi", body: "Un mot par jour, le même pour tout le monde, si vous aimez un petit rituel quotidien." },
      { title: "Cinq langues", body: "Jouez en français, anglais, néerlandais, allemand ou espagnol, chacune avec ses propres listes de mots et son clavier." },
      { title: "Gratuit, sans téléchargement", body: "Il fonctionne sur téléphone et ordinateur, sans rien installer ni créer de compte." },
    ],
    makerTitle: "Qui le fait",
    makerBody:
      "Endless Lingle est créé et géré par {operator}, un créateur indépendant basé {country}. Les idées, suggestions de mots et signalements de bugs arrivent directement chez la personne qui le développe.",
    country: "aux Pays-Bas",
    contactCta: "Nous contacter",
  },
  es: {
    title: "Sobre Endless Lingle",
    intro:
      "Endless Lingle es un juego de palabras gratuito en tu navegador. Adivina la palabra de cinco letras en {base} intentos y, en cuanto la aciertes, la siguiente palabra ya está lista. Sigues jugando hasta que te quedes sin intentos.",
    differentTitle: "Qué lo hace diferente",
    different: [
      { title: "Nunca se acaba", body: "No hay que esperar a mañana: acierta una palabra y la siguiente empieza enseguida." },
      { title: "También una palabra del día", body: "Una palabra al día, la misma para todos, si te gusta un pequeño ritual diario." },
      { title: "Cinco idiomas", body: "Juega en español, inglés, neerlandés, alemán o francés, cada uno con sus propias listas de palabras y teclado." },
      { title: "Gratis, sin descargas", body: "Funciona en el móvil y en el ordenador, sin instalar nada ni crear una cuenta." },
    ],
    makerTitle: "Quién lo hace",
    makerBody:
      "Endless Lingle lo crea y gestiona {operator}, un creador independiente de {country}. Las ideas, sugerencias de palabras y avisos de errores llegan directamente a quien lo desarrolla.",
    country: "los Países Bajos",
    contactCta: "Contactar",
  },
};

export const CONTACT: Record<Locale, ContactContent> = {
  en: {
    title: "Contact",
    intro: "Questions, ideas or found a bug? We'd love to hear from you, and we read every message.",
    reasonsTitle: "Write to us about",
    reasons: [
      "A word that's missing, or one that shouldn't be in the game",
      "A bug, or something that doesn't work on your device",
      "A language you'd like to play in",
      "Your account or your data",
      "Partnerships and other business",
    ],
    emailTitle: "Email",
    emailBody: "The button opens your email app with our address filled in.",
    emailCta: "Send us an email",
    subject: "Endless Lingle",
    faqNote: "Your question might already be answered in the",
    faqLink: "FAQ",
  },
  nl: {
    title: "Contact",
    intro: "Vragen, ideeën of een fout gevonden? We horen graag van je, en we lezen elk bericht.",
    reasonsTitle: "Schrijf ons over",
    reasons: [
      "Een woord dat ontbreekt, of dat er niet in hoort",
      "Een fout, of iets dat niet werkt op je apparaat",
      "Een taal waarin je wilt spelen",
      "Je account of je gegevens",
      "Samenwerkingen en andere zakelijke vragen",
    ],
    emailTitle: "E-mail",
    emailBody: "De knop opent je e-mailapp met ons adres al ingevuld.",
    emailCta: "Stuur ons een e-mail",
    subject: "Endless Lingle",
    faqNote: "Misschien staat het antwoord op je vraag al in de",
    faqLink: "veelgestelde vragen",
  },
  de: {
    title: "Kontakt",
    intro: "Fragen, Ideen oder einen Fehler gefunden? Wir freuen uns über deine Nachricht und lesen jede einzelne.",
    reasonsTitle: "Schreib uns zu",
    reasons: [
      "Einem Wort, das fehlt oder nicht ins Spiel gehört",
      "Einem Fehler oder etwas, das auf deinem Gerät nicht funktioniert",
      "Einer Sprache, in der du spielen möchtest",
      "Deinem Konto oder deinen Daten",
      "Kooperationen und anderen geschäftlichen Anfragen",
    ],
    emailTitle: "E-Mail",
    emailBody: "Der Button öffnet deine E-Mail-App mit unserer Adresse.",
    emailCta: "Schreib uns eine E-Mail",
    subject: "Endless Lingle",
    faqNote: "Vielleicht ist deine Frage schon in den",
    faqLink: "häufigen Fragen beantwortet",
  },
  fr: {
    title: "Contact",
    intro: "Des questions, des idées ou un bug ? Écrivez-nous, nous lisons chaque message.",
    reasonsTitle: "Écrivez-nous pour",
    reasons: [
      "Un mot qui manque, ou qui ne devrait pas être dans le jeu",
      "Un bug, ou quelque chose qui ne marche pas sur votre appareil",
      "Une langue dans laquelle vous aimeriez jouer",
      "Votre compte ou vos données",
      "Les partenariats et autres demandes professionnelles",
    ],
    emailTitle: "E-mail",
    emailBody: "Le bouton ouvre votre application de messagerie avec notre adresse.",
    emailCta: "Nous écrire",
    subject: "Endless Lingle",
    faqNote: "La réponse à votre question se trouve peut-être déjà dans la",
    faqLink: "FAQ",
  },
  es: {
    title: "Contacto",
    intro: "¿Preguntas, ideas o has encontrado un error? Nos encantará saber de ti, y leemos todos los mensajes.",
    reasonsTitle: "Escríbenos sobre",
    reasons: [
      "Una palabra que falta, o que no debería estar en el juego",
      "Un error, o algo que no funciona en tu dispositivo",
      "Un idioma en el que te gustaría jugar",
      "Tu cuenta o tus datos",
      "Colaboraciones y otras consultas comerciales",
    ],
    emailTitle: "Correo electrónico",
    emailBody: "El botón abre tu aplicación de correo con nuestra dirección.",
    emailCta: "Envíanos un correo",
    subject: "Endless Lingle",
    faqNote: "Puede que la respuesta a tu pregunta ya esté en las",
    faqLink: "preguntas frecuentes",
  },
};
