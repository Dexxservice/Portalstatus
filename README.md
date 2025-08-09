# Dexx Visa Status Portal — Prebuilt

Fertig vorbereitete App (Next.js 14 + Supabase). Du lädst nur noch die .env-Werte aus Supabase/Resend ein und deployst.

## Schnellstart

1) **Dateien**: Dieses Projekt als ZIP hochladen (GitHub) oder direkt bei **Vercel** importieren.
2) **Umgebungsvariablen** (Vercel → Settings → Environment Variables):
   - `NEXT_PUBLIC_SUPABASE_URL` — aus Supabase (Project Settings → API)
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` — aus Supabase
   - `NEXT_PUBLIC_APP_NAME` — z.B. "Dexx Visa Service GmbH"
   - `NEXT_PUBLIC_WHATSAPP_NUMBER` — (optional, für Anzeige)
   - `RESEND_API_KEY` — aus Resend
   - `RESEND_FROM` — z.B. `Visa Status <visa-status@dexpersonalvermittlung.de>`
   - `WEBHOOK_SECRET` — ein eigenes geheimes Passwort (frei wählen)

3) **Supabase – Tabellen & Trigger**:
   - In Supabase SQL-Editor `sql/schema.sql` ausführen.
   - **Database Webhook** erstellen (Supabase → Database → Webhooks):
     - Events: `UPDATE` auf Tabelle `cases` nur wenn Spalte `status` sich ändert.
     - URL: `https://<deine-vercel-domain>/api/status-webhook`
     - Secret: exakt `WEBHOOK_SECRET` (wie in Vercel gesetzt).

4) **Resend**:
   - Domain verifizieren (damit `visa-status@dexpersonalvermittlung.de` als Absender erlaubt ist).

5) **Start lokal (optional)**:
```bash
npm install
npm run dev
# dann Browser: http://localhost:3000
```

---

## Struktur

- `components/Header.tsx` — Kopfzeile mit Logo/Name.
- `components/StatusCard.tsx` — Anzeige aktueller Status + Nächster Schritt + ETA.
- `lib/supabaseClient.ts` — verbindet sich mit Supabase (URL/Key aus ENV).
- `lib/statusCatalog.ts` — vordefinierte Status inkl. deutscher Texte/ETA.
- `pages/index.tsx` — Beispiel-Startseite.
- `pages/api/status-webhook.ts` — empfängt Supabase Webhook und versendet E-Mail via Resend.
- `sql/schema.sql` — Tabellen + Beispiel-Daten.

> Hinweis: Passe die Statusbezeichnungen/ETA im `statusCatalog.ts` oder in der DB nach Bedarf an.
