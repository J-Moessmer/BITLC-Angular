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

### 4. TypeScript – Taschenrechner

- **Ordner:** [Typescript intro/Taschenrechner - Typescript](./Typescript%20intro/Taschenrechner%20-%20Typescript/)
- **Dokumentation:** [Typescript intro/Taschenrechner - Typescript/README.md](./Typescript%20intro/Taschenrechner%20-%20Typescript/README.md)
- **Browserseite:** [Typescript intro/Taschenrechner - Typescript/index.html](./Typescript%20intro/Taschenrechner%20-%20Typescript/index.html)
- **Beschreibung:** TypeScript-Version des Taschenrechners mit Konsolen- und Browserausgabe.
- **Schwerpunkte:** Union-Typen, strikte Typprüfung, Node.js- und DOM-Konfiguration sowie Kompilierung für GitHub Pages.

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
│       └── Plannung/
│           ├── Programmplannung.md
│           └── programplanzeichnung.png
├── Typescript intro/              # TypeScript-Lernübungen
│   ├── Parkhaus/
│   │   ├── assets/
│   │   └── Plannung/
│   │       ├── Projektplan.md
│   │       ├── Park-backend1.png
│   │       ├── Park-backend2.png
│   │       ├── Park-frontend1.png
│   │       ├── Park-frontend2.png
│   │       └── Park-frontend3.png
│   └── Taschenrechner - Typescript/
│       ├── README.md
│       ├── index.html
│       ├── index.ts
│       ├── Taschenrechner.ts
│       ├── Taschenrechner ONLINE.ts
│       ├── tsconfig.node.json
│       ├── tsconfig.browser.json
│       └── Plannung/
│           ├── Programmplannung.md
│           └── programplanzeichnung.png
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

### TypeScript-Taschenrechner

```bash
npm install
npm run build:typescript
npm run start:typescript
```

Die Browser-Version kann nach dem Build über [`Typescript intro/Taschenrechner - Typescript/index.html`](./Typescript%20intro/Taschenrechner%20-%20Typescript/index.html) geöffnet werden.

Direkte Projektlinks:

- [VogelFinder HTML5](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-html/)
- [VogelFinder HTML + CSS](https://j-moessmer.github.io/BITLC-Angular/vogel-atlas-htmlcss/)
