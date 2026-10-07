type Auto = {
    kennzeichen: string;
    einfahrtTick: number;
    geplanteParkdauerMinuten: number;
};

type Abrechnung = {
    auto: Auto;
    ausfahrtTick: number;
    preisCent: number;
};

const element = <T extends HTMLElement>(id: string): T => {
    const found = document.getElementById(id);
    if (!found) throw new Error(`Element #${id} wurde nicht gefunden.`);
    return found as T;
};

const clock = element<HTMLElement>('clock');
const capacityInput = element<HTMLInputElement>('capacity');
const speedInput = element<HTMLSelectElement>('speed');
const statusStrip = element<HTMLElement>('statusStrip');
const statusText = element<HTMLElement>('statusText');
const statusMessage = element<HTMLElement>('statusMessage');
const occupancy = element<HTMLElement>('occupancy');
const progressTrack = element<HTMLProgressElement>('progressTrack');
const spaces = element<HTMLElement>('spaces');
const openButton = element<HTMLButtonElement>('openButton');
const finishButton = element<HTMLButtonElement>('finishButton');
const parkButton = element<HTMLButtonElement>('parkButton');
const resetButton = element<HTMLButtonElement>('resetButton');
const carDetails = element<HTMLElement>('carDetails');
const selectedPlateOutput = element<HTMLElement>('selectedPlate');
const carEntryTime = element<HTMLElement>('carEntryTime');
const carDuration = element<HTMLElement>('carDuration');
const carPlannedExit = element<HTMLElement>('carPlannedExit');
const carCurrentPrice = element<HTMLElement>('carCurrentPrice');
const closeCarDetailsButton = element<HTMLButtonElement>('closeCarDetails');
const selectedExitButton = element<HTMLButtonElement>('selectedExitButton');
const revenueOutput = element<HTMLElement>('revenue');
const estimatedRevenueOutput = element<HTMLElement>('estimatedRevenue');
const activityList = element<HTMLUListElement>('activityList');
const eventCount = element<HTMLElement>('eventCount');
const billing = element<HTMLElement>('billing');
const billingSummary = element<HTMLElement>('billingSummary');
const billingList = element<HTMLUListElement>('billingList');

let capacity = 25;
let parkedCars: Auto[] = [];
let receipts: Abrechnung[] = [];
let revenueCent = 0;
let currentTick = 0;
let isOpen = false;
let isFinished = false;
let selectedCarPlate: string | null = null;
let intervalId: number | undefined;
let eventTotal = 0;

function formatTime(tick: number): string {
    const minutes = 8 * 60 + tick;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}

