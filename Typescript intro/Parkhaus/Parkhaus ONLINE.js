"use strict";
const element = (id) => {
    const found = document.getElementById(id);
    if (!found)
        throw new Error(`Element #${id} wurde nicht gefunden.`);
    return found;
};
const clock = element('clock');
const capacityInput = element('capacity');
const speedInput = element('speed');
const statusStrip = element('statusStrip');
const statusText = element('statusText');
const statusMessage = element('statusMessage');
const occupancy = element('occupancy');
const progressTrack = element('progressTrack');
const spaces = element('spaces');
const openButton = element('openButton');
const finishButton = element('finishButton');
const parkButton = element('parkButton');
const carSelect = element('carSelect');
const unparkButton = element('unparkButton');
const resetButton = element('resetButton');
const revenueOutput = element('revenue');
const estimatedRevenueOutput = element('estimatedRevenue');
const activityList = element('activityList');
const eventCount = element('eventCount');
const billing = element('billing');
const billingSummary = element('billingSummary');
const billingList = element('billingList');
let capacity = 25;
let parkedCars = [];
let receipts = [];
let revenueCent = 0;
let currentTick = 0;
let isOpen = false;
let isFinished = false;
let intervalId;
let eventTotal = 0;
function formatTime(tick) {
    const minutes = 8 * 60 + tick;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
function formatEuro(cents) {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
function calculatePrice(car, exitTick) {
    const duration = Math.max(0, exitTick - car.einfahrtTick);
    const hours = Math.max(1, Math.ceil(duration / 60));
    let priceCent = 0;
    for (let hour = 0; hour < hours; hour++)
        priceCent += Math.max(0, 100 - hour * 10);
    return priceCent;
}
function createCar() {
    const occupiedPlates = new Set(parkedCars.map((car) => car.kennzeichen));
    let plate;
    do {
        plate = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    } while (occupiedPlates.has(plate));
    return {
        kennzeichen: plate,
        einfahrtTick: currentTick,
        geplanteParkdauerMinuten: Math.floor(Math.random() * 1440) + 1,
    };
}
function addEvent(message) {
    eventTotal++;
    const row = document.createElement('li');
    const text = document.createElement('span');
    const time = document.createElement('time');
    text.textContent = message;
    time.textContent = formatTime(currentTick);
    row.append(text, time);
    activityList.prepend(row);
    while (activityList.children.length > 6)
        activityList.lastElementChild?.remove();
    eventCount.textContent = `${eventTotal} ${eventTotal === 1 ? 'Ereignis' : 'Ereignisse'}`;
}
function exitCar(plate, automatic = false) {
    const index = parkedCars.findIndex((car) => car.kennzeichen === plate);
    if (index < 0)
        return undefined;
    const car = parkedCars[index];
    if (!car)
        return undefined;
    const receipt = { auto: car, ausfahrtTick: currentTick, preisCent: calculatePrice(car, currentTick) };
    parkedCars.splice(index, 1);
    receipts.push(receipt);
    revenueCent += receipt.preisCent;
    addEvent(`${automatic ? 'Automatische Ausfahrt' : 'Ausfahrt'} · ${car.kennzeichen} · ${formatEuro(receipt.preisCent)}`);
    return receipt;
}
function parkCar(automatic = false) {
    if (!isOpen || parkedCars.length >= capacity)
        return;
    const car = createCar();
    parkedCars.push(car);
    addEvent(`${automatic ? 'Automatische Einfahrt' : 'Einfahrt'} · ${car.kennzeichen}`);
    render();
}
function runTick() {
    currentTick++;
    if (currentTick >= 14 * 60) {
        finishDay();
        return;
    }
    const plannedDepartures = parkedCars
        .filter((car) => currentTick - car.einfahrtTick >= car.geplanteParkdauerMinuten)
        .map((car) => car.kennzeichen);
    for (const plate of plannedDepartures)
        exitCar(plate, true);
    if (currentTick % 120 === 0 && parkedCars.length / capacity > 0.8) {
        const departureLimit = Math.floor(capacity * 0.1);
        const eligible = [...parkedCars]
            .filter((car) => currentTick - car.einfahrtTick >= 240)
            .sort((first, second) => first.einfahrtTick - second.einfahrtTick)
            .slice(0, departureLimit);
        for (const car of eligible)
            exitCar(car.kennzeichen, true);
    }
    if (isOpen && parkedCars.length < capacity && Math.random() >= 0.5)
        parkCar(true);
    render();
}
function finishDay() {
    if (isFinished)
        return;
    if (intervalId !== undefined)
        window.clearInterval(intervalId);
    intervalId = undefined;
    isOpen = false;
    isFinished = true;
    for (const car of [...parkedCars])
        exitCar(car.kennzeichen, true);
    addEvent('Betriebstag abgerechnet.');
    billing.hidden = false;
    billingSummary.textContent = `${receipts.length} Fahrzeuge · ${formatEuro(revenueCent)} Einnahmen · Abrechnung um ${formatTime(currentTick)} Uhr`;
    billingList.replaceChildren();
    for (const receipt of receipts) {
        const item = document.createElement('li');
        item.textContent = `${receipt.auto.kennzeichen} · ${formatTime(receipt.ausfahrtTick)} · ${formatEuro(receipt.preisCent)}`;
        billingList.append(item);
    }
    render();
}
function render() {
    const parkedCount = parkedCars.length;
    const percentage = Math.round((parkedCount / capacity) * 100);
    clock.textContent = formatTime(currentTick);
    statusStrip.dataset.open = String(isOpen);
    statusText.textContent = isOpen ? 'OFFEN' : isFinished ? 'ABGERECHNET' : 'GESCHLOSSEN';
    occupancy.textContent = `${parkedCount} von ${capacity} Plätzen · ${percentage} %`;
    progressTrack.max = capacity;
    progressTrack.value = parkedCount;
    revenueOutput.textContent = formatEuro(revenueCent);
    const estimated = parkedCars.reduce((total, car) => total + calculatePrice(car, currentTick), revenueCent);
    estimatedRevenueOutput.textContent = formatEuro(estimated);
    statusMessage.textContent = isFinished
        ? 'Der Betriebstag ist abgeschlossen.'
        : isOpen
            ? 'Automatische Ein- und Ausfahrten sind aktiv.'
            : 'Konfiguriere das Parkhaus und starte den Betrieb.';
    const carsByPlate = new Map(parkedCars.map((car) => [car.kennzeichen, car]));
    spaces.replaceChildren();
    for (let index = 0; index < capacity; index++) {
        const slot = document.createElement('div');
        const car = parkedCars[index];
        slot.className = car ? 'space occupied' : 'space';
        slot.setAttribute('aria-label', car ? `Platz ${index + 1}, Kennzeichen ${car.kennzeichen}` : `Platz ${index + 1}, frei`);
        const number = document.createElement('span');
        number.className = 'space-number';
        number.textContent = String(index + 1).padStart(2, '0');
        slot.append(number);
        if (car) {
            const plate = document.createElement('strong');
            plate.textContent = car.kennzeichen;
            slot.append(plate);
        }
        else {
            const free = document.createElement('span');
            free.textContent = 'FREI';
            slot.append(free);
        }
        spaces.append(slot);
    }
    carSelect.replaceChildren();
    if (parkedCars.length === 0) {
        const option = document.createElement('option');
        option.value = '';
        option.textContent = 'Keine Autos geparkt';
        carSelect.append(option);
    }
    else {
        for (const car of parkedCars) {
            const option = document.createElement('option');
            option.value = car.kennzeichen;
            option.textContent = `${car.kennzeichen} · seit ${formatTime(car.einfahrtTick)}`;
            carSelect.append(option);
        }
    }
    const canOperate = isOpen && !isFinished;
    openButton.disabled = canOperate || isFinished;
    finishButton.disabled = !canOperate;
    parkButton.disabled = !canOperate || parkedCount >= capacity;
    carSelect.disabled = !canOperate || parkedCount === 0;
    unparkButton.disabled = !canOperate || parkedCount === 0;
    capacityInput.disabled = canOperate || isFinished;
    speedInput.disabled = canOperate || isFinished;
    resetButton.hidden = !isFinished;
}
openButton.addEventListener('click', () => {
    const requestedCapacity = Number(capacityInput.value);
    if (!Number.isInteger(requestedCapacity) || requestedCapacity < 1 || requestedCapacity > 100) {
        capacityInput.setCustomValidity('Bitte eine ganze Zahl zwischen 1 und 100 eingeben.');
        capacityInput.reportValidity();
        return;
    }
    capacityInput.setCustomValidity('');
    capacity = requestedCapacity;
    isOpen = true;
    addEvent('Parkhaus geöffnet.');
    intervalId = window.setInterval(runTick, 60000 / Number(speedInput.value));
    render();
});
finishButton.addEventListener('click', finishDay);
parkButton.addEventListener('click', () => parkCar());
unparkButton.addEventListener('click', () => {
    if (carSelect.value) {
        exitCar(carSelect.value);
        render();
    }
});
resetButton.addEventListener('click', () => {
    capacity = Number(capacityInput.value);
    parkedCars = [];
    receipts = [];
    revenueCent = 0;
    currentTick = 0;
    isOpen = false;
    isFinished = false;
    eventTotal = 0;
    activityList.replaceChildren();
    eventCount.textContent = '0 Ereignisse';
    billing.hidden = true;
    addEvent('Neuer Betriebstag bereit.');
    render();
});
render();
