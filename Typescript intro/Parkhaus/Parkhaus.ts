// Projekt: Parkhaus-Simulation
// Modul: Parkhaus.ts
// Zweck: Terminalbasierte Parkhaus-Simulation mit einer simulierten Uhr.
// Start: Im Ordner "Typescript intro/Parkhaus" mit "npx ts-node Parkhaus.ts".
// Zeitskalierung: 1 = eine simulierte Minute pro realer Minute; 60 = eine
//                 simulierte Stunde pro realer Minute.
// Disclaimer: Lern- und Übungsprojekt ohne Gewährleistung; nicht für den
//             produktiven Einsatz bestimmt.
// Erstellt für: J-Moessmer
// Erstellt mit: Mensch-KI-Pair-Programming
// Stand: 02.10.2026 | Prototyp
// Kommentar-Markierungen: "M ... M" kennzeichnet menschlich geschriebenen Code;
//                         "K ... K" kennzeichnet KI-generierten Code.

//################################################################
//M                      zeitmodul                               M
//M   multiplkator einlesen und dann ticks zählen und ausgeben   M
//K   Kapazität testen und ggf. auto generieren und einparken    K
//K   geplante Parkdauer testen und auto automatisch ausparken   K
//################################################################


import * as readline from 'node:readline/promises';

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
    const antwort = await rl.question('Zeit-Multiplikator eingeben (1 = 1 Tick/min, 60 = 60 Ticks/min): ');
    const eingabeMultiplikator = Number(antwort);
    const multiplikator = Number.isFinite(eingabeMultiplikator) && eingabeMultiplikator > 0
        ? eingabeMultiplikator
        : 1;

    let ticks = 0;
    let interval: ReturnType<typeof setInterval> | undefined;
    let fragtKennzeichenAb = false;
    testBetrieb.aktuellerTick = 0;
    testBetrieb.istGeoeffnet = false;
    renderParkhausUI(testBetrieb);

    const zeigeAbrechnung = () => {
        if (interval) clearInterval(interval);
        interval = undefined;
        testBetrieb.istGeoeffnet = false;
        for (const auto of [...testBetrieb.geparkteAutos]) {
            ausparken(testBetrieb, auto.kennzeichen);
        }
        testBetrieb.mode = 'ABRECHNUNG';
        testBetrieb.abrechnungszeitraum = `08:00 - ${formatSimulationszeit(testBetrieb.aktuellerTick)}`;
        renderParkhausUI(testBetrieb);
        rl.close();
    };

    // Ticks von MMMM in HH:MM umrechnen

    const tick = () => {
        ticks++;
        testBetrieb.aktuellerTick = ticks;

        // teste öffnngszeit 14h nach 08:00 also 22:00 Uhr

        if (ticks >= 14 * 60) {
            zeigeAbrechnung();
            return;
        }
        //prüfung, ob geplante Parkdauer erreicht ist und auto automatisch ausparken
        const automatischAusgeparkteAutos: { auto: Auto; preisCent: number }[] = [];
        for (const auto of [...testBetrieb.geparkteAutos]) {
            const geplanteParkdauer = auto.geplanteParkdauerMinuten;
            if (geplanteParkdauer !== null && ticks - auto.einfahrtTick >= geplanteParkdauer) {
                const ergebnis = ausparken(testBetrieb, auto.kennzeichen);
                if (ergebnis) automatischAusgeparkteAutos.push(ergebnis);
            }
        }

        let autoAutomatischEingefahren = false;
        // kapazitätstest
        if (testBetrieb.istGeoeffnet && testBetrieb.geparkteAutos.length < testBetrieb.kapazitaet && generateauto()) {
            const auto = generateAuto(ticks, testBetrieb.geparkteAutos.map((geparkt) => geparkt.kennzeichen));
            testBetrieb.geparkteAutos.push(auto);
            autoAutomatischEingefahren = true;
        }

        if (automatischAusgeparkteAutos.length > 0 || autoAutomatischEingefahren) {
            renderParkhausUI(testBetrieb);
            for (const { auto, preisCent } of automatischAusgeparkteAutos) {
                console.log(`Geplante Parkdauer erreicht: Auto ${auto.kennzeichen} ausgefahren. Kosten: ${formatEuro(preisCent)} €.`);
            }
            rl.prompt(true);
        } else {
            updateLiveParkhausUI(testBetrieb);
        }
    };

    rl.setPrompt('Befehl > ');
    rl.on('line', (eingabe) => {
        if (fragtKennzeichenAb) {
            fragtKennzeichenAb = false;
            rl.setPrompt('Befehl > ');
            const ergebnis = ausparken(testBetrieb, eingabe);
            if (ergebnis) {
                renderParkhausUI(testBetrieb);
                console.log(`Auto ${ergebnis.auto.kennzeichen} ausgefahren. Kosten: ${formatEuro(ergebnis.preisCent)} €.`);
            } else {
                console.log(`Kein geparktes Auto mit Kennzeichen ${eingabe.trim()} gefunden.`);
            }
            rl.prompt();
            return;
        }

        const befehl = eingabe.trim().toLocaleLowerCase('de-DE');

        if (befehl === 'öffnen') {
            if (!testBetrieb.istGeoeffnet && ticks < 14 * 60) {
                testBetrieb.istGeoeffnet = true;
                updateLiveParkhausUI(testBetrieb);
                interval = setInterval(tick, 60000 / multiplikator);
            }
        } else if (befehl === 'einparken') {
            if (!testBetrieb.istGeoeffnet) {
                console.log('Das Parkhaus ist geschlossen.');
            } else if (testBetrieb.geparkteAutos.length >= testBetrieb.kapazitaet) {
                console.log('Das Parkhaus ist voll.');
            } else {
                const auto = generateAuto(ticks, testBetrieb.geparkteAutos.map((geparkt) => geparkt.kennzeichen));
                testBetrieb.geparkteAutos.push(auto);
                renderParkhausUI(testBetrieb);
                console.log(`Auto ${auto.kennzeichen} eingefahren bei Tick ${auto.einfahrtTick}.`);
            }
        } else if (befehl === 'ausparken') {
            if (!testBetrieb.istGeoeffnet) {
                console.log('Das Parkhaus ist geschlossen.');
            } else if (testBetrieb.geparkteAutos.length === 0) {
                console.log('Es sind keine Autos geparkt.');
            } else {
                fragtKennzeichenAb = true;
                rl.setPrompt('Kennzeichen > ');
            }
        } else if (befehl === 'schließen' || befehl === 'schliessen' || befehl === 'ende') {
            zeigeAbrechnung();
            return;
        } else if (befehl !== '') {
            console.log(`Befehl noch nicht implementiert: ${eingabe}`);
        }

        rl.prompt();
    });

    rl.on('close', () => {
        if (interval) clearInterval(interval);
        process.stdout.write('\x1b[?25h');
    });

    rl.prompt();
}


