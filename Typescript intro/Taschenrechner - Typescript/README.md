# Kleiner Taschenrechner

## Überblick

Dieses Projekt ist ein kleiner TypeScript-Taschenrechner für grundlegende Rechenoperationen. TypeScript wird für die Konsolen- und Browser-Version kompiliert. Die Eingabe erfolgt als kompletter Rechenausdruck, zum Beispiel:

```txt
10+2*3
5-2+4
```

Die App prüft, ob die Eingabe gültig ist, und berechnet das Ergebnis entweder in der Konsole oder direkt auf der Webseite.

## Hinweis / Disclaimer

> Dieses Projekt dient ausschließlich als Lern- und Übungsprojekt. Es wird ohne Gewährleistung bereitgestellt. Für produktive, kommerzielle oder kritische Anwendungen ist es nicht vorgesehen.

## Funktionsumfang

- Eingabe einer kompletten Berechnung im Browser
- Entfernen von Leerzeichen
- Validierung der Reihenfolge von Zahlen und Operatoren
- Unterstützung für `+`, `-`, `*`, `/`
- Korrekte Priorität: `*` und `/` vor `+` und `-`
- Fehlerbehandlung bei ungültiger Eingabe oder Division durch null
- Bedienung über eine statische HTML-Seite ohne Server-Code
- Typprüfung und Kompilierung mit TypeScript

## Lokale Ausführung

1. In das Repository-Verzeichnis wechseln:

   ```bash
   cd /pfad/zu/BITLC-Angular
   ```

2. Abhängigkeiten installieren:

   ```bash
   npm install
   ```

3. TypeScript kompilieren und die Konsolenversion starten:

   ```bash
   npm run start:typescript
   ```

   Nur kompilieren:

   ```bash
   npm run build:typescript
   ```

4. Eine Rechnung eingeben, z. B.:

   ```txt
   12+4*2
   ```

5. Mit `exit` oder `Strg+C` beenden.

## Beispiel

```txt
Berechnung > 12+4*2
Ergebnis: 20

Berechnung > 10/0
Fehler: Division durch 0 ist nicht erlaubt.
```

## Online-Version

Nach `npm run build:typescript` liegen die Browser-Dateien in diesem Ordner. Die HTML-Seite lädt die kompilierte `Taschenrechner ONLINE.js` und kann direkt über GitHub Pages geöffnet werden.

## Wichtige Dateien

- `Taschenrechner.ts` – Kernlogik zur Tokenisierung und Berechnung
- `Taschenrechner ONLINE.ts` – Browser-Version für GitHub Pages
- `index.html` – Webseite der Browser-Version
- `index.ts` – Einstiegspunkt für die Konsole
- `tsconfig.node.json` – TypeScript-Konfiguration für Node.js
- `tsconfig.browser.json` – TypeScript-Konfiguration für den Browser
- `Programmplannung.md` – Aufgabenbeschreibung und Planungsdokument
