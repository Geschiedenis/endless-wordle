# Email templates

Paste each file into its template in Supabase under **Authentication > Emails**, using the **Source** tab, and set the matching subject. Supabase fills in the `{{ .Value }}` placeholders when it sends the email, so keep them as they are.

| Supabase template | File | Subject | Sent by the app today |
| --- | --- | --- | --- |
| Confirm sign up | `confirm-sign-up.html` | Confirm your email for Endless Wordle | Yes |
| Reset password | `reset-password.html` | Reset your Endless Wordle password | Yes |
| Invite user | `invite-user.html` | You're invited to Endless Wordle | Only if invited from the Supabase dashboard |
| Magic link or OTP | `magic-link.html` | Your Endless Wordle login link | No |
| Change email address | `change-email.html` | Confirm your new email for Endless Wordle | No |
| Reauthentication | `reauthentication.html` | Your Endless Wordle verification code | No |

Colours match the dark theme in `src/app/globals.css`. If those change, update the templates by hand: email clients don't support CSS variables, so every style is written inline.

The logo loads from `{{ .SiteURL }}/logo.png`, so Supabase's Site URL must be your live site, with that file deployed. It won't show in emails while the Site URL is localhost.