//########################################
//M          Objekte definieren          M
//########################################


type Auto = {
	kennzeichen: string; // vier Ziffern
	einfahrtTick: number;
	geplanteParkdauerMinuten: number | null;
	ausfahrtTick?: number;
};

type Parkhaus = {
    mode: UIMode;
	kapazitaet: number;
	geparkteAutos: Auto[];
	ausgefahreneAutos: Auto[];
	einnahmenCent: number;
	aktuellerTick: number;
	istGeoeffnet: boolean;
    abrechnungszeitraum?: string;
};


//##############################################################################
//M     modul: Wird ein auto generiert? / zufallsgenerator für kennzeichen     M
//##############################################################################

function generateauto(): boolean {
    return Math.random() >= 0.5;
}

function generateKennzeichen(): string {
    const kennzeichen = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
    return kennzeichen;
}

function generateParkdauer(): number {
    const parkdauer = Math.floor(Math.random() * 1440) + 1; // 1 bis 1440 Minuten (24h)
    return parkdauer;
}


//##################################################
//M     modul: Auto generieren mit Kennzeichen     M
//##################################################

function generateAuto(einfahrtTick: number, bereitsGeparkteKennzeichen: string[]): Auto {
    let kennzeichen = generateKennzeichen();
    while (bereitsGeparkteKennzeichen.includes(kennzeichen)) {
        kennzeichen = generateKennzeichen();
    }

    return {
        kennzeichen,
        einfahrtTick,
        geplanteParkdauerMinuten: generateParkdauer(),
    };
}

//##########################################################
//M    MODUL: Preisrechnung für Parkdauer und Einnahmen    M
//##########################################################

