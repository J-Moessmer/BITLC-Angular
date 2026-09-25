# AGENTS.md

Dieses Dokument definiert Richtlinien, Konventionen und Arbeitsanweisungen für KI-Agenten, die an diesem Repository arbeiten.

---

## 1. Rollenverständnis & Prinzipien

- **Rolle:** Unterstützender Pair-Programming- und Fullstack-Agent für Webprojekte (von nativem HTML bis hin zu Angular-Anwendungen).
- **Philosophie:**
  - Halte Änderungen minimal und fokussiert auf die konkrete Aufgabenstellung.
  - Befolge explizite Einschränkungen streng (z. B. "Reines HTML ohne CSS und ohne JS" bedeutet keine Stylesheets, keine Inline-Styles und keine Skripte).
  - Codequalität: Produziere stets valides, fehlerfreies Markup ohne Warnungen (0 Linter-Fehler für HTML und Markdown).

---

## 2. Transparenz & KI-Kennzeichnung (Guideline)

Aus Gründen der Offenheit und Nachvollziehbarkeit muss jeglicher von oder mit KI generierte Code transparent gekennzeichnet werden:

1. **Datei-Header (Kommentar am Anfang jeder Codedatei):**
   - Jede Quellcodedatei (z. B. HTML, CSS, TypeScript, JavaScript), die von einer KI erstellt oder maßgeblich mitgestaltet wurde, muss einen Header-Kommentar mit folgenden Angaben enthalten:
     - **Projekt / Modul:** Name der Komponente bzw. des Unterprojekts
     - **Erstellt mit:** KI-Assistent (z. B. *Antigravity AI / Pair-Programming Agent*)
     - **Erstellt für / Autor:** Name des Entwicklers (z. B. *J-Moessmer*)
     - **Datum / Version:** Erstellungs- oder Änderungsdatum
     - **Hinweis:** Kurzer Hinweis zur KI-Unterstützung (z. B. *"Generiert auf Basis einer Handskizze"*).
2. **Inline-Kommentare bei KI-generierten Teilblöcken:**
   - Größere, spezifische KI-generierte Logikblöcke oder Vektor-Grafiken (z. B. SVG-Geometrien) sollen durch Kommentare kenntlich gemacht werden.

---

## 3. Architektur & Repository-Regeln

1. **Monorepo / Multi-Projekt-Struktur:**
   - Jedes Teilprojekt oder jede Übung erhält einen eigenen, sprechenden Unterordner (z. B. `vogel-atlas-html/`).
   - Jedes Unterprojekt enthält eine eigene `README.md` mit Inhaltsverzeichnis, Architektur-Diagrammen (`mermaid`) und Codebeispielen.
   - Das Root-Verzeichnis enthält keine spezifischen App-HTML-Dateien, sondern dient als Einstiegspunkt mit der zentralen `README.md` und einer Weiterleitung (`index.html`).
2. **Template-System (vogel-atlas-html):**
   - Neue Unterseiten im VogelFinder sollen auf Basis der `template.html` erstellt werden.
   - Jede Seite erhält den einheitlichen Header mit Suchfeld, Breadcrumb-Navigation, Sidebar und Footer.
   - Breadcrumbs: Startseite → ggf. Zwischenebene → Aktuelle Seite.
   - Die Sidebar-Navigation muss auf allen Seiten identisch sein (Alle Vögel, Vogelkarte, Blog, Siehe auch, Spenden).
3. **Asset-Verwaltung:**
   - Bilder und Medien liegen im Ordner `Assets/` innerhalb des jeweiligen Unterprojekts.
   - Bilddateien verwenden beschreibende Dateinamen und werden relativ referenziert (z. B. `Assets/Common_Blackbird.jpg`).
4. **Dokumentations-Standards:**
   - Alle Markdown-Dateien müssen `markdownlint`-konform sein:
     - Leerzeilen um Überschriften (`MD022`)
     - Leerzeilen um Listen (`MD032`)
     - Leerzeilen und Sprachkennzeichnung bei Code-Blocks (`MD031`, `MD040`)
     - Keine Doppelpunkte am Ende von Überschriften (`MD026`)
5. **HTML-Standards:**
   - Valides HTML5.
   - Keine veralteten Attribute verwenden (z. B. kein `width`, `align`, `valign`, `bgcolor` auf HTML-Tags).
   - Tabellenzeilen (`<tr>`) immer in `<tbody>`, `<thead>` oder `<tfoot>` kapseln.
   - Keine Trailing Whitespaces.

---

## 4. Deployment & CI/CD Konventionen

- Das Projekt nutzt **GitHub Pages** für die Direktansicht von Webanwendungen.
- Unterprojekte sind über `https://<owner>.github.io/<repo>/<subproject-folder>/` direkt erreichbar.
- Die Root-`index.html` leitet automatisch zum aktiven Unterprojekt weiter.
