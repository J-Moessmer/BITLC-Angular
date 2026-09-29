# BITLC Projects

Dieses Repository sammelt meine Schulübungen zur Webentwicklung und JavaScript-Grundlagen. Die Projekte bauen aufeinander auf und zeigen den Lernweg von einer ersten HTML5-Webseite bis zur Gestaltung mit CSS und späteren Framework-Projekten.

## Hinweis / Disclaimer

> Dieses Repository ist ein Lernprojekt und dient dem Üben von HTML-, CSS- und JavaScript-Grundlagen. Es wird ohne Gewährleistung bereitgestellt. Fehler, Unvollständigkeiten oder technische Einschränkungen können vorkommen. Für produktiven Einsatz oder kommerzielle Nutzung ist keine Garantie oder Supportleistung vorgesehen.

## Live ansehen

**GitHub Pages:** <https://j-moessmer.github.io/BITLC-Angular/>

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

### 3. JavaScript Grundlagen – Taschenrechner

- **Ordner:** [Javascript intro/Taschenrechner](./Javascript%20intro/Taschenrechner/)
- **Dokumentation:** [Javascript intro/Taschenrechner/README.md](./Javascript%20intro/Taschenrechner/README.md)
- **Startdatei:** [Javascript intro/Taschenrechner/index.js](./Javascript%20intro/Taschenrechner/index.js)
- **Beschreibung:** Konsole-basierter Taschenrechner mit Eingabevalidierung und Operator-Priorität.
- **Schwerpunkte:** Tokenisierung, Fehlererkennung, Berechnungsvorschrift, Eingabe-Schleife und Abbruch per `exit` oder `Ctrl+C`.

## Repository-Struktur

```text
BITLC-Angular/
├── .agents/                       # KI-Richtlinien und Projekthistorie
├── .vscode/
├── index.html                     # Zentrale Landingpage
├── Javascript intro/              # JavaScript-Lernübungen
│   ├── README.md
│   ├── index001.js
│   ├── index002.js
│   └── Taschenrechner/
│       ├── README.md
│       ├── index.js
│       ├── Taschenrechner.js
│       ├── Programmplannung.md
│       └── programplanzeichnung.png
├── vogel-atlas-html/              # Übung mit reinem HTML5
│   ├── index.html
│   └── README.md
├── vogel-atlas-htmlcss/           # HTML5-Übung mit CSS
│   ├── index.html
│   ├── styles.css
│   └── README.md
├── README.md
├── package.json
├── LICENSE
└── .gitignore
```

## Lokale Ausführung

### HTML-Projekte

Die Projekte benötigen keine Installation von Node.js oder npm:

1. Repository klonen:

   ```bash
   git clone https://github.com/J-Moessmer/BITLC-Angular.git
   cd BITLC-Angular
   ```

2. [index.html](./index.html) im Browser öffnen.
3. Ein Projekt über die Landingpage auswählen oder die jeweilige `index.html` direkt öffnen.

Alternativ kann die [Haupt-Landingpage](./index.html) in VS Code mit **Open with Live Server** gestartet werden.

### JavaScript-Taschenrechner

```bash
cd "Javascript intro/Taschenrechner"
node index.js
```

Oder aus dem Repository-Root:

```bash
npm start
```

Direkte Projektlinks:

- [VogelFinder HTML5](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-html/)
- [VogelFinder HTML + CSS](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-htmlcss/)
