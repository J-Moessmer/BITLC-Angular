# Arbeitsplan (workplan.md)

Dieses Dokument erfasst die durchgeführten Arbeitsschritte, Entscheidungen und anstehende Aufgaben für das Repository.

---

## 1. Abgeschlossene Aufgaben

- [x] **Analyse der Handzeichnung**
  - Identifikation aller Kernkomponenten (Kopfzeile mit Suche, Sidebar links, Content-Bereich mit interaktiver Karte & Steckbrief "Vogel des Monats", Footer mit Impressum & Über uns).
- [x] **Initialer Prototyp ([`vogel-atlas-html/index.html`](file:///c:/Users/Jmoessmer/Documents/_GITHUB_Repos/BITLC-Angular/vogel-atlas-html/index.html))**
  - Umsetzung der Benutzeroberfläche in HTML mit Inline-SVG für Karte und Ente.
- [x] **Strukturierung in Monorepo-Unterordner**
  - Erstellung des Unterordners `vogel-atlas-html/`.
  - Entfernung von `index.html` aus dem Root-Verzeichnis zugunsten sauber getrennter Projekte.
- [x] **Dokumentation & Anleitungen**
  - Erstellung der zentralen [`README.md`](file:///c:/Users/Jmoessmer/Documents/_GITHUB_Repos/BITLC-Angular/README.md) mit Inhaltsverzeichnis (TOC), Mermaid-Diagrammen, Code-Beispielen und GitHub-Pages-Anleitung.
  - Erstellung der Unterprojekt-Dokumentation [`vogel-atlas-html/README.md`](file:///c:/Users/Jmoessmer/Documents/_GITHUB_Repos/BITLC-Angular/vogel-atlas-html/README.md).
- [x] **Refactoring auf reines HTML (Zero-CSS / Zero-JS)**
  - Vollständiges Entfernen des `<style>`-Blocks und aller CSS-Klassen.
- [x] **Linter- und Validierungs-Bereinigung**
  - Behebung von 40 Problemen:
    - HTML: Veraltete Attribute (`width`, `align`, `valign`) entfernt, Tabellenzeilen mit `<tbody>` umschlossen, Trailing Whitespace entfernt.
    - Markdown: Formatierungsregeln für Überschriften, Listen und Code-Blöcke korrigiert.
- [x] **Agenten-Infrastruktur**
  - Anlage des `.agents/`-Ordners mit `agents.md`, `context.md` und `workplan.md`.
- [x] **Transparenz & KI-Kennzeichnung**
  - Richtlinie in `agents.md` aufgenommen.
  - Header-Kommentar mit Ersteller- und KI-Angaben in allen Codedateien eingefügt.
- [x] **Layout-Konsistenz, Breadcrumbs & Template-Erstellung**
  - Links-bündige Breadcrumb-Navigation unter der Kopfzeile in `vogel-atlas-html/index.html` eingefügt.
  - Wiederverwendbare [`vogel-atlas-html/template.html`](file:///c:/Users/Jmoessmer/Documents/_GITHUB_Repos/BITLC-Angular/vogel-atlas-html/template.html) mit fixem Header, Breadcrumb, Sidebar und Footer sowie markiertem austauschbaren Content-Block (`<main>`) erstellt.

---

## 2. Offene & Zukünftige Aufgaben (Backlog)

- [x] **GitHub Pages Deployment aktivieren**
  - Repository-Einstellungen auf GitHub (`Settings > Pages`) auf `main` branch und `/ (root)` setzen.
- [ ] **Weitere Teilprojekte anlegen**
  - Z. B. Angular-Lernprojekte oder interaktive Webanwendungen jeweils in eigenen Unterordnern ergänzen.
- [ ] **Erweiterung des Vogel-Atlas (Optional)**
  - Detailseiten oder Unterseiten für die einzelnen Regionen (Nord, West, Ost, Süd) und weitere Vogelarten anlegen.
