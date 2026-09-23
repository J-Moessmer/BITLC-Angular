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

## 2. Architektur & Repository-Regeln

1. **Monorepo / Multi-Projekt-Struktur:**
   - Jedes Teilprojekt oder jede Übung erhält einen eigenen, sprechenden Unterordner (z. B. `vogel-atlas-html/`).
   - Jedes Unterprojekt enthält eine eigene `README.md` mit Inhaltsverzeichnis, Architektur-Diagrammen (`mermaid`) und Codebeispielen.
   - Das Root-Verzeichnis enthält keine spezifischen App-HTML-Dateien, sondern dient als Einstiegspunkt mit der zentralen `README.md`.
2. **Dokumentations-Standards:**
   - Alle Markdown-Dateien müssen `markdownlint`-konform sein:
     - Leerzeilen um Überschriften (`MD022`)
     - Leerzeilen um Listen (`MD032`)
     - Leerzeilen und Sprachkennzeichnung bei Code-Blocks (`MD031`, `MD040`)
     - Keine Doppelpunkte am Ende von Überschriften (`MD026`)
3. **HTML-Standards:**
   - Valides HTML5.
   - Keine veralteten Attribute verwenden (z. B. kein `width`, `align`, `valign`, `bgcolor` auf HTML-Tags).
   - Tabellenzeilen (`<tr>`) immer in `<tbody>`, `<thead>` oder `<tfoot>` kapseln.
   - Keine Trailing Whitespaces.

---

## 3. Deployment & CI/CD Konventionen

- Das Projekt nutzt **GitHub Pages** für die Direktansicht von Webanwendungen.
- Unterprojekte sind über `https://<owner>.github.io/<repo>/<subproject-folder>/` direkt erreichbar.
