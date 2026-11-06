import type { Locale } from "@/i18n/config";

/**
 * The tips page, per language. The starting words, common letters and endings come
 * from each language's answer list (a test checks the starting words are answers).
 * The bonus tip follows the cap in src/lib/game/constants.ts.
 */
export interface TipsContent {
  title: string;
  intro: string;
  /** Starting words named in the first tip. */
  starters: string[];
  items: { title: string; body: string }[];
}

export const TIPS: Record<Locale, TipsContent> = {
  en: {
    title: "Tips for longer streaks",
    intro: "A few habits that make a long run of words much more likely.",
    starters: ["stare", "arose", "slate"],
    items: [
      {
        title: "Start with common letters",
        body: "The most common letters in English answers are E, A, R, T and O. A starting word such as STARE, AROSE or SLATE tests several of them at once.",
      },
      {
        title: "Use your second guess to explore",
        body: "If your first guess found little, try five new letters next, even with a word that can't be the answer. Learning which letters are out is often worth more than a lucky guess.",
      },
      {
        title: "Move your yellow letters",
        body: "A yellow letter is in the word, but not where you put it. Try it in a new position next time, so every guess tells you something new.",
      },
      {
        title: "Remember letters can repeat",
        body: "Words like SPEED, LEVEL or ARRAY use a letter twice. If you're stuck with few letters left, consider a double.",
      },
      {
        title: "Think about common endings",
        body: "Many English answers end in -ER, -CH or -LY. Once you have the start of a word, these are good bets for the rest.",
      },
      {
        title: "Use your bonus wisely",
        body: "You can carry at most 3 bonus guesses. With 3 banked, a word starts with 9 guesses, and solving it in 6 or fewer still leaves you 3. So there's no need to rush a risky guess: a safe one keeps your bank full.",
      },
      {
        title: "Watch the keyboard",
        body: "The keyboard shows the best result for each letter so far. Grey keys are out, so avoid them unless you're deliberately exploring.",
      },
      {
        title: "Take your time",
        body: "There's no timer, and your game is saved. If you're stuck, come back later with fresh eyes.",
      },
      {
        title: "Struggling with the colours?",
        body: "Turn on high contrast in Settings, under the gear button at the top right. It uses orange and blue, and adds a check mark and dot to the tiles.",
      },
    ],
  },
  nl: {
    title: "Tips voor langere reeksen",
    intro:
      "Een paar gewoonten die een lange reeks woorden een stuk waarschijnlijker maken.",
    starters: ["toren", "later", "raken"],
    items: [
      {
        title: "Begin met veelvoorkomende letters",
        body: "De meest voorkomende letters in Nederlandse antwoorden zijn E, A, R, O en N. Een startwoord als TOREN, LATER of RAKEN test er meteen een aantal.",
      },
      {
        title: "Gebruik je tweede poging om te verkennen",
        body: "Leverde je eerste poging weinig op? Probeer dan vijf nieuwe letters, ook met een woord dat het antwoord niet kan zijn. Weten welke letters afvallen is vaak meer waard dan een gelukstreffer.",
      },
      {
        title: "Verplaats je gele letters",
        body: "Een gele letter zit in het woord, maar niet op de plek waar je hem zette. Probeer hem de volgende keer op een andere plek, zodat elke poging je iets nieuws vertelt.",
      },
      {
        title: "Letters kunnen vaker voorkomen",
        body: "Woorden als ZEKER, PAPPA of KEREN gebruiken een letter twee keer. Zit je vast met weinig letters over? Denk dan aan een dubbele.",
      },
      {
        title: "Denk aan veelvoorkomende uitgangen",
        body: "Veel Nederlandse antwoorden eindigen op -EN, -ER of -EL. Heb je het begin van een woord, dan zijn dit goede gokken voor de rest.",
      },
      {
        title: "Gebruik je bonus slim",
        body: "Je kunt maximaal 3 bonuspogingen meenemen. Met 3 opgespaard begint een woord met 9 pogingen, en raad je het in 6 of minder, dan houd je er nog steeds 3 over. Je hoeft dus geen riskante gok te wagen: een veilige poging houdt je voorraad vol.",
      },
      {
        title: "Let op het toetsenbord",
        body: "Het toetsenbord laat per letter het beste resultaat tot nu toe zien. Grijze toetsen vallen af, dus vermijd ze, tenzij je bewust aan het verkennen bent.",
      },
      {
        title: "Neem de tijd",
        body: "Er is geen tijdslimiet, en je spel wordt bewaard. Zit je vast? Kom later terug met een frisse blik.",
      },
      {
        title: "Moeite met de kleuren?",
        body: "Zet hoog contrast aan bij Instellingen, via het tandwiel rechtsboven. Die gebruikt oranje en blauw, en zet een vinkje en een stip op de tegels.",
      },
    ],
  },
  de: {
    title: "Tipps für längere Serien",
    intro:
      "Ein paar Gewohnheiten, mit denen eine lange Serie viel wahrscheinlicher wird.",
    starters: ["karte", "laser", "alter"],
    items: [
      {
        title: "Fang mit häufigen Buchstaben an",
        body: "Die häufigsten Buchstaben in deutschen Lösungen sind E, A, R, N und T. Ein Startwort wie KARTE, LASER oder ALTER prüft gleich mehrere davon.",
      },
      {
        title: "Nutze den zweiten Versuch zum Erkunden",
        body: "Hat dein erster Versuch wenig ergeben, probier fünf neue Buchstaben, auch mit einem Wort, das nicht die Lösung sein kann. Zu wissen, welche Buchstaben rausfallen, ist oft mehr wert als ein Glückstreffer.",
      },
      {
        title: "Verschiebe gelbe Buchstaben",
        body: "Ein gelber Buchstabe ist im Wort, aber nicht an der Stelle, an der du ihn hattest. Probier ihn beim nächsten Mal woanders, damit dir jeder Versuch etwas Neues verrät.",
      },
      {
        title: "Buchstaben können doppelt vorkommen",
        body: "Wörter wie MESSE, PAPST oder TEUER nutzen einen Buchstaben zweimal. Steckst du mit wenigen Buchstaben fest, denk an einen doppelten.",
      },
      {
        title: "Denk an häufige Endungen",
        body: "Viele deutsche Lösungen enden auf -EN, -ER oder -TE. Hast du den Anfang eines Wortes, sind das gute Tipps für den Rest. Und vergiss Ä, Ö und Ü nicht: Sie sind eigene Buchstaben.",
      },
      {
        title: "Setz deinen Bonus klug ein",
        body: "Du kannst höchstens 3 Bonusversuche mitnehmen. Mit 3 gesparten beginnt ein Wort mit 9 Versuchen, und löst du es in 6 oder weniger, bleiben dir trotzdem 3. Du musst also keinen riskanten Versuch wagen: Ein sicherer hält deinen Vorrat voll.",
      },
      {
        title: "Achte auf die Tastatur",
        body: "Die Tastatur zeigt für jeden Buchstaben das bisher beste Ergebnis. Graue Tasten fallen raus, also meide sie, außer du erkundest bewusst.",
      },
      {
        title: "Lass dir Zeit",
        body: "Es gibt kein Zeitlimit, und dein Spiel wird gespeichert. Hängst du fest, komm später mit frischem Blick zurück.",
      },
      {
        title: "Probleme mit den Farben?",
        body: "Schalte den hohen Kontrast in den Einstellungen ein, über das Zahnrad oben rechts. Er nutzt Orange und Blau und ergänzt die Felder um ein Häkchen und einen Punkt.",
      },
    ],
  },
  fr: {
    title: "Astuces pour des séries plus longues",
    intro:
      "Quelques habitudes qui rendent une longue série de mots bien plus probable.",
    starters: ["carte", "autre", "route"],
    items: [
      {
        title: "Commencez par des lettres fréquentes",
        body: "Les lettres les plus fréquentes dans les réponses françaises sont E, A, R, O et I. Un mot de départ comme CARTE, AUTRE ou ROUTE en teste plusieurs à la fois.",
      },
      {
        title: "Utilisez votre deuxième essai pour explorer",
        body: "Si votre premier essai a donné peu de résultats, essayez cinq nouvelles lettres, même avec un mot qui ne peut pas être la réponse. Savoir quelles lettres sont exclues vaut souvent mieux qu'un coup de chance.",
      },
      {
        title: "Déplacez vos lettres jaunes",
        body: "Une lettre jaune est dans le mot, mais pas à l'endroit où vous l'avez mise. Essayez-la ailleurs la fois suivante, pour que chaque essai vous apprenne quelque chose.",
      },
      {
        title: "Les lettres peuvent se répéter",
        body: "Des mots comme TERRE, ELLES ou POMME utilisent une lettre deux fois. Si vous bloquez avec peu de lettres restantes, pensez à une lettre double.",
      },
      {
        title: "Pensez aux terminaisons courantes",
        body: "Beaucoup de réponses françaises se terminent par -ER, -TE ou -RE. Une fois le début du mot trouvé, ce sont de bonnes pistes pour la suite. Les accents ne comptent pas : É s'écrit E.",
      },
      {
        title: "Gérez bien votre bonus",
        body: "Vous pouvez garder au plus 3 essais bonus. Avec 3 en réserve, un mot commence avec 9 essais, et le trouver en 6 ou moins vous en laisse toujours 3. Inutile donc de tenter un essai risqué : un essai sûr garde votre réserve pleine.",
      },
      {
        title: "Surveillez le clavier",
        body: "Le clavier montre le meilleur résultat obtenu pour chaque lettre. Les touches grises sont exclues : évitez-les, sauf si vous explorez volontairement.",
      },
      {
        title: "Prenez votre temps",
        body: "Il n'y a pas de chrono, et votre partie est enregistrée. Si vous bloquez, revenez plus tard avec un regard neuf.",
      },
      {
        title: "Les couleurs vous posent problème ?",
        body: "Activez le contraste élevé dans les Paramètres, via la roue dentée en haut à droite. Il utilise l'orange et le bleu, et ajoute une coche et un point sur les cases.",
      },
    ],
  },
  es: {
    title: "Consejos para rachas más largas",
    intro:
      "Algunos hábitos que hacen mucho más probable una larga racha de palabras.",
    starters: ["radio", "claro", "porta"],
    items: [
      {
        title: "Empieza con letras frecuentes",
        body: "Las letras más frecuentes en las respuestas en español son A, O, R, E e I. Una palabra inicial como RADIO, CLARO o PORTA prueba varias a la vez.",
      },
      {
        title: "Usa el segundo intento para explorar",
        body: "Si tu primer intento dio poco, prueba cinco letras nuevas, aunque sea con una palabra que no pueda ser la respuesta. Saber qué letras quedan fuera suele valer más que un acierto de suerte.",
      },
      {
        title: "Mueve tus letras amarillas",
        body: "Una letra amarilla está en la palabra, pero no donde la pusiste. Pruébala en otra posición la próxima vez, para que cada intento te diga algo nuevo.",
      },
      {
        title: "Las letras pueden repetirse",
        body: "Palabras como PERRO, CALLE o CASAS usan una letra dos veces. Si te atascas con pocas letras, piensa en una doble.",
      },
      {
        title: "Piensa en las terminaciones comunes",
        body: "Muchas respuestas en español terminan en -AR, -TO o -DO. Cuando tengas el principio de la palabra, son buenas apuestas para el resto. La Ñ tiene su propia tecla, pero las tildes no cuentan.",
      },
      {
        title: "Usa bien tu bonus",
        body: "Puedes guardar como máximo 3 intentos extra. Con 3 acumulados, una palabra empieza con 9 intentos, y si la aciertas en 6 o menos te siguen quedando 3. Así que no hace falta arriesgar: un intento seguro mantiene tu reserva llena.",
      },
      {
        title: "Fíjate en el teclado",
        body: "El teclado muestra el mejor resultado de cada letra hasta ahora. Las teclas grises quedan descartadas, así que evítalas salvo que estés explorando a propósito.",
      },
      {
        title: "Tómate tu tiempo",
        body: "No hay cronómetro, y tu partida se guarda. Si te atascas, vuelve más tarde con la mente despejada.",
      },
      {
        title: "¿Te cuestan los colores?",
        body: "Activa el alto contraste en Ajustes, con el engranaje de arriba a la derecha. Usa naranja y azul, y añade una marca y un punto a las casillas.",
      },
    ],
  },
};
