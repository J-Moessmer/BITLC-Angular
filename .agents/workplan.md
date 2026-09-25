# Arbeitsplan (workplan.md)

Dieses Dokument erfasst die durchgeführten Arbeitsschritte, Entscheidungen und anstehende Aufgaben für das Repository.

---

## 1. Abgeschlossene Aufgaben

- [x] **Analyse der Handzeichnung**
  - Identifikation aller Kernkomponenten (Kopfzeile mit Suche, Sidebar links, Content-Bereich mit interaktiver Karte & Steckbrief "Vogel des Monats", Footer mit Impressum & Über uns).
- [x] **Initialer Prototyp (`vogel-atlas-html/index.html`)**
  - Umsetzung der Benutzeroberfläche in HTML mit Inline-SVG für die Deutschlandkarte.
- [x] **Strukturierung in Monorepo-Unterordner**
  - Erstellung des Unterordners `vogel-atlas-html/`.
  - Root-Weiterleitung (`index.html`) für GitHub Pages eingerichtet.
- [x] **Dokumentation & Anleitungen**
  - Erstellung der zentralen `README.md` mit Inhaltsverzeichnis (TOC), Mermaid-Diagrammen, Code-Beispielen und GitHub-Pages-Anleitung.
  - Erstellung der Unterprojekt-Dokumentation `vogel-atlas-html/README.md`.
- [x] **Refactoring auf reines HTML (Zero-CSS / Zero-JS)**
  - Vollständiges Entfernen des `<style>`-Blocks und aller CSS-Klassen.
- [x] **Linter- und Validierungs-Bereinigung**
  - Behebung von 40 Problemen: HTML-Attribute, `<tbody>`-Kapseln, Trailing Whitespace, Markdown-Formatierung.
- [x] **Agenten-Infrastruktur**
  - Anlage des `.agents/`-Ordners mit `agents.md`, `context.md` und `workplan.md`.
- [x] **Transparenz & KI-Kennzeichnung**
  - Richtlinie in `agents.md` aufgenommen.
  - Header-Kommentar mit Ersteller- und KI-Angaben in allen Codedateien eingefügt.
- [x] **Layout-Konsistenz, Breadcrumbs & Template-Erstellung**
  - Linksbündige Breadcrumb-Navigation in allen Seiten.
  - Wiederverwendbare `template.html` mit fixem Header, Breadcrumb, Sidebar und Footer.
- [x] **Alle-Vögel-Übersicht (`Alle_voegel.html`)**
  - Bildergalerie mit 8 Vogelarten als verlinkte Kacheln (4×2 Raster).
- [x] **8 Vogel-Steckbriefe erstellt**
  - Individuelle Detailseiten mit Foto und Beschreibung für: Amsel, Halsbandsittich, Haussperling, Kohlmeise, Nebelkrähe, Rotkehlchen, Steinadler, Uferschnepfe.
- [x] **4 Regionsseiten erstellt**
  - `Gebiet_nord.html`, `Gebiet_west.html`, `Gebiet_ost.html`, `Gebiet_Sued.html` – jeweils mit regionaler Vogelauswahl als Bildergalerie.
- [x] **Blog-Seite (`Blog.html`)**
  - 3 Blogartikel mit Bildern: Kranich-Herbstzug, Gartenvielfalt, VogelFinder-KI-Update.
- [x] **Weitere Inhaltsseiten**
  - Spendenseite (`Spenden.html`), Siehe-Auch-Seite (`Siehe Auch.html`), Datenschutz & Impressum (`Datenschutzimpressum.html`).
- [x] **Asset-Integration**
  - 12 Mediendateien im `Assets/`-Ordner: 9 Vogelfotos (JPG), 1 Illustration (PNG), 2 GIFs.
  - Vogel des Monats auf der Startseite mit echtem Foto (Halsbandsittich) statt Inline-SVG.
- [x] **GitHub Pages Deployment aktiviert**
  - Repository über `https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-html/` erreichbar.
- [x] **Dokumentations-Update (September 2026)**
  - README-Dateien und `.agents/`-Dokumente an den finalen Projektstand angepasst.

---

## 2. Offene & Zukünftige Aufgaben (Backlog)

- [ ] **Weitere Teilprojekte anlegen**
  - Z. B. Angular-Lernprojekte oder interaktive Webanwendungen jeweils in eigenen Unterordnern ergänzen.
- [ ] **Optionale Erweiterungen des VogelFinder**
  - Weitere Vogelarten und Steckbriefe ergänzen.
  - Regionsseiten mit detaillierteren Beschreibungen und Lebensräumen ausbauen.
  - Saisonale Aktualisierung des „Vogel des Monats".
