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

**Parkhausstatus bei 9 belegten von 20 Plätzen (45 %):**

```ts
//bsp UI interface "laufender betrieb" 
╔══════════════════════════════════════════════════════════════╗ <64 zeichen breite>
║                       Parkhaus UI                            ║ <62 zeichen effektiver schriftraum>
╠══════════════════════════════════════════════════════════════╣
║                Parkhaus: [OFFEN/GESCHLOSSEN]                 ║
║      #######################...........................      ║ <50 Zeichen: 23 belegt, 27 frei>
╠══════════════════════════════════════════════════════════════╣
║                    --- Kennzeichen ---                       ║
║ 1111 | 2222 | 3333 | 4444 | 5555 | 6666 | 7777 | 8888 | 9999 ║
║                                                              ║
║ Plätze belegt: 9/20 (45 %)                                   ║
╠══════════════════════════════════════════════════════════════╣
║                                                              ║
║              Uhrzeit: 08:00 | Einnahmen: 0,00 €              ║
╠══════════════════════════════════════════════════════════════╣
╚══════════════════════════════════════════════════════════════╝

// bsp UI interface "Abrechnung"
╔══════════════════════════════════════════════════════════════╗
║                       Abrechnung UI                          ║
╠══════════════════════════════════════════════════════════════╣
║      Endabrechnung / zwischenabrechnung                      ║
╠══════════════════════════════════════════════════════════════╣
║     --- erfasste Kennzeichen im rechnungszeitraum ---        ║
║ 1111 | 2222 | 3333 | 4444 | 5555 | 6666 | 7777 | 8888 | 9999 ║
║                                                              ║
║ Summe aller erfassten Kennzeichen: 9                         ║
╠══════════════════════════════════════════════════════════════╣
║   Abrechnungszeitraum: 08:00 - 09:00 | Einnahmen: 0,00 €     ║
║                                                              ║
╠══════════════════════════════════════════════════════════════╣
╚══════════════════════════════════════════════════════════════╝
```

Der Belegungsbalken ist immer genau 50 Zeichen lang und stellt die Auslastung proportional dar. Die Anzahl belegter Segmente wird auf die nächste ganze Zahl gerundet: `round(belegtePlaetze / kapazitaet * 50)`. Die übrigen Segmente zeigen freie Kapazität. Belegte Segmente werden im Terminal rot und freie Segmente grün dargestellt. Die Prozentzahl und die Anzahl belegter Plätze werden zusätzlich ausgeschrieben. Die Anzeige zeigt je nach Zustand `OFFEN` oder `GESCHLOSSEN` und wird nach jedem Tick aktualisiert.

### ANSI-Steuerung des Hauptmenüs

Das Hauptmenü wird mit ANSI-Escape-Codes im Terminal aktualisiert. Vor jeder Neuzeichnung wird der Bildschirm geleert und der Cursor an den Anfang gesetzt. Farben kennzeichnen belegte und freie Segmente des Belegungsbalkens.

```ts
// Bildschirm leeren und Cursor nach oben links setzen
process.stdout.write('\x1b[2J\x1b[H');

// Belegte Segmente rot, freie Segmente gruen ausgeben
const belegteSegmente = Math.round(geparkteAutos.length / kapazitaet * 50);
process.stdout.write('\x1b[31m' + '#'.repeat(belegteSegmente));
process.stdout.write('\x1b[32m' + '.'.repeat(50 - belegteSegmente) + '\x1b[0m');
```

Nach jedem Tick wird das Hauptmenü mit dem aktuellen Parkhausstatus neu gezeichnet.

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
