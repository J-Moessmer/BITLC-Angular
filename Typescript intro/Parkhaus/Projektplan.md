# Typescript Aufgabe: Parkhaus

Es soll eine kleine Parkhaus-App, lauffähig auf einem Terminal, in TypeScript erstellt werden.

## 1. Rahmendaten zum Parkhaus

### Parkhausgröße
- 25 Parkplätze (zunächst, eventuell später als Option mehr)

### Parkhauszeiten
- Geöffnet von 08:00 bis 22:00 Uhr

### Parkinformationen
- Fahrzeug-ID: 4-stellige Zahl
- Einfahrt-Uhrzeit mit HH:MM speichern
- Geplante Parkdauer mit HH:MM speichern
  - Wenn 00:00: keine Parkdauer geplant

### Parkinrules
- Alle 2 Stunden wird geprüft, ob 80 % belegt sind.
- Aktion: automatisches Ausfahren von Fahrzeugen
  - Bedingungen:
    - mindestens 4 Stunden schon geparkt
    - maximal 10 % der gesamten Parkplatzanzahl

### Businessplan
- Kosten pro Stunde:
  - erste Stunde: 1 €
  - jede weitere Stunde: 1 € - Anzahl weiterer Stunden * 1/10 €
  - nach > 10 weiteren Stunden: + 0 €
- Bei Ausfahrt:
  - Einnahme des Fahrzeugs berechnen und anzeigen
  - Gesamteinahme bisher berechnen und anzeigen
- Um 22:00 Uhr: alle Fahrzeuge fahren aus
  - Gesamteinahme berechnen und anzeigen

## 2. App-Aktionen

- Parkhaus öffnen
- Parkhaus schließen
- Auto einzeln einfahren
- Auto einzeln ausfahren
- Autos über einen Zeitraum automatisch einfahren/ausfahren
  - optional steuerbar über Parameter: `MengeEin`, `MengeAus`, `Zeitraum`
- Gesamteinahmen abfragen (aktueller Zeitpunkt)
