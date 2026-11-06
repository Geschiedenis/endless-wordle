#!/usr/bin/env node
/**
 * Regenerates the Supabase email templates in supabase/email-templates/.
 *
 * Supabase has one template per email type, not per language, so each file holds
 * every language and picks one with Go template code from the language stored on the
 * account at sign-up ({{ .Data.locale }}). Accounts without one get English.
 *
 * Styles are written inline, because email clients ignore stylesheets and CSS
 * variables. The colours match the dark theme in src/app/globals.css.
 *
 * Usage: node scripts/build-email-templates.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";

const FONT = "Geist,-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const C = {
  page: "#121213",
  card: "#1f1f22",
  border: "#3f3f46",
  text: "#f4f4f5",
  muted: "#a1a1aa",
  code: "#27272a",
  button: "#2f7d3b",
};

/** Shared text, per language. */
const COMMON = {
  en: { fallback: "Button not working? Copy this link into your browser:", tagline: "the word game that never stops.", path: "" },
  nl: { fallback: "Werkt de knop niet? Kopieer deze link naar je browser:", tagline: "het woordspel dat nooit stopt.", path: "/nl" },
  de: { fallback: "Der Button funktioniert nicht? Kopiere diesen Link in deinen Browser:", tagline: "das Wortspiel, das nie aufhört.", path: "/de" },
  fr: { fallback: "Le bouton ne fonctionne pas ? Copiez ce lien dans votre navigateur :", tagline: "le jeu de mots qui ne s'arrête jamais.", path: "/fr" },
  es: { fallback: "¿El botón no funciona? Copia este enlace en tu navegador:", tagline: "el juego de palabras que nunca termina.", path: "/es" },
};

/**
 * Text per template and language: title, preheader, heading, body, button (or null
 * for a code), note. {{ .Email }} and friends are filled in by Supabase.
 */
