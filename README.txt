# Admin Console (Drop-in)
Fügt deinem Projekt eine komplette Admin-Konsole hinzu (gleicher Stil: Karten, runde Ecken).

## Inhalt
- app/admin/page.tsx (Liste + Einbindung CaseRow)
- app/admin/_components/CaseRow.tsx (Inline-Dropdowns, Notes, Soft-Delete)
- app/admin/layout.tsx
- app/api/admin/cases/[id]/metadata/route.ts (nur Metadaten – **niemals** Status!)
- lib/supabaseServer.ts, lib/supabaseService.ts
- 001_add_admin_metadata_columns.sql (Supabase Migration)

## Installation (GitHub Web, ohne Terminal)
1) In deinem Repo einen Branch erstellen: `feat-admin-console`.
2) **Add file → Upload files** → ENTSPRECHENDE Ordner & Dateien aus diesem Paket hochladen (nicht den Ordner selbst).
3) Commit to `feat-admin-console`.
4) **Compare & pull request** → Vercel Preview testen.
5) Merge → live.

## Supabase
- SQL Editor → Datei `001_add_admin_metadata_columns.sql` Inhalt einfügen → RUN.
- In Vercel ENV setzen: `SUPABASE_SERVICE_ROLE_KEY`.

## Wichtig
- Dein bestehender **Status-Update-Flow** bleibt unberührt (Mail-Trigger bleibt).
- Die neue API aktualisiert **nur**: digital_diplo_status, twofa_email_status, health_insurance, work_checks, internal_notes, quick_notes, deleted_at.
