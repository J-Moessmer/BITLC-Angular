# VogelFinder – HTML + CSS-Übung

Diese Version ist die Weiterentwicklung meiner ersten VogelFinder-Übung. Die HTML5-Seiten wurden um ein gemeinsames Stylesheet ergänzt, damit die Website übersichtlicher und responsiv gestaltet ist.

## Startseite

Die Website startet mit [index.html](./index.html). Die zentrale [Projekt-Landingpage](../index.html) verlinkt auf diese HTML+CSS-Version.

## Änderungen gegenüber der HTML5-Version

- Gemeinsames Stylesheet [styles.css](./styles.css) für alle Seiten
- Einheitliche Farben, Typografie, Abstände und Karten
- Responsive Darstellung für kleinere Bildschirme
- Verbesserte Darstellung von Header, Footer, Formularen und Bildern
- Vertikale Navigationsseitenleiste mit ausreichendem Abstand
- Hover- und Fokuszustände für Links, Buttons und die SVG-Karte

## Inhalte

Die Inhalte entsprechen der HTML5-Version:

- Interaktive SVG-Deutschlandkarte mit vier Regionen
- Übersicht mit acht Vogelarten und einzelnen Steckbriefen
- Regionale Übersichten, Blog, Spenden sowie Impressum und Datenschutz

## Technik

- HTML5
- CSS3
- Inline-SVG
- Bild- und GIF-Assets
- Kein JavaScript und kein Build-Prozess

## Lokale Ausführung

Öffne [index.html](./index.html) direkt im Browser oder starte sie in VS Code mit **Open with Live Server**. Die Datei [styles.css](./styles.css) wird von allen HTML-Seiten automatisch eingebunden.

## Seitenstruktur

```text
vogel-atlas-htmlcss/
├── Assets/                       # Bilder und Medien
├── index.html                    # Startseite mit Vogelkarte
├── styles.css                   # Gemeinsame Gestaltung
├── Alle_voegel.html              # Übersicht aller Vogelarten
├── Vogel_*.html                  # Vogel-Steckbriefe
├── Gebiet_*.html                 # Regionale Übersichten
├── Blog.html                     # Blog
├── Spenden.html                  # Spendenseite
├── Siehe Auch.html               # Weiterführende Links
└── Datenschutzimpressum.html     # Impressum und Datenschutz
```

## Online

<https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-htmlcss/>
