# Kleiner Taschenrechner

## Überblick

Dieses Projekt ist eine kleine JavaScript-Console-Anwendung für grundlegende Rechenoperationen. Die Eingabe erfolgt als kompletter Rechenausdruck, zum Beispiel:

```txt
10+2*3
5-2+4
```

Die App prüft, ob die Eingabe gültig ist, berechnet das Ergebnis und lässt den Benutzer neue Rechnungen eingeben, bis er `exit` oder `Strg+C` verwendet.

## Hinweis / Disclaimer

> Dieses Projekt dient ausschließlich als Lern- und Übungsprojekt. Es wird ohne Gewährleistung bereitgestellt. Für produktive, kommerzielle oder kritische Anwendungen ist es nicht vorgesehen.

## Funktionsumfang

- Einlesen einer kompletten Berechnung aus der Konsole
- Entfernen von Leerzeichen
- Validierung der Reihenfolge von Zahlen und Operatoren
- Unterstützung für `+`, `-`, `*`, `/`
- Korrekte Priorität: `*` und `/` vor `+` und `-`
- Fehlerbehandlung bei ungültiger Eingabe oder Division durch null
- Schleife für neue Rechnungen bis zum Abbruch

## Starten

Im Ordner des Taschenrechners:

```bash
node index.js
```

Oder im Repository-Root:

```bash
npm start
```

## Beispiel

```txt
Berechnung > 12+4*2
Ergebnis: 20

Berechnung > 10/0
Fehler: Division durch 0 ist nicht erlaubt.
```

## Wichtige Dateien

- `Taschenrechner.js` – Kernlogik zur Tokenisierung und Berechnung
- `index.js` – Einstiegspunkt für die Konsole
- `Programmplannung.md` – Aufgabenbeschreibung und Planungsdokument