const TEMPLATES = {
  "confirm-sign-up": {
    en: ["Confirm your email for Endless Lingle", "Confirm your email to finish creating your account.", "Confirm your email", "Thanks for signing up. Confirm your email to finish creating your account and start saving your scores.", "Confirm email", "If you didn't create an Endless Lingle account, you can ignore this email."],
    nl: ["Bevestig je e-mailadres voor Endless Lingle", "Bevestig je e-mailadres om je account af te maken.", "Bevestig je e-mailadres", "Bedankt voor je registratie. Bevestig je e-mailadres om je account af te maken en je scores te bewaren.", "E-mailadres bevestigen", "Heb je geen account bij Endless Lingle aangemaakt? Dan kun je deze e-mail negeren."],
    de: ["Bestätige deine E-Mail-Adresse für Endless Lingle", "Bestätige deine E-Mail-Adresse, um dein Konto fertig einzurichten.", "Bestätige deine E-Mail-Adresse", "Danke für deine Registrierung. Bestätige deine E-Mail-Adresse, um dein Konto fertig einzurichten und deine Punktestände zu speichern.", "E-Mail-Adresse bestätigen", "Wenn du kein Konto bei Endless Lingle erstellt hast, kannst du diese E-Mail ignorieren."],
    fr: ["Confirmez votre e-mail pour Endless Lingle", "Confirmez votre e-mail pour terminer la création de votre compte.", "Confirmez votre e-mail", "Merci de vous être inscrit. Confirmez votre e-mail pour terminer la création de votre compte et enregistrer vos scores.", "Confirmer l'e-mail", "Si vous n'avez pas créé de compte Endless Lingle, vous pouvez ignorer cet e-mail."],
    es: ["Confirma tu correo para Endless Lingle", "Confirma tu correo para terminar de crear tu cuenta.", "Confirma tu correo", "Gracias por registrarte. Confirma tu correo para terminar de crear tu cuenta y empezar a guardar tus puntuaciones.", "Confirmar correo", "Si no creaste una cuenta en Endless Lingle, puedes ignorar este correo."],
  },
  "invite-user": {
    en: ["You're invited to Endless Lingle", "Create your account to start saving your scores.", "You're invited", "Someone invited you to Endless Lingle, the word game that never stops. Accept the invite to create your account.", "Accept invite", "If you weren't expecting this invite, you can ignore this email."],
    nl: ["Je bent uitgenodigd voor Endless Lingle", "Maak je account aan om je scores te bewaren.", "Je bent uitgenodigd", "Iemand heeft je uitgenodigd voor Endless Lingle, het woordspel dat nooit stopt. Accepteer de uitnodiging om je account aan te maken.", "Uitnodiging accepteren", "Verwachtte je deze uitnodiging niet? Dan kun je deze e-mail negeren."],
    de: ["Du bist zu Endless Lingle eingeladen", "Erstelle dein Konto, um deine Punktestände zu speichern.", "Du bist eingeladen", "Jemand hat dich zu Endless Lingle eingeladen, dem Wortspiel, das nie aufhört. Nimm die Einladung an, um dein Konto zu erstellen.", "Einladung annehmen", "Wenn du diese Einladung nicht erwartet hast, kannst du diese E-Mail ignorieren."],
    fr: ["Vous êtes invité sur Endless Lingle", "Créez votre compte pour enregistrer vos scores.", "Vous êtes invité", "Quelqu'un vous a invité sur Endless Lingle, le jeu de mots qui ne s'arrête jamais. Acceptez l'invitation pour créer votre compte.", "Accepter l'invitation", "Si vous n'attendiez pas cette invitation, vous pouvez ignorer cet e-mail."],
    es: ["Te han invitado a Endless Lingle", "Crea tu cuenta para empezar a guardar tus puntuaciones.", "Te han invitado", "Alguien te ha invitado a Endless Lingle, el juego de palabras que nunca termina. Acepta la invitación para crear tu cuenta.", "Aceptar invitación", "Si no esperabas esta invitación, puedes ignorar este correo."],
  },
  "magic-link": {
    en: ["Your Endless Lingle login link", "Use this link to log in to Endless Lingle.", "Log in to Endless Lingle", "Use the button below to log in. No password needed.", "Log in", "This link can only be used once. If you didn't ask for it, you can ignore this email."],
    nl: ["Je inloglink voor Endless Lingle", "Gebruik deze link om in te loggen bij Endless Lingle.", "Inloggen bij Endless Lingle", "Log in met de knop hieronder. Je hebt geen wachtwoord nodig.", "Inloggen", "Deze link werkt maar één keer. Heb je er niet om gevraagd? Dan kun je deze e-mail negeren."],
    de: ["Dein Anmeldelink für Endless Lingle", "Melde dich mit diesem Link bei Endless Lingle an.", "Bei Endless Lingle anmelden", "Melde dich mit dem Button unten an. Kein Passwort nötig.", "Anmelden", "Dieser Link funktioniert nur einmal. Wenn du ihn nicht angefordert hast, kannst du diese E-Mail ignorieren."],
    fr: ["Votre lien de connexion Endless Lingle", "Utilisez ce lien pour vous connecter à Endless Lingle.", "Connexion à Endless Lingle", "Connectez-vous avec le bouton ci-dessous. Aucun mot de passe nécessaire.", "Se connecter", "Ce lien ne fonctionne qu'une fois. Si vous ne l'avez pas demandé, vous pouvez ignorer cet e-mail."],
    es: ["Tu enlace para entrar en Endless Lingle", "Usa este enlace para entrar en Endless Lingle.", "Entra en Endless Lingle", "Entra con el botón de abajo. No necesitas contraseña.", "Entrar", "Este enlace solo funciona una vez. Si no lo pediste, puedes ignorar este correo."],
  },
  "change-email": {
    en: ["Confirm your new email for Endless Lingle", "Confirm the change to your Endless Lingle email address.", "Confirm your new email", "You asked to change your email from <strong>{{ .Email }}</strong> to <strong>{{ .NewEmail }}</strong>. Confirm the change to finish.", "Confirm new email", "If you didn't ask for this, you can ignore this email and your address stays the same."],
    nl: ["Bevestig je nieuwe e-mailadres voor Endless Lingle", "Bevestig de wijziging van je e-mailadres bij Endless Lingle.", "Bevestig je nieuwe e-mailadres", "Je wilt je e-mailadres wijzigen van <strong>{{ .Email }}</strong> naar <strong>{{ .NewEmail }}</strong>. Bevestig de wijziging om dit af te ronden.", "Nieuw e-mailadres bevestigen", "Heb je hier niet om gevraagd? Dan kun je deze e-mail negeren en blijft je adres hetzelfde."],
    de: ["Bestätige deine neue E-Mail-Adresse für Endless Lingle", "Bestätige die Änderung deiner E-Mail-Adresse bei Endless Lingle.", "Bestätige deine neue E-Mail-Adresse", "Du möchtest deine E-Mail-Adresse von <strong>{{ .Email }}</strong> zu <strong>{{ .NewEmail }}</strong> ändern. Bestätige die Änderung, um sie abzuschließen.", "Neue E-Mail-Adresse bestätigen", "Wenn du das nicht angefordert hast, kannst du diese E-Mail ignorieren. Deine Adresse bleibt dann unverändert."],
    fr: ["Confirmez votre nouvel e-mail pour Endless Lingle", "Confirmez le changement de votre adresse e-mail Endless Lingle.", "Confirmez votre nouvel e-mail", "Vous avez demandé à changer votre e-mail de <strong>{{ .Email }}</strong> à <strong>{{ .NewEmail }}</strong>. Confirmez le changement pour terminer.", "Confirmer le nouvel e-mail", "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre adresse ne changera pas."],
    es: ["Confirma tu nuevo correo para Endless Lingle", "Confirma el cambio de tu correo en Endless Lingle.", "Confirma tu nuevo correo", "Pediste cambiar tu correo de <strong>{{ .Email }}</strong> a <strong>{{ .NewEmail }}</strong>. Confirma el cambio para terminar.", "Confirmar nuevo correo", "Si no lo pediste, puedes ignorar este correo y tu dirección seguirá igual."],
  },
  "reset-password": {
    en: ["Reset your Endless Lingle password", "Use this link to choose a new password.", "Reset your password", "We got a request to reset the password for your account. Use the button below to choose a new one.", "Choose new password", "If you didn't ask for this, you can ignore this email and your password stays the same."],
    nl: ["Herstel je wachtwoord voor Endless Lingle", "Gebruik deze link om een nieuw wachtwoord te kiezen.", "Herstel je wachtwoord", "We kregen een verzoek om het wachtwoord van je account te herstellen. Kies een nieuw wachtwoord met de knop hieronder.", "Nieuw wachtwoord kiezen", "Heb je hier niet om gevraagd? Dan kun je deze e-mail negeren en blijft je wachtwoord hetzelfde."],
    de: ["Setze dein Passwort für Endless Lingle zurück", "Wähle mit diesem Link ein neues Passwort.", "Passwort zurücksetzen", "Wir haben eine Anfrage erhalten, das Passwort für dein Konto zurückzusetzen. Wähle mit dem Button unten ein neues.", "Neues Passwort wählen", "Wenn du das nicht angefordert hast, kannst du diese E-Mail ignorieren. Dein Passwort bleibt dann unverändert."],
    fr: ["Réinitialisez votre mot de passe Endless Lingle", "Utilisez ce lien pour choisir un nouveau mot de passe.", "Réinitialisez votre mot de passe", "Nous avons reçu une demande de réinitialisation du mot de passe de votre compte. Utilisez le bouton ci-dessous pour en choisir un nouveau.", "Choisir un mot de passe", "Si vous n'êtes pas à l'origine de cette demande, ignorez cet e-mail : votre mot de passe ne changera pas."],
    es: ["Restablece tu contraseña de Endless Lingle", "Usa este enlace para elegir una contraseña nueva.", "Restablece tu contraseña", "Recibimos una solicitud para restablecer la contraseña de tu cuenta. Usa el botón de abajo para elegir una nueva.", "Elegir nueva contraseña", "Si no lo pediste, puedes ignorar este correo y tu contraseña seguirá igual."],
  },
  reauthentication: {
    en: ["Your Endless Lingle verification code", "Enter this code to confirm it's you.", "Confirm it's you", "Enter this code to continue.", null, "If you didn't ask for this code, you can ignore this email."],
    nl: ["Je verificatiecode voor Endless Lingle", "Voer deze code in om te bevestigen dat jij het bent.", "Bevestig dat jij het bent", "Voer deze code in om verder te gaan.", null, "Heb je deze code niet aangevraagd? Dan kun je deze e-mail negeren."],
    de: ["Dein Bestätigungscode für Endless Lingle", "Gib diesen Code ein, um zu bestätigen, dass du es bist.", "Bestätige, dass du es bist", "Gib diesen Code ein, um fortzufahren.", null, "Wenn du diesen Code nicht angefordert hast, kannst du diese E-Mail ignorieren."],
    fr: ["Votre code de vérification Endless Lingle", "Saisissez ce code pour confirmer qu'il s'agit bien de vous.", "Confirmez qu'il s'agit de vous", "Saisissez ce code pour continuer.", null, "Si vous n'avez pas demandé ce code, vous pouvez ignorer cet e-mail."],
    es: ["Tu código de verificación de Endless Lingle", "Introduce este código para confirmar que eres tú.", "Confirma que eres tú", "Introduce este código para continuar.", null, "Si no pediste este código, puedes ignorar este correo."],
  },
};

