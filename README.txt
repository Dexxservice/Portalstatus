# Admin Upgrade Pack (Drop-in)
**Ändert NICHT deinen Status/E-Mail-Flow.** Neue Felder laufen über eigene API.

## Dateien
- `001_add_admin_metadata_columns.sql` – Supabase Migration
- `lib/caseEnums.ts`
- `lib/supabaseServer.ts`
- `lib/supabaseService.ts`
- `app/api/admin/cases/[id]/metadata/route.ts`
- `app/admin/_components/CaseRow.tsx`

## Einbau – einfach (GitHub Webseite)
1. Öffne dein GitHub-Repo. Oben links: **Branch** → gib ein `feat-admin-upgrades` → **Create branch**.
2. Klick **Add file** → **Upload files**. Lade **ALLE Dateien** aus diesem Ordner hoch (gleiche Ordnerstruktur).
3. Unten **Commit** (to `feat-admin-upgrades`).
4. Klick auf **Compare & pull request** → es öffnet sich ein PR.
5. Vercel baut eine **Preview**-URL (steht im PR). Teste dort alles.
6. Wenn ok: **Merge pull request** → **Confirm**. Vercel deployt live.

## Supabase
- Öffne SQL Editor → füge den Inhalt von `001_add_admin_metadata_columns.sql` ein → **Run**.
- Setze in Vercel ENV: `SUPABASE_SERVICE_ROLE_KEY`.

## Admin-Seite verbinden
- In deiner Admin-Liste füge pro Zeile den `CaseRow`-Import ein und übergib `item` (mit Feldern: id, email, status, updated_at, digital_diplo_status, twofa_email_status, health_insurance, work_checks).
- Dein **Status-Dropdown** bleibt wie bisher (Mail-Trigger).

Fertig!
