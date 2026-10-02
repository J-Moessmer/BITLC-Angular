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
    const geparkteAutos: Auto[] = testBetrieb.plates.map((kennzeichen) => ({
        kennzeichen,
        einfahrtTick: ticks,
        geplanteParkdauerMinuten: null,
    }));
    testBetrieb.timeOrPeriod = '08:00';
    testBetrieb.isOpen = false;
    renderParkhausUI(testBetrieb);

    // Ticks von MMMM in HH:MM umrechnen

    const tick = () => {
        ticks++;
        const minutenSeitMitternacht = 8 * 60 + ticks;
        const stunden = Math.floor(minutenSeitMitternacht / 60);
        const minuten = minutenSeitMitternacht % 60;
        testBetrieb.timeOrPeriod = `${String(stunden).padStart(2, '0')}:${String(minuten).padStart(2, '0')}`;

        // teste öffnngszeit 14h nach 08:00 also 22:00 Uhr

        if (ticks >= 14 * 60) {
            testBetrieb.isOpen = false;
            if (interval) clearInterval(interval);
            renderParkhausUI(testBetrieb);
            rl.close();
            return;
        }
        // kapazitätstest
        const kapazitaet = testBetrieb.maxSpaces ?? 25;
        if (testBetrieb.isOpen && geparkteAutos.length < kapazitaet && generateauto()) {
            const auto = generateAuto(ticks, geparkteAutos.map((geparkt) => geparkt.kennzeichen));
            geparkteAutos.push(auto);
            testBetrieb.plates = geparkteAutos.map((geparkt) => geparkt.kennzeichen);
            renderParkhausUI(testBetrieb);
            rl.prompt(true);
        } else {
            updateLiveParkhausUI(testBetrieb);
        }
    };

    rl.setPrompt('Befehl > ');
    rl.on('line', (eingabe) => {
        const befehl = eingabe.trim().toLocaleLowerCase('de-DE');

        if (befehl === 'öffnen') {
            if (!testBetrieb.isOpen && ticks < 14 * 60) {
                testBetrieb.isOpen = true;
                updateLiveParkhausUI(testBetrieb);
                interval = setInterval(tick, 60000 / multiplikator);
            }
        } else if (befehl === 'einparken') {
            const kapazitaet = testBetrieb.maxSpaces ?? 25;
            if (!testBetrieb.isOpen) {
                console.log('Das Parkhaus ist geschlossen.');
            } else if (geparkteAutos.length >= kapazitaet) {
                console.log('Das Parkhaus ist voll.');
            } else {
                const auto = generateAuto(ticks, geparkteAutos.map((geparkt) => geparkt.kennzeichen));
                geparkteAutos.push(auto);
                testBetrieb.plates = geparkteAutos.map((geparkt) => geparkt.kennzeichen);
                renderParkhausUI(testBetrieb);
                console.log(`Auto ${auto.kennzeichen} eingefahren bei Tick ${auto.einfahrtTick}.`);
            }
        } else if (befehl === 'schließen' || befehl === 'schliessen' || befehl === 'ende') {
            if (interval) clearInterval(interval);
            testBetrieb.isOpen = false;
            renderParkhausUI(testBetrieb);
            rl.close();
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
	kapazitaet: number;
	geparkteAutos: Auto[];
	ausgefahreneAutos: Auto[];
	einnahmenCent: number;
	aktuellerTick: number;
	istGeoeffnet: boolean;
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

interface ParkhausData {
    mode: UIMode;
    isOpen?: boolean;          // Nur für BETRIEB
    maxSpaces?: number;        // Nur für BETRIEB
    plates: string[];          // Kennzeichen-Liste
    timeOrPeriod: string;      // "08:00" oder "08:00 - 09:00"
    earnings: number;
}

let uiInitialized = false;

function renderParkhausUI(data: ParkhausData): void {
    // Nur beim ersten Frame leeren; danach dieselbe UI-Position überschreiben.
    process.stdout.write(uiInitialized ? '\x1b[H\x1b[?25l' : '\x1b[2J\x1b[H\x1b[?25l');
    uiInitialized = true;

    const totalWidth = 64;
    const contentWidth = 62; // Effektiver Raum zwischen den ║

    // --- 1. HEADER REIHEN ---
    console.log('╔══════════════════════════════════════════════════════════════╗');
    const title = data.mode === 'BETRIEB' ? 'Parkhaus UI' : 'Abrechnung UI';
    console.log(`║${title.padStart(31 + Math.floor(title.length / 2)).padEnd(contentWidth)}║`);
    console.log('╠══════════════════════════════════════════════════════════════╣');

    // --- 2. STATUS / RECHNUNGSZEILE ---
    if (data.mode === 'BETRIEB') {
        const statusText = data.isOpen ? '\x1b[1;32mOFFEN\x1b[0m' : '\x1b[1;31mGESCHLOSSEN\x1b[0m';
        // Da ANSI-Codes die String-Länge verfälschen, berechnen wir das Padding manuell für ein sauberes Zentrieren
        const rawText = `Parkhaus: [${data.isOpen ? 'OFFEN' : 'GESCHLOSSEN'}]`;
        const padLeft = Math.floor((contentWidth - rawText.length) / 2);
        const padRight = contentWidth - rawText.length - padLeft;
        console.log(`║${' '.repeat(padLeft)}Parkhaus: [${statusText}]${' '.repeat(padRight)}║`);

        // Ladebalken berechnen (50 Zeichen Gesamtbreite)
        const maxSpaces = data.maxSpaces || 1;
        const currentSpaces = data.plates.length;
        const percentage = Math.min(1, Math.max(0, currentSpaces / maxSpaces));
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
    const rowCount = Math.max(1, Math.ceil(data.plates.length / platesPerRow));

    for (let r = 0; r < rowCount; r++) {
        const rowPlates: string[] = [];
        for (let i = 0; i < platesPerRow; i++) {
            const index = r * platesPerRow + i;
            if (index < data.plates.length) {
                // Formatiere jedes Kennzeichen auf exakt 4 Zeichen
                const plate = data.plates[index];
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
        const maxSpaces = data.maxSpaces || 20;
        const count = data.plates.length;
        const percent = Math.round((count / maxSpaces) * 100);
        const statsStr = `Plätze belegt: ${count}/${maxSpaces} (${percent} %)`;
        console.log(`║ ${statsStr.padEnd(contentWidth - 2)} ║`);
    } else {
        const statsStr = `Summe aller erfassten Kennzeichen: ${data.plates.length}`;
        console.log(`║ ${statsStr.padEnd(contentWidth - 2)} ║`);
    }

    console.log('╠══════════════════════════════════════════════════════════════╣');
    console.log('║                                                              ║');

    // --- 4. INFO UND EINNAHMEN ---
    let footerStr = '';
    if (data.mode === 'BETRIEB') {
        footerStr = `Uhrzeit: ${data.timeOrPeriod} | Einnahmen: ${data.earnings.toFixed(2).replace('.', ',')} €`;
    } else {
        footerStr = `Abrechnungszeitraum: ${data.timeOrPeriod} | Einnahmen: ${data.earnings.toFixed(2).replace('.', ',')} €`;
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
    console.log('║          öffnen | einparken | schließen | ende               ║');
    console.log('╚══════════════════════════════════════════════════════════════╝');
    process.stdout.write('\x1b[J');
}

function updateLiveParkhausUI(data: ParkhausData): void {
    const contentWidth = 62;
    const rowCount = Math.max(1, Math.ceil(data.plates.length / 9));
    const statusRaw = `Parkhaus: [${data.isOpen ? 'OFFEN' : 'GESCHLOSSEN'}]`;
    const statusPadLeft = Math.floor((contentWidth - statusRaw.length) / 2);
    const statusPadRight = contentWidth - statusRaw.length - statusPadLeft;
    const statusColor = data.isOpen ? '\x1b[1;32m' : '\x1b[1;31m';
    const statusText = `${statusColor}${data.isOpen ? 'OFFEN' : 'GESCHLOSSEN'}\x1b[0m`;
    const statusLine = `║${' '.repeat(statusPadLeft)}Parkhaus: [${statusText}]${' '.repeat(statusPadRight)}║`;

    const footer = `Uhrzeit: ${data.timeOrPeriod} | Einnahmen: ${data.earnings.toFixed(2).replace('.', ',')} €`;
    const footerPadLeft = Math.floor((contentWidth - footer.length) / 2);
    const footerPadRight = contentWidth - footer.length - footerPadLeft;
    const footerLine = `║${' '.repeat(footerPadLeft)}${footer}${' '.repeat(footerPadRight)}║`;

    // Nur Status und Uhrzeit aktualisieren; Cursor und Eingabezeile bleiben unangetastet.
    process.stdout.write('\x1b[s');
    process.stdout.write(`\x1b[4;1H\x1b[2K${statusLine}`);
    process.stdout.write(`\x1b[${12 + rowCount};1H\x1b[2K${footerLine}`);
    process.stdout.write('\x1b[u');
}

// ==========================================
// TEST-AUFRUFE FÜR BEIDE MODI
// ==========================================

const testBetrieb: ParkhausData = {
    mode: 'BETRIEB',
    isOpen: true,
    maxSpaces: 20,
    plates: [],
    timeOrPeriod: '08:00',
    earnings: 0.00
};

const testAbrechnung: ParkhausData = {
    mode: 'ABRECHNUNG',
    maxSpaces: 20,
    // Test mit 12 Kennzeichen, um den Zeilenumbruch (> 9) zu demonstrieren
    plates: [], 
    timeOrPeriod: '08:00 - 09:00',
    earnings: 15.50
};

// Teste den laufenden Betrieb (schaltet nach Belieben um)
// renderParkhausUI(testAbrechnung);



main();