const text = (size, color, extra = "") =>
  `color:${color};font-family:${FONT};font-size:${size}px;${extra}`;

function action(button, lang) {
  if (button === null) {
    return `          <tr>
            <td align="center" style="padding:24px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${C.code}" style="padding:14px 24px;background-color:${C.code};border-radius:8px;${text(28, C.text, "font-weight:700;letter-spacing:6px;line-height:34px;")}">{{ .Token }}</td>
                </tr>
              </table>
            </td>
          </tr>`;
  }
  return `          <tr>
            <td align="center" style="padding:24px 32px 0;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td align="center" bgcolor="${C.button}" style="background-color:${C.button};border-radius:8px;">
                    <a href="{{ .ConfirmationURL }}" style="display:inline-block;padding:14px 32px;${text(16, "#ffffff", "font-weight:600;line-height:20px;text-decoration:none;border-radius:8px;")}">${button}</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding:24px 32px 0;${text(13, C.muted, "line-height:20px;")}">
              ${COMMON[lang].fallback}<br>
              <a href="{{ .ConfirmationURL }}" style="color:${C.text};word-break:break-all;">{{ .ConfirmationURL }}</a>
            </td>
          </tr>`;
}

function page(lang, [title, preheader, heading, body, button, note]) {
  const home = `{{ .SiteURL }}${COMMON[lang].path}`;
  return `<!doctype html>
<html lang="${lang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="dark">
  <meta name="supported-color-schemes" content="dark">
  <title>${title}</title>
  <style>:root { color-scheme: dark; supported-color-schemes: dark; }</style>
</head>
<body style="margin:0;padding:0;background-color:${C.page};">
  <div style="display:none;max-height:0;overflow:hidden;opacity:0;color:${C.page};">${preheader}</div>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.page}" style="background-color:${C.page};">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${C.card}" style="width:100%;max-width:480px;background-color:${C.card};border:1px solid ${C.border};border-radius:10px;">
          <tr>
            <td align="center" style="padding:32px 32px 0;">
              <a href="${home}" style="text-decoration:none;">
                <img src="{{ .SiteURL }}/logo.png" width="64" height="64" alt="Endless Lingle" style="display:block;width:64px;height:64px;border:0;${text(18, C.text, "font-weight:700;")}">
              </a>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:24px 32px 0;${text(24, C.text, "font-weight:700;letter-spacing:-0.3px;line-height:30px;")}">${heading}</td>
          </tr>
          <tr>
            <td align="center" style="padding:12px 32px 0;${text(16, C.text, "line-height:24px;")}">${body}</td>
          </tr>
${action(button, lang)}
          <tr>
            <td style="padding:24px 32px 32px;${text(13, C.muted, "line-height:20px;")}">${note}</td>
          </tr>
        </table>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="width:100%;max-width:480px;">
          <tr>
            <td align="center" style="padding:16px 32px 0;${text(12, C.muted, "line-height:18px;")}">
              <a href="${home}" style="color:${C.muted};text-decoration:underline;">Endless Lingle</a>, ${COMMON[lang].tagline}
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

const OTHER_LANGUAGES = ["nl", "de", "fr", "es"];
mkdirSync(new URL("../supabase/email-templates/", import.meta.url), { recursive: true });

for (const [name, languages] of Object.entries(TEMPLATES)) {
  // "with" skips a missing locale, so eq never compares against nothing.
  const branches = OTHER_LANGUAGES.map(
    (lang, i) => `{{ ${i === 0 ? "if" : "else if"} eq $lang "${lang}" }}\n${page(lang, languages[lang])}\n`,
  ).join("");
  const file = `{{ $lang := "en" }}{{ with .Data.locale }}{{ $lang = . }}{{ end }}\n${branches}{{ else }}\n${page("en", languages.en)}\n{{ end }}\n`;
  writeFileSync(new URL(`../supabase/email-templates/${name}.html`, import.meta.url), file);
}
console.log(`Wrote ${Object.keys(TEMPLATES).length} templates.`);
