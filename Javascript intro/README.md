# JavaScript-Übungen

Dieser Ordner enthält kleine JavaScript-Übungen und Lernbeispiele für die Einführung in Programmierung mit Node.js.

## Hinweis / Disclaimer

> Dieses Material ist ein Lernprojekt zur Programmierung mit JavaScript. Es dient ausschließlich für Übungs- und Schulzwecke. Es wird ohne Gewährleistung bereitgestellt.

## Inhalte

- `index001.js` – erste JavaScript-Einführung
- `index002.js` – weitere grundlegende Anwendungsbeispiele
- `Taschenrechner/` – JavaScript-Taschenrechner mit Eingabe- und Validierungslogik; [Planung und Programmzeichnung](./Taschenrechner/Plannung/) liegen im Unterordner `Plannung/`.
- `../Typescript intro/Taschenrechner - Typescript/` – TypeScript-Version für Konsole und Browser

## Taschenrechner

Der Taschenrechner arbeitet in der Konsole und erwartet eine komplette Rechnung wie:

```bash
10+2*3
5-2+4
```

Starten:

```bash
cd "Javascript intro/Taschenrechner"
node index.js
```

Oder im Repository-Root:

```bash
npm start
```

## TypeScript-Taschenrechner

Die TypeScript-Version wird vor dem Start kompiliert und enthält zusätzlich eine Browser-Version für GitHub Pages:

```bash
npm run build:typescript
npm run start:typescript
```

Die Browser-Seite befindet sich in `../Typescript intro/Taschenrechner - Typescript/index.html`.
