# Kontext-Dokumentation (context.md)

Dieses Dokument bietet einen schnellen Überblick über den aktuellen Zustand, die Historie und den technischen Kontext des Repositories.

---

## 1. Projekt-Überblick

- **Repository:** `BITLC-Angular`
- **Besitzer:** `J-Moessmer`
- **Remote-URL:** `https://github.com/J-Moessmer/BITLC-Angular.git`
- **Zweck:** Sammlung von Lern-, Übungs- und Prototyp-Projekten im Webbereich (vom Basis-HTML-Prototyp bis zu Angular-Applikationen).

---

## 2. Aktive Teilprojekte

### Vogel Atlas Deutschland (`/vogel-atlas-html`)

- **Status:** Abgeschlossen (Prototyp).
- **Entstehungsursprung:** Physische Handskizze mit Header (Titel + Suche), Sidebar (Navigation, Über uns, Impressum), interaktiver Deutschlandkarte und Steckbrief ("Vogel des Monats: Stockente").
- **Technischer Stack:**
  - Reines, semantisches HTML5 (ohne CSS, ohne JavaScript).
  - Vektor-Grafiken in nativem Inline-SVG (Deutschlandkarte & Stockente-Illustration).
  - Standard-Tabellenlayout mit `<tbody>` für die Grundanordnung.
- **Validierungs-Status:** 0 Fehler / 0 Warnungen in VS Code HTML- und Markdown-Lintern.

---

## 3. Dateisystem-Übersicht

```text
BITLC-Angular/
├── .agents/
│   ├── agents.md          # Agenten-Richtlinien & Verhaltensregeln
│   ├── context.md         # Projekt-Kontext & Historie (dieses Dokument)
│   └── workplan.md        # Historischer und zukünftiger Arbeitsplan
├── .vscode/
│   └── settings.json      # Workspace-Einstellungen
├── vogel-atlas-html/
│   ├── README.md          # Projektspezifische Dokumentation
│   └── index.html         # Valider HTML5-Code des Vogel-Atlas
└── README.md              # Root-Dokumentation mit Projekt-Übersicht & GitHub Pages Setup
```
