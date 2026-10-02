//zum testen start mit "npx ts-node Parkhaus.ts"



import * as readline from 'node:readline/promises';

async function main() {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  const antwort = await rl.question('Zeit-Multiplikator eingeben: ');
  rl.close();

  // Multiplikator einlesen oder Standardwert 1 nutzen
  const multiplikator = Number(antwort) || 1;

  let ticks = 0;
  console.log(`Timer gestartet (Intervall: ${1000 / multiplikator}ms)...`);

  setInterval(() => {
    ticks++;
    console.log(`Ticks gezählt: ${ticks}`);
  }, 1000 / multiplikator);
}

main();