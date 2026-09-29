var myprompt = require('prompt-sync')({ sigint: true });

//funktionen

//definition: für texteingabeabfragen
function stringinput(prompttext){stringin = myprompt(prompttext);return stringin;}

//definition: für zahleneingabeabfragen
function numberinput(prompttext){numberin = Number(myprompt(prompttext));return numberin;}

//definition: für booleanabfragen
function booleaninput(prompttext) {
    var bool = myprompt(prompttext).trim().toLowerCase();
    if (bool === "0" || bool === "false") {
        console.log(false);
    } else if (bool === "1" || bool === "true") {
        console.log(true);
    } else {
        console.log("Ungültige Eingabe. Bitte true/false oder 1/0 eingeben.");
    }
}

console.log(stringinput("Bitte gib einen Text ein: "));
console.log(numberinput("Bitte gib eine Zahl ein: "));

booleaninput("Bitte gib einen Wahrheitswert ein (true/false): ");
