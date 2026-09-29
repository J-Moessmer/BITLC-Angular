/**
 * Taschenrechner-Projekt
 * Projekt / Modul: JavaScript Grundlagen – kleiner Taschenrechner
 * Erstellt mit: KI-Assistent / Pair-Programming Agent
 * Erstellt für / Autor: J-Moessmer
 * Datum / Version: 2026-09-29
 * Hinweis: Lernprojekt für Schul-/Übungszwecke. Keine Gewährleistung, keine Produktivverwendung.
 * Disclaimer: Dieses Programm dient ausschließlich zu Lern- und Übungszwecken.
 */

const readline = require('readline');

// Wandelt die Benutzereingabe in eine Folge von Zahlen und Operatoren um.
function tokenize(expression) {
  const cleaned = expression.replace(/\s+/g, '');

  if (cleaned.length === 0) {
    throw new Error('Bitte geben Sie eine Berechnung ein.');
  }

  // Hier sammeln wir die einzelnen Bestandteile der Rechnung.
  const tokens = [];
  // Zeiger für die aktuelle Position im String.
  let index = 0;
  // True = als Nächstes muss eine Zahl kommen, false = ein Operator erwartet.
  let expectingNumber = true;

  // Jede Stelle im String wird geprüft: Zahl oder Operator oder ungültiges Zeichen.
  while (index < cleaned.length) {
    const char = cleaned[index];

    if (/[0-9.]/.test(char)) {
      if (!expectingNumber) {
        throw new Error('Ungültige Reihenfolge: Nach einer Zahl fehlt ein Operator.');
      }

      // Zahl auslesen, z. B. "12" oder "3.5".
      let number = '';
      let dotCount = 0;

      while (index < cleaned.length) {
        const current = cleaned[index];

        if (/[0-9]/.test(current)) {
          number += current;
          index++;
        } else if (current === '.') {
          if (dotCount > 0) {
            throw new Error('Ungültige Zahl: Mehr als ein Dezimalpunkt.');
          }
          dotCount += 1;
          number += current;
          index++;
        } else {
          break;
        }
      }

      if (number === '.' || number === '') {
        throw new Error('Ungültige Zahl.');
      }

      const value = Number(number);

      if (!Number.isFinite(value)) {
        throw new Error('Ungültige Zahl.');
      }

      tokens.push(value);
      expectingNumber = false;
      continue;
    }

    if ('+-*/'.includes(char)) {
      if (expectingNumber) {
        throw new Error('Ungültige Reihenfolge: Operator an falscher Stelle.');
      }

      tokens.push(char);
      expectingNumber = true;
      index++;
      continue;
    }

    throw new Error(`Ungültiges Zeichen: "${char}"`);
  }

  if (expectingNumber) {
    throw new Error('Die Eingabe endet mit einem Operator. Bitte geben Sie eine vollständige Berechnung ein.');
  }

  // Die Eingabe muss mit einer Zahl beginnen und mit einer Zahl enden.
  if (typeof tokens[0] !== 'number' || typeof tokens[tokens.length - 1] !== 'number') {
    throw new Error('Die Berechnung muss mit einer Zahl beginnen und enden.');
  }

  // Muster prüfen: Zahl, Operator, Zahl, Operator, Zahl ...
  for (let i = 0; i < tokens.length; i++) {
    if (i % 2 === 0 && typeof tokens[i] !== 'number') {
      throw new Error('Ungültige Berechnung: Zahlen und Operatoren müssen abwechselnd vorkommen.');
    }

    if (i % 2 !== 0 && typeof tokens[i] !== 'string') {
      throw new Error('Ungültige Berechnung: Zahlen und Operatoren müssen abwechselnd vorkommen.');
    }
  }

  return tokens;
}

// Berechnet die Token-Folge gemäß der üblichen Operator-Priorität.
function calculate(tokens) {
  // Kopie erstellen, damit wir das Original-Array nicht zerstören.
  const values = [...tokens];

  // Erst Multiplikation und Division berechnen.
  for (let i = 0; i < values.length; i++) {
    if (values[i] === '*' || values[i] === '/') {
      const left = values[i - 1];
      const right = values[i + 1];

      if (values[i] === '/' && right === 0) {
        throw new Error('Division durch 0 ist nicht erlaubt.');
      }

      const result = values[i] === '*' ? left * right : left / right;
      values.splice(i - 1, 3, result);
      i--;
    }
  }

  // Danach Addition und Subtraktion von links nach rechts berechnen.
  for (let i = 0; i < values.length; i++) {
    if (values[i] === '+' || values[i] === '-') {
      const left = values[i - 1];
      const right = values[i + 1];
      const result = values[i] === '+' ? left + right : left - right;

      values.splice(i - 1, 3, result);
      i--;
    }
  }

  if (values.length !== 1 || typeof values[0] !== 'number') {
    throw new Error('Berechnung konnte nicht ausgewertet werden.');
  }

  return values[0];
}

// Startet die interaktive Konsolen-Schleife für neue Rechnungen.
function startCalculator() {
  console.log('Kleiner Taschenrechner');
  console.log('Beenden mit "exit" oder Strg+C');

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  // Wird wieder aufgerufen, damit der Benutzer immer wieder eine neue Rechnung eingeben kann.
  function askForInput() {
    rl.question('\nBerechnung > ', (input) => {
      const expression = input.trim();

      if (!expression) {
        askForInput();
        return;
      }

      if (expression.toLowerCase() === 'exit') {
        console.log('Programm beendet.');
        rl.close();
        return;
      }

      try {
        const tokens = tokenize(expression);
        const result = calculate(tokens);
        console.log(`Ergebnis: ${result}`);
      } catch (error) {
        console.log(`Fehler: ${error.message}`);
      }

      askForInput();
    });
  }

  rl.on('SIGINT', () => {
    console.log('\nProgramm beendet.');
    rl.close();
  });

  askForInput();
}

if (require.main === module) {
  startCalculator();
}

module.exports = {
  tokenize,
  calculate,
  startCalculator,
};