function berechneParkpreis(auto: Auto): number {
    if (auto.ausfahrtTick === undefined) {
        throw new Error('Der Parkpreis kann erst nach der Ausfahrt berechnet werden.');
    }

    const parkdauerMinuten = Math.max(0, auto.ausfahrtTick - auto.einfahrtTick);
    const berechneteStunden = Math.max(1, Math.ceil(parkdauerMinuten / 60));
    let preisCent = 0;

    for (let stunde = 0; stunde < berechneteStunden; stunde++) {
        preisCent += Math.max(0, 100 - stunde * 10);
    }

    return preisCent;
}

//####################################################
//K   MODUL: Auto ausparken, finalpreis rechnen      K
//####################################################

function ausparken(parkhaus: Parkhaus, kennzeichen: string): { auto: Auto; preisCent: number } | undefined {
    const index = parkhaus.geparkteAutos.findIndex(
        (auto) => auto.kennzeichen === kennzeichen.trim(),
    );
    if (index < 0) return undefined;

    const auto = parkhaus.geparkteAutos[index];
    if (!auto) return undefined;

    auto.ausfahrtTick = parkhaus.aktuellerTick;
    const preisCent = berechneParkpreis(auto);
    parkhaus.geparkteAutos.splice(index, 1);
    parkhaus.ausgefahreneAutos.push(auto);
    parkhaus.einnahmenCent += preisCent;

    return { auto, preisCent };
}

function formatEuro(betragCent: number): string {
    return (betragCent / 100).toFixed(2).replace('.', ',');
}

//#######################################################
//K      MODUL: UI INTERFACE MIT ANSI ESCAPE CODES      K
//#######################################################
//
//UI interface nach ANSI escape codes
//https://en.wikipedia.org/wiki/ANSI_escape_code
//
// bsp UI interface "laufender betrieb" bei 9 belegten von 20 Plaetzen (45 %)
//╔══════════════════════════════════════════════════════════════╗ <64 zeichen breite>
//║                       Parkhaus UI                            ║ <62 zeichen effektiver schriftraum>
//╠══════════════════════════════════════════════════════════════╣
//║                Parkhaus: [OFFEN/GESCHLOSSEN]                 ║
//║      #######################...........................      ║ <50 Zeichen: 23 belegt, 27 frei>
//╠══════════════════════════════════════════════════════════════╣
//║                    --- Kennzeichen ---                       ║
//║ 1111 | 2222 | 3333 | 4444 | 5555 | 6666 | 7777 | 8888 | 9999 ║
//║                                                              ║
//║ Plätze belegt: 9/20 (45 %)                                   ║
//╠══════════════════════════════════════════════════════════════╣
//║                                                              ║
//║              Uhrzeit: 08:00 | Einnahmen: 0,00 €              ║
//╠══════════════════════════════════════════════════════════════╣
//╚══════════════════════════════════════════════════════════════╝
//
// bsp UI interface "Abrechnung"
//╔══════════════════════════════════════════════════════════════╗
//║                       Abrechnung UI                          ║
//╠══════════════════════════════════════════════════════════════╣
//║      Endabrechnung / zwischenabrechnung                      ║
//╠══════════════════════════════════════════════════════════════╣
//║     --- erfasste Kennzeichen im rechnungszeitraum ---        ║
//║ 1111 | 2222 | 3333 | 4444 | 5555 | 6666 | 7777 | 8888 | 9999 ║
//║                                                              ║
//║ Summe aller erfassten Kennzeichen: 9                         ║
//╠══════════════════════════════════════════════════════════════╣
//║   Abrechnungszeitraum: 08:00 - 09:00 | Einnahmen: 0,00 €     ║
//║                                                              ║
//╠══════════════════════════════════════════════════════════════╣
//╚══════════════════════════════════════════════════════════════╝
//
//      Durch zeitmangel wurde der UI code mit KI generiert

type UIMode = 'BETRIEB' | 'ABRECHNUNG';

let uiInitialized = false;

