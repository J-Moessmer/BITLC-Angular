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

### VogelFinder – Vogel Atlas Deutschland (`/vogel-atlas-html`)

- **Status:** Großteils fertiggestellt (vollständige Multi-Page-Website).
- **Entstehungsursprung:** Physische Handskizze mit Header (Titel + Suche), Sidebar (Navigation, Über uns, Impressum), interaktiver Deutschlandkarte und Steckbrief ("Vogel des Monats").
- **Technischer Stack:**
  - Reines, semantisches HTML5 (ohne CSS, ohne JavaScript).
  - Bilder: Vogelfotos (JPG), Illustrationen (PNG) und GIFs im Ordner `Assets/`.
  - Inline-SVG für die interaktive Deutschlandkarte (Startseite).
  - Tabellenlayout mit `<tbody>` für die Grundanordnung.
- **Umfang (18 HTML-Seiten):**
  - 1 Startseite (`index.html`) mit SVG-Karte, Vogel des Monats, Blog-Vorschau und Spendenaufruf.
  - 1 Übersichtsseite aller Vögel (`Alle_voegel.html`) als Bildergalerie.
  - 8 Vogel-Steckbriefe (`Vogel_*.html`): Amsel, Halsbandsittich, Haussperling, Kohlmeise, Nebelkrähe, Rotkehlchen, Steinadler, Uferschnepfe.
  - 4 Regionsseiten (`Gebiet_*.html`): Nord, West, Ost, Süd – jeweils mit regionaler Vogelauswahl.
  - 1 Blog-Seite (`Blog.html`) mit 3 Artikeln (Kranich-Herbstzug, Gartenvielfalt, KI-Update).
  - 1 Spendenseite (`Spenden.html`), 1 Siehe-Auch-Seite, 1 Datenschutz/Impressum-Seite.
  - 1 wiederverwendbare Seitenvorlage (`template.html`) mit Header, Breadcrumb, Sidebar und Footer.
- **Assets:** 12 Mediendateien (9 Vogelfotos JPG, 1 Illustration PNG, 2 GIFs).
- **Validierungs-Status:** Grundlegendes HTML ist valide; einige Unterseiten verwenden bewusst vereinfachte Attribute für das Tabellenlayout.

---

## 3. Dateisystem-Übersicht

```text
BITLC-Angular/
├── .agents/
│   ├── agents.md                     # Agenten-Richtlinien & Verhaltensregeln
│   ├── context.md                    # Projekt-Kontext & Historie (dieses Dokument)
│   └── workplan.md                   # Historischer und zukünftiger Arbeitsplan
├── .vscode/
│   └── settings.json                 # Workspace-Einstellungen
├── index.html                        # Root-Weiterleitung → vogel-atlas-html/
├── vogel-atlas-html/
│   ├── Assets/                       # 12 Mediendateien (Fotos, GIFs, PNGs)
│   ├── index.html                    # Startseite mit SVG-Karte & Vogel des Monats
│   ├── Alle_voegel.html              # Alle Vögel (Bildergalerie)
│   ├── Vogel_Amsel.html              # Steckbrief: Amsel
│   ├── Vogel_Halsbandsittich.html    # Steckbrief: Halsbandsittich
│   ├── Vogel_Haussperling.html       # Steckbrief: Haussperling
│   ├── Vogel_Kohlmeise.html          # Steckbrief: Kohlmeise
│   ├── Vogel_Nebelkraehe.html        # Steckbrief: Nebelkrähe
│   ├── Vogel_Rotkehlchen.html        # Steckbrief: Rotkehlchen
│   ├── Vogel_Steinadler.html         # Steckbrief: Steinadler
│   ├── Vogel_Uferschnepfe.html       # Steckbrief: Uferschnepfe
│   ├── Gebiet_nord.html              # Region: Norddeutschland
│   ├── Gebiet_west.html              # Region: Westdeutschland
│   ├── Gebiet_ost.html               # Region: Ostdeutschland
│   ├── Gebiet_Sued.html              # Region: Süddeutschland
│   ├── Blog.html                     # Blog mit 3 Artikeln
│   ├── Spenden.html                  # Spendenseite
│   ├── Siehe Auch.html               # Weiterführende Links
│   ├── Datenschutzimpressum.html     # Impressum & Datenschutz
│   ├── template.html                 # Wiederverwendbare Seitenvorlage
│   └── README.md                     # Unterprojekt-Dokumentation
└── README.md                         # Root-Dokumentation
```
