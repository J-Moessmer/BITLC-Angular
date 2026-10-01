> # TypeScript-Aufgabenstellung: Parkhaus
>
> Es soll eine kleine Parkhaus-App, lauffähig auf einem Terminal, in TypeScript erstellt werden.
>
> ## 1. Rahmendaten zum Parkhaus
>
> ### Parkhausgröße
> - 25 Parkplätze (zunächst, eventuell später als Option mehr)
>
> ### Parkhauszeiten
> - Geöffnet von 08:00 bis 22:00 Uhr
>
> ### Parkinformationen
> - Fahrzeug-ID: 4-stellige Zahl
> - Einfahrt-Uhrzeit mit HH:MM speichern
> - Geplante Parkdauer mit HH:MM speichern
>   - Wenn 00:00: keine Parkdauer geplant
>
> ### Parkregeln
> - Alle 2 Stunden wird geprüft, ob 80 % belegt sind.
> - Aktion: automatisches Ausfahren von Fahrzeugen
>   - Bedingungen:
>     - mindestens 4 Stunden schon geparkt
>     - maximal 10 % der gesamten Parkplatzanzahl
>
> ### Businessplan
> - Kosten pro Stunde:
>   - erste Stunde: 1 €
>   - jede weitere Stunde: 1 € - Anzahl weiterer Stunden * 1/10 €
>   - nach > 10 weiteren Stunden: + 0 €
> - Bei Ausfahrt:
>   - Einnahme des Fahrzeugs berechnen und anzeigen
>   - Gesamteinnahmen bisher berechnen und anzeigen
> - Um 22:00 Uhr: alle Fahrzeuge fahren aus
>   - Gesamteinnahmen berechnen und anzeigen
>
> ## 2. App-Aktionen
>
> - Parkhaus öffnen
> - Parkhaus schließen
> - Auto einzeln einfahren
> - Auto einzeln ausfahren
> - Autos über einen Zeitraum automatisch einfahren/ausfahren
>   - optional steuerbar über Parameter: `MengeEin`, `MengeAus`, `Zeitraum`
> - Gesamteinnahmen abfragen (aktueller Zeitpunkt)

# Programmplanung

## Terminal UI / Frontend

Beim Programmstart werden Parkhausgröße (Standardwert: 25) und Zeitskalierung abgefragt. Die Kapazität muss eine positive Zahl sein. Die Simulationsuhr wird auf 08:00 Uhr gesetzt; sie läuft erst nach dem Befehl `Öffnen`.

Die Zeitskalierung bestimmt, wie schnell die Simulation gegenüber der echten Zeit läuft:

- `1`: eine simulierte Minute pro echter Minute
- `60`: 60 simulierte Minuten pro echter Minute (eine simulierte Stunde pro echter Minute)

**Parkhausstatus bei 5 belegten und 20 freien Plätzen:**

```ts
Parkhaus: [OFFEN/GESCHLOSSEN]
#####|####################
-------------- Kennzeichen ---------------
1234 | 5678 | 9101 | 1121 | 3141
Eingabe >
Uhrzeit: 08:00 | Einnahmen: 0,00 €
```

**Farbige Kopie des Belegungsbalkens:**

<span style="color:#c0392b">#####</span>|<span style="color:#27864b">####################</span>

Jedes `#` steht für einen Stellplatz. Rot bedeutet belegt, Grün bedeutet frei. Der senkrechte Strich trennt belegte und freie Plätze und zählt nicht als Stellplatz. Die Anzeige zeigt je nach Zustand `OFFEN` oder `GESCHLOSSEN` und wird nach jedem Tick aktualisiert.

### Abrechnungsmenüs

**Manuelle Zwischenabrechnung**

```ts
Eingabe > "Einnahmen"

Bis HH:MM wurden XX,XX € eingenommen.
```

**Endabrechnung**

```ts
Eingabe > "Ende"

Tagesabrechnung Parkhaus

Anzahl ausgefahrener Fahrzeuge: XX
Gesamteinnahmen:                XX,XX €
Uhrzeit der Abrechnung:         HH:MM
[PROGRAMMENDE]
```

### Befehle

