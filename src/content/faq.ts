import type { Locale } from "@/i18n/config";

/**
 * The FAQ page, per language. Answers may contain {howToPlay}, {tips} and {privacy},
 * which become links. Keep the facts in step with the game: the bonus cap is in
 * src/lib/game/constants.ts and the guest cookie's lifetime in src/lib/server/game-store.ts.
 */
export interface FaqContent {
  title: string;
  intro: string;
  items: { question: string; answer: string }[];
  links: { howToPlay: string; tips: string; privacy: string };
}

export const FAQ: Record<Locale, FaqContent> = {
  en: {
    title: "Frequently asked questions",
    intro: "Everything you might want to know about Endless Lingle. New to the game? Start with {howToPlay}.",
    links: { howToPlay: "how to play", tips: "tips for longer streaks", privacy: "privacy notice" },
    items: [
      {
        question: "What is Endless Lingle?",
        answer:
          "A free word game based on Wordle. You guess a five-letter word in six tries, but instead of stopping after one word, the game keeps going. Guesses you don't need roll over to the next word, and the game ends when you run out of guesses on a word. Your score is the number of words you solved.",
      },
      {
        question: "Is it free? Do I need an account?",
        answer:
          "It's free, and you can play straight away as a guest. An account is optional: it saves your scores and shows your stats on your profile.",
      },
      {
        question: "How do bonus guesses work?",
        answer:
          "Every guess you didn't need on a word carries over to the next one, up to 3 at a time. Solve a word in 4 of 6 guesses and the next word gets 8. Bonus rows have a dashed border, and the Bonus counter at the top shows how many you've banked.",
      },
      {
        question: "What do the colours mean?",
        answer:
          "Green means the right letter in the right spot, yellow means the letter is in the word but somewhere else, and grey means it isn't in the word. A letter only lights up as often as it appears in the answer, so a second E stays grey if the answer has one E. In high-contrast mode, green becomes orange and yellow becomes blue.",
      },
      {
        question: "Why does it say “Not in word list”?",
        answer:
          "Only real words count as guesses, so you can't test letters with random combinations. A rejected word doesn't cost you a guess. Names and abbreviations aren't accepted.",
      },
      {
        question: "Which languages can I play in?",
        answer:
          "English, Dutch, German, French and Spanish, each with its own words and keyboard. German keeps Ä, Ö and Ü as separate letters, and Spanish keeps Ñ. Other accents are ignored, so typing É counts as E. Switch language with the flag at the top left. Starting a game in another language ends the one you're playing.",
      },
      {
        question: "Will the same word come up twice?",
        answer: "Not in the same game, until you've seen every word in that language's list.",
      },
      {
        question: "Is my game saved if I close the page?",
        answer:
          "Yes. As a guest, your game is kept in this browser for 30 days. When you're logged in, it's saved to your account, so you can carry on from another device.",
      },
      {
        question: "Can I see the words I solved earlier?",
        answer:
          "Yes, scroll up on the board. Solved words stay above the current one until you reload the page. Your score and streak are kept either way.",
      },
      {
        question: "How do I share my result?",
        answer:
          "When a game ends, press Share. It creates a grid with one line per word, without any letters, so it doesn't spoil the words for anyone.",
      },
      {
        question: "Is Endless Lingle the same as Wordle?",
        answer:
          "No. Endless Lingle is an independent word game inspired by Wordle, with its own twist: it never stops after one word. It isn't affiliated with or endorsed by The New York Times Company, which owns Wordle.",
      },
      {
        question: "What do you do with my data?",
        answer: "As little as possible. Our {privacy} explains what we store, why, and how to delete it.",
      },
    ],
  },
  nl: {
    title: "Veelgestelde vragen",
    intro: "Alles wat je wilt weten over Endless Lingle. Nieuw in het spel? Begin met {howToPlay}.",
    links: { howToPlay: "hoe het werkt", tips: "tips voor langere reeksen", privacy: "privacyverklaring" },
    items: [
      {
        question: "Wat is Endless Lingle?",
        answer:
          "Een gratis woordspel gebaseerd op Wordle. Je raadt een woord van vijf letters in zes pogingen, maar het spel stopt niet na één woord. Pogingen die je niet nodig hebt, gaan mee naar het volgende woord, en het spel eindigt als je bij een woord geen pogingen meer hebt. Je score is het aantal woorden dat je hebt geraden.",
      },
      {
        question: "Is het gratis? Heb ik een account nodig?",
        answer:
          "Het is gratis, en je kunt meteen als gast spelen. Een account is optioneel: het bewaart je scores en toont je statistieken in je profiel.",
      },
      {
        question: "Hoe werken bonuspogingen?",
        answer:
          "Elke poging die je bij een woord niet nodig had, gaat mee naar het volgende woord, tot maximaal 3 tegelijk. Raad je een woord in 4 van de 6 pogingen, dan krijgt het volgende woord er 8. Bonusrijen hebben een gestippelde rand, en de Bonus-teller bovenaan laat zien hoeveel je er hebt opgespaard.",
      },
      {
        question: "Wat betekenen de kleuren?",
        answer:
          "Groen betekent de juiste letter op de juiste plek, geel dat de letter in het woord zit maar ergens anders, en grijs dat hij er niet in zit. Een letter licht maar zo vaak op als hij in het antwoord voorkomt, dus een tweede E blijft grijs als het antwoord één E heeft. In de modus met hoog contrast wordt groen oranje en geel blauw.",
      },
      {
        question: "Waarom staat er “Staat niet in de woordenlijst”?",
        answer:
          "Alleen bestaande woorden tellen als poging, dus je kunt geen letters testen met willekeurige combinaties. Een afgewezen woord kost je geen poging. Namen en afkortingen worden niet geaccepteerd.",
      },
      {
        question: "In welke talen kan ik spelen?",
        answer:
          "Engels, Nederlands, Duits, Frans en Spaans, elk met eigen woorden en een eigen toetsenbord. Het Duits heeft Ä, Ö en Ü als aparte letters, en het Spaans Ñ. Andere accenten tellen niet mee, dus É telt als E. Wissel van taal met de vlag linksboven. Begin je een spel in een andere taal, dan stopt het spel dat je aan het spelen bent.",
      },
      {
        question: "Kan hetzelfde woord twee keer voorkomen?",
        answer: "Niet in hetzelfde spel, tot je alle woorden uit de lijst van die taal hebt gehad.",
      },
      {
        question: "Wordt mijn spel bewaard als ik de pagina sluit?",
        answer:
          "Ja. Als gast wordt je spel 30 dagen in deze browser bewaard. Ben je ingelogd, dan staat het bij je account, zodat je op een ander apparaat verder kunt spelen.",
      },
      {
        question: "Kan ik woorden terugzien die ik eerder heb geraden?",
        answer:
          "Ja, scrol omhoog op het bord. Geraden woorden blijven boven het huidige woord staan tot je de pagina herlaadt. Je score en reeks blijven hoe dan ook bewaard.",
      },
      {
        question: "Hoe deel ik mijn resultaat?",
        answer:
          "Druk op Delen als het spel voorbij is. Je krijgt een raster met één regel per woord, zonder letters, zodat je de woorden voor niemand verklapt.",
      },
      {
        question: "Is Endless Lingle hetzelfde als Wordle?",
        answer:
          "Nee. Endless Lingle is een onafhankelijk woordspel geïnspireerd op Wordle, met een eigen draai: het stopt nooit na één woord. Het is niet verbonden aan of goedgekeurd door The New York Times Company, de eigenaar van Wordle.",
      },
      {
        question: "Wat doen jullie met mijn gegevens?",
        answer: "Zo weinig mogelijk. Onze {privacy} legt uit wat we bewaren, waarom, en hoe je het verwijdert.",
      },
    ],
  },
  de: {
    title: "Häufige Fragen",
    intro: "Alles, was du über Endless Lingle wissen möchtest. Neu im Spiel? Fang mit {howToPlay} an.",
    links: { howToPlay: "der Spielanleitung", tips: "Tipps für längere Serien", privacy: "Datenschutzhinweise" },
    items: [
      {
        question: "Was ist Endless Lingle?",
        answer:
          "Ein kostenloses Wortspiel nach dem Vorbild von Wordle. Du rätst ein Wort mit fünf Buchstaben in sechs Versuchen, aber das Spiel hört nach einem Wort nicht auf. Versuche, die du nicht brauchst, wandern zum nächsten Wort, und das Spiel endet, wenn dir bei einem Wort die Versuche ausgehen. Dein Punktestand ist die Anzahl der gelösten Wörter.",
      },
      {
        question: "Ist es kostenlos? Brauche ich ein Konto?",
        answer:
          "Es ist kostenlos, und du kannst sofort als Gast spielen. Ein Konto ist freiwillig: Es speichert deine Punktestände und zeigt deine Statistiken im Profil.",
      },
      {
        question: "Wie funktionieren Bonusversuche?",
        answer:
          "Jeder Versuch, den du bei einem Wort nicht gebraucht hast, wandert zum nächsten, bis zu 3 auf einmal. Löst du ein Wort in 4 von 6 Versuchen, hat das nächste Wort 8. Bonuszeilen haben einen gestrichelten Rand, und der Bonus-Zähler oben zeigt, wie viele du gespart hast.",
      },
      {
        question: "Was bedeuten die Farben?",
        answer:
          "Grün heißt richtiger Buchstabe an der richtigen Stelle, Gelb heißt, der Buchstabe ist im Wort, aber woanders, und Grau heißt, er kommt nicht vor. Ein Buchstabe leuchtet nur so oft auf, wie er in der Lösung vorkommt: Ein zweites E bleibt grau, wenn die Lösung nur ein E hat. Im Modus mit hohem Kontrast wird Grün zu Orange und Gelb zu Blau.",
      },
      {
        question: "Warum steht da „Nicht in der Wortliste“?",
        answer:
          "Nur echte Wörter zählen als Versuch, du kannst also keine Buchstaben mit beliebigen Kombinationen testen. Ein abgelehntes Wort kostet dich keinen Versuch. Namen und Abkürzungen werden nicht akzeptiert.",
      },
      {
        question: "In welchen Sprachen kann ich spielen?",
        answer:
          "Englisch, Niederländisch, Deutsch, Französisch und Spanisch, jeweils mit eigenen Wörtern und eigener Tastatur. Im Deutschen sind Ä, Ö und Ü eigene Buchstaben, im Spanischen Ñ. Andere Akzente zählen nicht, É gilt also als E. Wörter mit ß werden mit SS geschrieben. Du wechselst die Sprache mit der Flagge oben links. Ein Spiel in einer anderen Sprache beendet das laufende.",
      },
      {
        question: "Kann dasselbe Wort zweimal vorkommen?",
        answer: "Nicht im selben Spiel, bis du alle Wörter der Liste dieser Sprache gesehen hast.",
      },
      {
        question: "Wird mein Spiel gespeichert, wenn ich die Seite schließe?",
        answer:
          "Ja. Als Gast bleibt dein Spiel 30 Tage in diesem Browser gespeichert. Wenn du angemeldet bist, wird es in deinem Konto gespeichert, sodass du auf einem anderen Gerät weiterspielen kannst.",
      },
      {
        question: "Kann ich früher gelöste Wörter sehen?",
        answer:
          "Ja, scrolle auf dem Spielfeld nach oben. Gelöste Wörter bleiben über dem aktuellen Wort, bis du die Seite neu lädst. Punktestand und Serie bleiben in jedem Fall erhalten.",
      },
      {
        question: "Wie teile ich mein Ergebnis?",
        answer:
          "Drück am Spielende auf Teilen. Das erstellt ein Raster mit einer Zeile pro Wort, ohne Buchstaben, damit du niemandem die Wörter verrätst.",
      },
      {
        question: "Ist Endless Lingle dasselbe wie Wordle?",
        answer:
          "Nein. Endless Lingle ist ein unabhängiges Wortspiel nach dem Vorbild von Wordle, mit einem eigenen Dreh: Es hört nach einem Wort nie auf. Es steht in keiner Verbindung zu The New York Times Company, der Wordle gehört, und wird nicht von ihr unterstützt.",
      },
      {
        question: "Was macht ihr mit meinen Daten?",
        answer:
          "So wenig wie möglich. Unsere {privacy} erklären, was wir speichern, warum, und wie du es löschen kannst.",
      },
    ],
  },
  fr: {
    title: "Questions fréquentes",
    intro: "Tout ce que vous voulez savoir sur Endless Lingle. Nouveau venu ? Commencez par {howToPlay}.",
    links: { howToPlay: "comment jouer", tips: "astuces pour des séries plus longues", privacy: "politique de confidentialité" },
    items: [
      {
        question: "Qu'est-ce qu'Endless Lingle ?",
        answer:
          "Un jeu de mots gratuit inspiré de Wordle. Vous devinez un mot de cinq lettres en six essais, mais la partie ne s'arrête pas après un mot. Les essais dont vous n'avez pas besoin passent au mot suivant, et la partie se termine quand vous n'avez plus d'essais sur un mot. Votre score est le nombre de mots trouvés.",
      },
      {
        question: "Est-ce gratuit ? Faut-il un compte ?",
        answer:
          "C'est gratuit, et vous pouvez jouer tout de suite en tant qu'invité. Le compte est facultatif : il enregistre vos scores et affiche vos statistiques sur votre profil.",
      },
      {
        question: "Comment fonctionnent les essais bonus ?",
        answer:
          "Chaque essai dont vous n'avez pas eu besoin sur un mot passe au suivant, jusqu'à 3 à la fois. Trouvez un mot en 4 essais sur 6 et le mot suivant en aura 8. Les lignes bonus ont une bordure en pointillés, et le compteur Bonus en haut indique combien vous en avez en réserve.",
      },
      {
        question: "Que signifient les couleurs ?",
        answer:
          "Le vert indique la bonne lettre au bon endroit, le jaune une lettre présente dans le mot mais ailleurs, et le gris une lettre absente. Une lettre ne s'allume qu'autant de fois qu'elle apparaît dans la réponse : un deuxième E reste gris si la réponse n'a qu'un E. En mode contraste élevé, le vert devient orange et le jaune devient bleu.",
      },
      {
        question: "Pourquoi « Pas dans la liste de mots » ?",
        answer:
          "Seuls les vrais mots comptent comme essais, vous ne pouvez donc pas tester des lettres avec des combinaisons au hasard. Un mot refusé ne vous coûte pas d'essai. Les noms propres et les abréviations ne sont pas acceptés.",
      },
      {
        question: "Dans quelles langues puis-je jouer ?",
        answer:
          "Anglais, néerlandais, allemand, français et espagnol, chacune avec ses propres mots et son propre clavier. Les accents ne comptent pas : É vaut E, et Ç vaut C. Les mots avec Œ s'écrivent OE. Changez de langue avec le drapeau en haut à gauche. Commencer une partie dans une autre langue met fin à celle en cours.",
      },
      {
        question: "Le même mot peut-il revenir ?",
        answer: "Pas dans la même partie, tant que vous n'avez pas vu tous les mots de la liste de cette langue.",
      },
      {
        question: "Ma partie est-elle enregistrée si je ferme la page ?",
        answer:
          "Oui. En tant qu'invité, votre partie est conservée 30 jours dans ce navigateur. Si vous êtes connecté, elle est enregistrée dans votre compte et vous pouvez la reprendre sur un autre appareil.",
      },
      {
        question: "Puis-je revoir les mots trouvés plus tôt ?",
        answer:
          "Oui, faites défiler la grille vers le haut. Les mots trouvés restent au-dessus du mot en cours jusqu'à ce que vous rechargiez la page. Votre score et votre série sont conservés dans tous les cas.",
      },
      {
        question: "Comment partager mon résultat ?",
        answer:
          "À la fin d'une partie, appuyez sur Partager. Cela crée une grille avec une ligne par mot, sans aucune lettre, pour ne gâcher les mots à personne.",
      },
      {
        question: "Endless Lingle, c'est la même chose que Wordle ?",
        answer:
          "Non. Endless Lingle est un jeu de mots indépendant inspiré de Wordle, avec sa propre particularité : il ne s'arrête jamais après un mot. Il n'est ni affilié à The New York Times Company, propriétaire de Wordle, ni approuvé par elle.",
      },
      {
        question: "Que faites-vous de mes données ?",
        answer:
          "Le moins possible. Notre {privacy} explique ce que nous conservons, pourquoi, et comment le supprimer.",
      },
    ],
  },
  es: {
    title: "Preguntas frecuentes",
    intro: "Todo lo que quieres saber sobre Endless Lingle. ¿Eres nuevo? Empieza por {howToPlay}.",
    links: { howToPlay: "cómo se juega", tips: "consejos para rachas más largas", privacy: "aviso de privacidad" },
    items: [
      {
        question: "¿Qué es Endless Lingle?",
        answer:
          "Un juego de palabras gratuito basado en Wordle. Adivinas una palabra de cinco letras en seis intentos, pero la partida no termina tras una palabra. Los intentos que no necesitas pasan a la siguiente palabra, y la partida acaba cuando te quedas sin intentos en una palabra. Tu puntuación es el número de palabras acertadas.",
      },
      {
        question: "¿Es gratis? ¿Necesito una cuenta?",
        answer:
          "Es gratis, y puedes jugar enseguida como invitado. La cuenta es opcional: guarda tus puntuaciones y muestra tus estadísticas en tu perfil.",
      },
      {
        question: "¿Cómo funcionan los intentos extra?",
        answer:
          "Cada intento que no necesitaste en una palabra pasa a la siguiente, hasta 3 a la vez. Si aciertas una palabra en 4 de 6 intentos, la siguiente tendrá 8. Las filas extra tienen un borde discontinuo, y el contador Bonus de arriba muestra cuántos llevas acumulados.",
      },
      {
        question: "¿Qué significan los colores?",
        answer:
          "Verde indica la letra correcta en el lugar correcto, amarillo que la letra está en la palabra pero en otro lugar, y gris que no está. Una letra solo se ilumina tantas veces como aparece en la respuesta: una segunda E se queda gris si la respuesta solo tiene una. En el modo de alto contraste, el verde pasa a naranja y el amarillo a azul.",
      },
      {
        question: "¿Por qué dice «No está en la lista de palabras»?",
        answer:
          "Solo cuentan las palabras reales, así que no puedes probar letras con combinaciones al azar. Una palabra rechazada no te cuesta un intento. No se aceptan nombres propios ni abreviaturas.",
      },
      {
        question: "¿En qué idiomas puedo jugar?",
        answer:
          "Inglés, neerlandés, alemán, francés y español, cada uno con sus propias palabras y su propio teclado. En español, la Ñ es una letra propia. Las tildes no cuentan, así que Á vale como A. Cambia de idioma con la bandera de arriba a la izquierda. Empezar una partida en otro idioma termina la que estás jugando.",
      },
      {
        question: "¿Puede salir la misma palabra dos veces?",
        answer: "No en la misma partida, hasta que hayas visto todas las palabras de la lista de ese idioma.",
      },
      {
        question: "¿Se guarda mi partida si cierro la página?",
        answer:
          "Sí. Como invitado, tu partida se guarda 30 días en este navegador. Si tienes la sesión iniciada, se guarda en tu cuenta y puedes seguir en otro dispositivo.",
      },
      {
        question: "¿Puedo ver las palabras que acerté antes?",
        answer:
          "Sí, desplázate hacia arriba en el tablero. Las palabras acertadas se quedan encima de la actual hasta que recargues la página. Tu puntuación y tu racha se conservan en cualquier caso.",
      },
      {
        question: "¿Cómo comparto mi resultado?",
        answer:
          "Al terminar una partida, pulsa Compartir. Crea una cuadrícula con una línea por palabra, sin letras, para no desvelar las palabras a nadie.",
      },
      {
        question: "¿Endless Lingle es lo mismo que Wordle?",
        answer:
          "No. Endless Lingle es un juego de palabras independiente inspirado en Wordle, con su propio giro: nunca se detiene tras una palabra. No tiene relación con The New York Times Company, propietaria de Wordle, ni cuenta con su aprobación.",
      },
      {
        question: "¿Qué hacéis con mis datos?",
        answer: "Lo mínimo posible. Nuestro {privacy} explica qué guardamos, por qué y cómo borrarlo.",
      },
    ],
  },
};