function renderParkhausUI(data: Parkhaus): void {
    // Nur beim ersten Frame leeren; danach dieselbe UI-Position überschreiben.
    process.stdout.write(uiInitialized ? '\x1b[H\x1b[?25l' : '\x1b[2J\x1b[H\x1b[?25l');
    uiInitialized = true;

    const totalWidth = 64;
    const contentWidth = 62; // Effektiver Raum zwischen den ║
    const angezeigteAutos = data.mode === 'BETRIEB' ? data.geparkteAutos : data.ausgefahreneAutos;
    const kennzeichen = angezeigteAutos.map((auto) => auto.kennzeichen);

    // --- 1. HEADER REIHEN ---
    console.log('╔══════════════════════════════════════════════════════════════╗');
    const title = data.mode === 'BETRIEB' ? 'Parkhaus UI' : 'Abrechnung UI';
    console.log(`║${title.padStart(31 + Math.floor(title.length / 2)).padEnd(contentWidth)}║`);
    console.log('╠══════════════════════════════════════════════════════════════╣');

    // --- 2. STATUS / RECHNUNGSZEILE ---
    if (data.mode === 'BETRIEB') {
        const statusText = data.istGeoeffnet ? '\x1b[1;32mOFFEN\x1b[0m' : '\x1b[1;31mGESCHLOSSEN\x1b[0m';
        // Da ANSI-Codes die String-Länge verfälschen, berechnen wir das Padding manuell für ein sauberes Zentrieren
        const rawText = `Parkhaus: [${data.istGeoeffnet ? 'OFFEN' : 'GESCHLOSSEN'}]`;
        const padLeft = Math.floor((contentWidth - rawText.length) / 2);
        const padRight = contentWidth - rawText.length - padLeft;
        console.log(`║${' '.repeat(padLeft)}Parkhaus: [${statusText}]${' '.repeat(padRight)}║`);

        // Ladebalken berechnen (50 Zeichen Gesamtbreite)
        const percentage = Math.min(1, Math.max(0, data.geparkteAutos.length / data.kapazitaet));
        const filledBlocks = Math.round(percentage * 50);
        const emptyBlocks = 50 - filledBlocks;
        const belegteSegmente = '#'.repeat(filledBlocks);
        const freieSegmente = '.'.repeat(emptyBlocks);
        console.log(`║      \x1b[31m${belegteSegmente}\x1b[32m${freieSegmente}\x1b[0m      ║`);
    } else {
        const subtitle = 'Endabrechnung / zwischenabrechnung';
        console.log(`║      ${subtitle.padEnd(contentWidth - 6)}║`);
    }

    console.log('╠══════════════════════════════════════════════════════════════╣');

    // --- 3. KENNZEICHEN BEREICH ---
    const sectionTitle = data.mode === 'BETRIEB' 
        ? '--- Kennzeichen ---' 
        : '--- erfasste Kennzeichen im rechnungszeitraum ---';
    console.log(`║${sectionTitle.padStart(Math.floor((contentWidth + sectionTitle.length) / 2)).padEnd(contentWidth)}║`);

    // Dynamische Kennzeichen-Reihen (9 Stück pro Zeile)
    const platesPerRow = 9;
    const rowCount = Math.max(1, Math.ceil(kennzeichen.length / platesPerRow));

    for (let r = 0; r < rowCount; r++) {
        const rowPlates: string[] = [];
        for (let i = 0; i < platesPerRow; i++) {
            const index = r * platesPerRow + i;
            if (index < kennzeichen.length) {
                // Formatiere jedes Kennzeichen auf exakt 4 Zeichen
                const plate = kennzeichen[index];
                if (plate !== undefined) {
                    rowPlates.push(plate.padEnd(4, ' ').substring(0, 4));
                }
            }
        }
        
        // Füge Trennstriche zwischen den Kennzeichen ein
        const platesLineContent = rowPlates.join(' | ');
        const fullRow = platesLineContent;
        console.log(`║ ${fullRow.padEnd(contentWidth - 2)} ║`);
    }

    // Leere Zeile laut Design
    console.log('║                                                              ║');

    // Statistikzeile unter den Kennzeichen
    if (data.mode === 'BETRIEB') {
        const percent = Math.round((data.geparkteAutos.length / data.kapazitaet) * 100);
        const statsStr = `Plätze belegt: ${data.geparkteAutos.length}/${data.kapazitaet} (${percent} %)`;
        console.log(`║ ${statsStr.padEnd(contentWidth - 2)} ║`);
    } else {
        const statsStr = `Summe aller erfassten Kennzeichen: ${kennzeichen.length}`;
        console.log(`║ ${statsStr.padEnd(contentWidth - 2)} ║`);
    }

    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║                                                              ║');

    // --- 4. INFO UND EINNAHMEN ---
    let footerStr = '';
    const einnahmen = (data.einnahmenCent / 100).toFixed(2).replace('.', ',');
    if (data.mode === 'BETRIEB') {
        footerStr = `Uhrzeit: ${formatSimulationszeit(data.aktuellerTick)} | Einnahmen: ${einnahmen} €`;
    } else {
        footerStr = `Abrechnungszeitraum: ${data.abrechnungszeitraum ?? '08:00 - 22:00'} | Einnahmen: ${einnahmen} €`;
    }
    const footerPadLeft = Math.floor((contentWidth - footerStr.length) / 2);
    const footerPadRight = contentWidth - footerStr.length - footerPadLeft;
    console.log(`║${' '.repeat(footerPadLeft)}${footerStr}${' '.repeat(footerPadRight)}║`);

    if (data.mode === 'ABRECHNUNG') {
        // Die Abrechnung hat laut deinem Design unter den Einnahmen noch eine Leerzeile
        console.log('║                                                              ║');
    }

    // --- 5. INPUT UND ABSCHLUSS ---
    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║                     ---  Befehle  ---                        ║');
    console.log('║   öffnen | einparken | ausparken | schließen | ende          ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    process.stdout.write('\x1b[J');
}

function updateLiveParkhausUI(data: Parkhaus): void {
    const contentWidth = 62;
    const rowCount = Math.max(1, Math.ceil(data.geparkteAutos.length / 9));
    const statusRaw = `Parkhaus: [${data.istGeoeffnet ? 'OFFEN' : 'GESCHLOSSEN'}]`;
    const statusPadLeft = Math.floor((contentWidth - statusRaw.length) / 2);
    const statusPadRight = contentWidth - statusRaw.length - statusPadLeft;
    const statusColor = data.istGeoeffnet ? '\x1b[1;32m' : '\x1b[1;31m';
    const statusText = `${statusColor}${data.istGeoeffnet ? 'OFFEN' : 'GESCHLOSSEN'}\x1b[0m`;
    const statusLine = `║${' '.repeat(statusPadLeft)}Parkhaus: [${statusText}]${' '.repeat(statusPadRight)}║`;

    const einnahmen = (data.einnahmenCent / 100).toFixed(2).replace('.', ',');
    const footer = `Uhrzeit: ${formatSimulationszeit(data.aktuellerTick)} | Einnahmen: ${einnahmen} €`;
    const footerPadLeft = Math.floor((contentWidth - footer.length) / 2);
    const footerPadRight = contentWidth - footer.length - footerPadLeft;
    const footerLine = `║${' '.repeat(footerPadLeft)}${footer}${' '.repeat(footerPadRight)}║`;

    // Nur Status und Uhrzeit aktualisieren; Cursor und Eingabezeile bleiben unangetastet.
    process.stdout.write('\x1b[s');
    process.stdout.write(`\x1b[4;1H\x1b[2K${statusLine}`);
    process.stdout.write(`\x1b[${12 + rowCount};1H\x1b[2K${footerLine}`);
    process.stdout.write('\x1b[u');
}

function formatSimulationszeit(tick: number): string {
    const minutenSeitMitternacht = 8 * 60 + tick;
    const stunden = Math.floor(minutenSeitMitternacht / 60);
    const minuten = minutenSeitMitternacht % 60;
    return `${String(stunden).padStart(2, '0')}:${String(minuten).padStart(2, '0')}`;
}

// ==========================================
// TEST-AUFRUFE FÜR BEIDE MODI
// ==========================================

const testBetrieb: Parkhaus = {
    mode: 'BETRIEB',
    kapazitaet: 20,
    geparkteAutos: [],
    ausgefahreneAutos: [],
    einnahmenCent: 0,
    aktuellerTick: 0,
    istGeoeffnet: false,
};

const testAbrechnung: Parkhaus = {
    mode: 'ABRECHNUNG',
    kapazitaet: 20,
    geparkteAutos: [],
    ausgefahreneAutos: [],
    einnahmenCent: 1550,
    aktuellerTick: 0,
    istGeoeffnet: false,
    // Test mit 12 Kennzeichen, um den Zeilenumbruch (> 9) zu demonstrieren
    abrechnungszeitraum: '08:00 - 09:00',
};

// Teste den laufenden Betrieb (schaltet nach Belieben um)
// renderParkhausUI(testAbrechnung);



main();