- `Einparken`: Ein Fahrzeug manuell oder zufällig erzeugen. Kennzeichen müssen vier Ziffern haben und dürfen bei gleichzeitig geparkten Fahrzeugen nicht doppelt vorkommen. Bei voller Kapazität wird die Einfahrt abgelehnt.
- `Ausparken`: Kennzeichen abfragen, Parkdauer und Kosten anzeigen und die Einnahmen aktualisieren.
- `Einnahmen`: Gesamteinnahmen zum aktuellen Simulationszeitpunkt anzeigen.
- `Öffnen`: Parkhaus öffnen und die Simulationsuhr starten beziehungsweise fortsetzen.
- `Schließen` oder `Ende`: Einfahrt beenden, alle noch geparkten Fahrzeuge ausfahren lassen, Tagesabrechnung anzeigen und Programm beenden.
- Optionaler Testlauf: Ein- und Ausfahrten über `MengeEin`, `MengeAus` und `Zeitraum` steuern.

Die automatische Schließung um 22:00 Uhr verwendet dieselbe Abschlusslogik wie `Ende`. Die Abrechnung zeigt die ausgefahrenen Fahrzeuge, die Gesamteinnahmen und den Abrechnungszeitpunkt.

## Backend

### Zeit und Tick-Ablauf

- Ein Tick entspricht immer einer simulierten Minute. Die Zeitskalierung verändert nur den Abstand zwischen den Ticks in echter Zeit, nicht deren simulierte Dauer.
- Tick `0` entspricht 08:00 Uhr; nach 840 Ticks ist es 22:00 Uhr.
- Alle 120 Ticks wird die Belegung geprüft. Bei mehr als 80 % Belegung werden bis zu 10 % der Kapazität ausgeparkt.
- Ausparken wegen hoher Belegung dürfen nur Fahrzeuge, die mindestens 240 Ticks (vier Stunden) geparkt haben. Es werden die ältesten geeigneten Fahrzeuge zuerst ausgewählt.
- Bei 25 Stellplätzen bedeutet „mehr als 80 %“ mindestens 21 belegte Plätze. Höchstens 10 % der Kapazität sind zwei Fahrzeuge (`floor(25 * 0.10)`).
- Eine geplante Parkdauer löst die Ausfahrt nach Ablauf aus. `00:00` bedeutet, dass keine geplante Ausfahrt erfolgt; spätestens um 22:00 Uhr fährt das Fahrzeug aus.
- Bei voller Kapazität oder geschlossenem Parkhaus ist keine Einfahrt möglich.

### Preisberechnung

Annahme für die Berechnung: Jede angefangene Parkstunde wird voll berechnet. Die erste Stunde kostet 1,00 €. Für jede weitere Stunde sinkt der Stundensatz um 0,10 €, bis er 0,00 € erreicht; danach bleibt er bei 0,00 €.

```ts
berechneteStunden = aufrunden(ParkdauerInMinuten / 60)
Stundensatz(i) = max(0,00 €, 1,00 € - i * 0,10 €)  // i beginnt bei 0
Fahrzeugkosten = Summe der Stundensätze für alle berechneten Stunden
```

Beispiele: 1 Stunde kostet 1,00 €, 2 Stunden kosten 1,90 €, 4 Stunden kosten 3,40 €. Die Gesamtkosten steigen nicht über 5,50 €, weil der Stundensatz ab der elften berechneten Stunde 0,00 € beträgt. Geldbeträge sollten intern in Cent gespeichert werden, damit Rundungsfehler vermieden werden.

### Datenmodell

Gespeichert werden die daten in 2 Objekten. Die aktuelle Belegung wird aus der Liste der geparkten Fahrzeuge abgeleitet, statt zusätzlich als veränderlicher Zähler gespeichert zu werden. Ausgefahrene Fahrzeuge werden für die Tagesabrechnung separat gezählt.

```ts
type Auto = {
	kennzeichen: string; // vier Ziffern
	einfahrtTick: number;
	geplanteParkdauerMinuten: number | null;
	ausfahrtTick?: number;
};

type Parkhaus = {
	kapazitaet: number;
	geparkteAutos: Auto[];
	ausgefahreneAutos: Auto[];
	einnahmenCent: number;
	aktuellerTick: number;
	istGeoeffnet: boolean;
};
```