function formatEuro(cents: number): string {
    return new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

function formatDuration(minutes: number): string {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours} Std. ${String(remainingMinutes).padStart(2, '0')} Min.` : `${remainingMinutes} Min.`;
}

function calculatePrice(car: Auto, exitTick: number): number {
    const duration = Math.max(0, exitTick - car.einfahrtTick);
    const hours = Math.max(1, Math.ceil(duration / 60));
    let priceCent = 0;
    for (let hour = 0; hour < hours; hour++) priceCent += Math.max(0, 100 - hour * 10);
    return priceCent;
}

function createCar(): Auto {
    const occupiedPlates = new Set(parkedCars.map((car) => car.kennzeichen));
    let plate: string;
    do {
        plate = String(Math.floor(Math.random() * 10000)).padStart(4, '0');
    } while (occupiedPlates.has(plate));

    return {
        kennzeichen: plate,
        einfahrtTick: currentTick,
        geplanteParkdauerMinuten: Math.floor(Math.random() * 1440) + 1,
    };
}

function addEvent(message: string): void {
    eventTotal++;
    const row = document.createElement('li');
    const text = document.createElement('span');
    const time = document.createElement('time');
    text.textContent = message;
    time.textContent = formatTime(currentTick);
    row.append(text, time);
    activityList.prepend(row);
    while (activityList.children.length > 6) activityList.lastElementChild?.remove();
    eventCount.textContent = `${eventTotal} ${eventTotal === 1 ? 'Ereignis' : 'Ereignisse'}`;
}

function exitCar(plate: string, automatic = false): Abrechnung | undefined {
    const index = parkedCars.findIndex((car) => car.kennzeichen === plate);
    if (index < 0) return undefined;
    const car = parkedCars[index];
    if (!car) return undefined;

    const receipt = { auto: car, ausfahrtTick: currentTick, preisCent: calculatePrice(car, currentTick) };
    parkedCars.splice(index, 1);
    receipts.push(receipt);
    revenueCent += receipt.preisCent;
    if (selectedCarPlate === plate) selectedCarPlate = null;
    addEvent(`${automatic ? 'Automatische Ausfahrt' : 'Ausfahrt'} · ${car.kennzeichen} · ${formatEuro(receipt.preisCent)}`);
    return receipt;
}

function parkCar(automatic = false): void {
    if (!isOpen || parkedCars.length >= capacity) return;
    const car = createCar();
    parkedCars.push(car);
    addEvent(`${automatic ? 'Automatische Einfahrt' : 'Einfahrt'} · ${car.kennzeichen}`);
    render();
}

function runTick(): void {
    currentTick++;
    if (currentTick >= 14 * 60) {
        finishDay();
        return;
    }

    const plannedDepartures = parkedCars
        .filter((car) => currentTick - car.einfahrtTick >= car.geplanteParkdauerMinuten)
        .map((car) => car.kennzeichen);
    for (const plate of plannedDepartures) exitCar(plate, true);

    if (currentTick % 120 === 0 && parkedCars.length / capacity > 0.8) {
        const departureLimit = Math.floor(capacity * 0.1);
        const eligible = [...parkedCars]
            .filter((car) => currentTick - car.einfahrtTick >= 240)
            .sort((first, second) => first.einfahrtTick - second.einfahrtTick)
            .slice(0, departureLimit);
        for (const car of eligible) exitCar(car.kennzeichen, true);
    }

    if (isOpen && parkedCars.length < capacity && Math.random() >= 0.5) parkCar(true);
    render();
}

function finishDay(): void {
    if (isFinished) return;
    if (intervalId !== undefined) window.clearInterval(intervalId);
    intervalId = undefined;
    isOpen = false;
    isFinished = true;
    for (const car of [...parkedCars]) exitCar(car.kennzeichen, true);
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

function render(): void {
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

    spaces.replaceChildren();
    for (let index = 0; index < capacity; index++) {
        const slot = document.createElement('button');
        slot.type = 'button';
        slot.className = 'space';
        const car = parkedCars[index];
        slot.disabled = !car || !isOpen;
        slot.setAttribute('aria-label', car
            ? `Auto ${car.kennzeichen} auf Platz ${index + 1} ausparken`
            : `Platz ${index + 1}, frei`);
        const number = document.createElement('span');
        number.className = 'space-number';
        number.textContent = String(index + 1).padStart(2, '0');
        slot.append(number);
        if (car) {
            slot.classList.add('occupied');
            slot.dataset.plate = car.kennzeichen;
            slot.setAttribute('aria-pressed', String(selectedCarPlate === car.kennzeichen));
            if (selectedCarPlate === car.kennzeichen) slot.classList.add('selected');
            slot.title = `Details für Auto ${car.kennzeichen} anzeigen`;
            const plate = document.createElement('strong');
            plate.textContent = car.kennzeichen;
            slot.append(plate);
        } else {
            const free = document.createElement('span');
            free.textContent = 'FREI';
            slot.append(free);
        }
        spaces.append(slot);
    }

    const selectedCar = parkedCars.find((car) => car.kennzeichen === selectedCarPlate);
    carDetails.hidden = !selectedCar || !isOpen;
    if (selectedCar && isOpen) {
        const duration = currentTick - selectedCar.einfahrtTick;
        selectedPlateOutput.textContent = selectedCar.kennzeichen;
        carEntryTime.textContent = formatTime(selectedCar.einfahrtTick);
        carDuration.textContent = formatDuration(duration);
        const plannedExitTick = Math.min(14 * 60, selectedCar.einfahrtTick + selectedCar.geplanteParkdauerMinuten);
        carPlannedExit.textContent = formatTime(plannedExitTick);
        carCurrentPrice.textContent = formatEuro(calculatePrice(selectedCar, currentTick));
        selectedExitButton.disabled = !isOpen || isFinished;
    }

    const canOperate = isOpen && !isFinished;
    openButton.disabled = canOperate || isFinished;
    finishButton.disabled = !canOperate;
    parkButton.disabled = !canOperate || parkedCount >= capacity;
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
spaces.addEventListener('click', (event: MouseEvent) => {
    const target = event.target;
    if (!(target instanceof Element)) return;
    const slot = target.closest<HTMLButtonElement>('button[data-plate]');
    if (!slot || !isOpen) return;
    const plate = slot.dataset.plate;
    if (plate) {
        selectedCarPlate = selectedCarPlate === plate ? null : plate;
        render();
        if (selectedCarPlate) {
            spaces.querySelector<HTMLButtonElement>(`button[data-plate="${selectedCarPlate}"]`)?.focus();
        }
    }
});
closeCarDetailsButton.addEventListener('click', () => {
    selectedCarPlate = null;
    render();
});
selectedExitButton.addEventListener('click', () => {
    if (selectedCarPlate && isOpen) {
        exitCar(selectedCarPlate);
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
    selectedCarPlate = null;
    eventTotal = 0;
    activityList.replaceChildren();
    eventCount.textContent = '0 Ereignisse';
    billing.hidden = true;
    addEvent('Neuer Betriebstag bereit.');
    render();
});

render();