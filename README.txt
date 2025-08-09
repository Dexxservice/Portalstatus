# Admin Console (no-conflict)
Neue Admin-Konsole unter `/admin-console`, damit kein Konflikt mit `pages/admin.tsx` entsteht.

## Inhalt
- app/admin-console/... (UI)
- app/api/admin/cases/[id]/metadata/route.ts (API für Metadaten, ändert NIE den status)
- lib/... (Supabase-Helper)
- 001_add_admin_metadata_columns.sql (SQL Migration)

## Einbau (GitHub Web)
1) Branch `test` weiter verwenden oder neuen Branch `feat-admin-console` erstellen.
2) Add file → Upload files → **entpackten** Inhalt dieses Pakets hochladen (nicht den Ordner selbst).
3) Commit.
4) Pull Request öffnen → Vercel Preview testen → Seite `/admin-console` aufrufen.
5) Wenn ok → Merge.

## Supabase
- SQL Editor → Inhalt aus `001_add_admin_metadata_columns.sql` ausführen.
- In Vercel ENV: `SUPABASE_SERVICE_ROLE_KEY` setzen (Service-Role-Key).

## Wichtig
- Dein bestehender `/admin` bleibt und triggert weiter E-Mails beim Statuswechsel.
- Neue Konsole speichert nur Metadaten (Diplo, 2FA, Health, Work, Notes, Soft-Delete).
