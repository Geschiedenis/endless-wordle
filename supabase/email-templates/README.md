# Email templates

Paste each file into its template in Supabase under **Authentication > Emails**, using the **Source** tab, and set the matching subject. Supabase fills in the `{{ .Value }}` placeholders when it sends the email, so keep them as they are.

| Supabase template | File | Subject | Sent by the app today |
| --- | --- | --- | --- |
| Confirm sign up | `confirm-sign-up.html` | Confirm your email for Endless Lingle | Yes |
| Reset password | `reset-password.html` | Reset your Endless Lingle password | Yes |
| Invite user | `invite-user.html` | You're invited to Endless Lingle | Only if invited from the Supabase dashboard |
| Magic link or OTP | `magic-link.html` | Your Endless Lingle login link | No |
| Change email address | `change-email.html` | Confirm your new email for Endless Lingle | No |
| Reauthentication | `reauthentication.html` | Your Endless Lingle verification code | No |

Each file holds all five languages. Supabase has one template per email type, so the template picks a language from the one stored on the account at sign-up (`{{ .Data.locale }}`). Accounts created before languages existed get English. The subjects above are English only.

The files are generated, so don't edit them by hand. Change the text or colours in [`scripts/build-email-templates.mjs`](../../scripts/build-email-templates.mjs) and run `node scripts/build-email-templates.mjs`. Colours match the dark theme in `src/app/globals.css`.

The logo loads from `{{ .SiteURL }}/logo.png`, so Supabase's Site URL must be your live site, with that file deployed, and without a trailing slash. It won't show in emails while the Site URL is localhost.
