# BITLC Projects

Dieses Repository sammelt meine Schulübungen zur Webentwicklung. Die Projekte bauen aufeinander auf und zeigen den Lernweg von einer ersten HTML5-Webseite bis zur Gestaltung mit CSS und späteren Framework-Projekten.

## Startseite

Die zentrale Projektübersicht befindet sich in der [Haupt-Landingpage](./index.html). Von dort aus können die fertigen Übungen geöffnet werden.

## Projekte

### 1. VogelFinder – HTML5

- **Ordner:** [vogel-atlas-html](./vogel-atlas-html/)
- **Dokumentation:** [vogel-atlas-html/README.md](./vogel-atlas-html/README.md)
- **Startseite:** [vogel-atlas-html/index.html](./vogel-atlas-html/index.html)
- **Beschreibung:** Erste Schulübung: eine mehrseitige Webseite mit reinem HTML5.
- **Schwerpunkte:** semantische HTML-Struktur, interne Verlinkungen, Tabellen, Formulare und eine SVG-Deutschlandkarte.

### 2. VogelFinder – HTML + CSS

- **Ordner:** [vogel-atlas-htmlcss](./vogel-atlas-htmlcss/)
- **Dokumentation:** [vogel-atlas-htmlcss/README.md](./vogel-atlas-htmlcss/README.md)
- **Startseite:** [vogel-atlas-htmlcss/index.html](./vogel-atlas-htmlcss/index.html)
- **Beschreibung:** Weiterentwicklung des VogelFinders mit einem gemeinsamen CSS-Stylesheet.
- **Schwerpunkte:** Farben, Abstände, Typografie, responsive Darstellung, Kartenlayout und eine nicht überlappende Navigation.

## Repository-Struktur

```text
BITLC-Angular/
├── index.html                    # Zentrale Landingpage
├── vogel-atlas-html/             # Übung mit reinem HTML5
│   ├── index.html
│   └── README.md
├── vogel-atlas-htmlcss/          # HTML5-Übung mit CSS
│   ├── index.html
│   ├── styles.css
│   └── README.md
└── README.md
```

## Lokale Ausführung

Die Projekte benötigen keine Installation von Node.js oder npm:

1. Repository klonen:

   ```bash
   git clone https://github.com/J-Moessmer/BITLC-Angular.git
   cd BITLC-Angular
   ```

2. [index.html](./index.html) im Browser öffnen.
3. Ein Projekt über die Landingpage auswählen oder die jeweilige `index.html` direkt öffnen.

Alternativ kann die [Haupt-Landingpage](./index.html) in VS Code mit **Open with Live Server** gestartet werden.

## GitHub Pages

Die zentrale Übersicht ist online erreichbar unter:

<https://j-moessmer.github.io/BITLC-Angular/>

Direkte Projektlinks:

- [VogelFinder HTML5](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-html/)
- [VogelFinder HTML + CSS](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-htmlcss/)
