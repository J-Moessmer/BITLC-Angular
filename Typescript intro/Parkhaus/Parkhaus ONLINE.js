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
const resetButton = element('resetButton');
const languageSelect = element('languageSelect');
const carDetails = element('carDetails');
const selectedPlateOutput = element('selectedPlate');
const carEntryTime = element('carEntryTime');
const carDuration = element('carDuration');
const carPlannedExit = element('carPlannedExit');
const carCurrentPrice = element('carCurrentPrice');
const closeCarDetailsButton = element('closeCarDetails');
const selectedExitButton = element('selectedExitButton');
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
let selectedCarPlate = null;
let intervalId;
let eventTotal = 0;
let activeLanguage = 'de';
let translations = {};
let germanTranslations = {};
const translationCache = {};
let activityEvents = [];
function translate(key, values = {}) {
    const template = translations[key] ?? germanTranslations[key] ?? key;
    return template.replace(/\{(\w+)\}/g, (placeholder, name) => String(values[name] ?? placeholder));
}
async function fetchTranslations(language) {
    const response = await fetch(`../../${language}.lang?v=1`);
    if (!response.ok)
        throw new Error(`Sprachdatei ${language}.lang konnte nicht geladen werden.`);
    const data = await response.json();
    if (!data || typeof data !== 'object' || Array.isArray(data)) {
        throw new Error(`Sprachdatei ${language}.lang hat ein ungültiges Format.`);
    }
    if (Object.values(data).some((value) => typeof value !== 'string')) {
        throw new Error(`Sprachdatei ${language}.lang enthält ungültige Übersetzungen.`);
    }
    return data;
}
function applyStaticTranslations() {
    document.documentElement.lang = activeLanguage;
    document.title = translate('documentTitle');
    document.querySelector('meta[name="description"]')?.setAttribute('content', translate('metaDescription'));
    document.querySelectorAll('[data-i18n]').forEach((node) => {
        const key = node.dataset.i18n;
        if (key)
            node.textContent = translate(key);
    });
    document.querySelectorAll('[data-i18n-aria]').forEach((node) => {
        const key = node.dataset.i18nAria;
        if (key)
            node.setAttribute('aria-label', translate(key));
    });
    document.querySelectorAll('[data-i18n-title]').forEach((node) => {
        const key = node.dataset.i18nTitle;
        if (key)
            node.title = translate(key);
    });
    document.querySelectorAll('[data-i18n-content]').forEach((node) => {
        const key = node.dataset.i18nContent;
        if (key)
            node.content = translate(key);
    });
}
async function setLanguage(language) {
    try {
        const catalog = translationCache[language] ?? await fetchTranslations(language);
        translationCache[language] = catalog;
        translations = catalog;
        activeLanguage = language;
        try {
            localStorage.setItem('project-language', language);
        }
        catch {
            // Storage may be unavailable in private browsing contexts.
        }
        languageSelect.value = language;
        applyStaticTranslations();
        render();
        renderActivity();
        if (isFinished)
            renderBilling();
    }
    catch (error) {
        languageSelect.value = activeLanguage;
        console.error(error);
    }
}
async function initializeLanguage() {
    languageSelect.disabled = true;
    let preferredLanguage = 'de';
    try {
        preferredLanguage = localStorage.getItem('project-language') === 'en' ? 'en' : 'de';
    }
    catch {
        preferredLanguage = 'de';
    }
    try {
        germanTranslations = await fetchTranslations('de');
        translationCache.de = germanTranslations;
        translations = germanTranslations;
        if (preferredLanguage === 'en') {
            try {
                translations = await fetchTranslations('en');
                translationCache.en = translations;
                activeLanguage = 'en';
            }
            catch (error) {
                console.error(error);
                activeLanguage = 'de';
            }
        }
    }
    catch (error) {
        console.error(error);
    }
    languageSelect.value = activeLanguage;
    languageSelect.disabled = false;
    applyStaticTranslations();
    render();
    renderActivity();
}
function formatTime(tick) {
    const minutes = 8 * 60 + tick;
    return `${String(Math.floor(minutes / 60)).padStart(2, '0')}:${String(minutes % 60).padStart(2, '0')}`;
}
function formatEuro(cents) {
    const locale = activeLanguage === 'de' ? 'de-DE' : 'en-GB';
    return new Intl.NumberFormat(locale, { style: 'currency', currency: 'EUR' }).format(cents / 100);
}
function formatDuration(minutes) {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    if (hours === 0) {
        const unit = translate(remainingMinutes === 1 ? 'duration.minuteOne' : 'duration.minuteMany');
        return `${remainingMinutes} ${unit}`;
    }
    const hourUnit = translate(hours === 1 ? 'duration.hourOne' : 'duration.hourMany');
    const minuteUnit = translate(remainingMinutes === 1 ? 'duration.minuteOne' : 'duration.minuteMany');
    return `${hours} ${hourUnit} ${String(remainingMinutes).padStart(2, '0')} ${minuteUnit}`;
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
function renderActivity() {
    activityList.replaceChildren();
    const entries = activityEvents.length > 0
        ? [...activityEvents].reverse().slice(0, 6)
        : [{ key: 'event.ready', tick: 0 }];
    for (const entry of entries) {
        const row = document.createElement('li');
        const text = document.createElement('span');
        const time = document.createElement('time');
        text.textContent = translate(entry.key, {
            plate: entry.plate ?? '',
            price: formatEuro(entry.priceCent ?? 0),
        });
        time.textContent = formatTime(entry.tick);
        row.append(text, time);
        activityList.append(row);
    }
    const countKey = eventTotal === 1 ? 'eventCount.one' : 'eventCount.many';
    eventCount.textContent = translate(countKey, { count: eventTotal });
}
function addEvent(key, plate, priceCent) {
    const entry = { key, tick: currentTick };
    if (plate !== undefined)
        entry.plate = plate;
    if (priceCent !== undefined)
        entry.priceCent = priceCent;
    activityEvents.push(entry);
    eventTotal++;
    renderActivity();
}
function renderBilling() {
    const summaryKey = receipts.length === 1 ? 'billing.summary.one' : 'billing.summary.many';
    billingSummary.textContent = translate(summaryKey, {
        count: receipts.length,
        revenue: formatEuro(revenueCent),
        time: formatTime(currentTick),
    });
    billingList.replaceChildren();
    for (const receipt of receipts) {
        const item = document.createElement('li');
        item.textContent = translate('billing.receipt', {
            plate: receipt.auto.kennzeichen,
            time: formatTime(receipt.ausfahrtTick),
            price: formatEuro(receipt.preisCent),
        });
        billingList.append(item);
    }
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
    if (selectedCarPlate === plate)
        selectedCarPlate = null;
    addEvent(automatic ? 'event.automaticExit' : 'event.manualExit', car.kennzeichen, receipt.preisCent);
    return receipt;
}
function parkCar(automatic = false) {
    if (!isOpen || parkedCars.length >= capacity)
        return;
    const car = createCar();
    parkedCars.push(car);
    addEvent(automatic ? 'event.automaticEntry' : 'event.manualEntry', car.kennzeichen);
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
    addEvent('event.finish');
    billing.hidden = false;
    renderBilling();
    render();
}
function createParkingSlot(index) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'space';
    const number = document.createElement('span');
    number.className = 'space-number';
    number.textContent = String(index + 1).padStart(2, '0');
    const plate = document.createElement('strong');
    plate.className = 'space-plate';
    const free = document.createElement('span');
    free.className = 'space-free';
    free.textContent = 'FREI';
    slot.append(number, plate, free);
    spaces.append(slot);
    return slot;
}
function render() {
    const parkedCount = parkedCars.length;
    const percentage = Math.round((parkedCount / capacity) * 100);
    clock.textContent = formatTime(currentTick);
    statusStrip.dataset.open = String(isOpen);
    statusText.textContent = translate(isOpen ? 'status.open' : isFinished ? 'status.finished' : 'status.closed');
    occupancy.textContent = translate('occupancy', { occupied: parkedCount, capacity, percent: percentage });
    progressTrack.max = capacity;
    progressTrack.value = parkedCount;
    revenueOutput.textContent = formatEuro(revenueCent);
    const estimated = parkedCars.reduce((total, car) => total + calculatePrice(car, currentTick), revenueCent);
    estimatedRevenueOutput.textContent = formatEuro(estimated);
    statusMessage.textContent = translate(isFinished
        ? 'status.complete'
        : isOpen
            ? 'status.running'
            : 'status.ready');
    const slots = Array.from(spaces.querySelectorAll('.space'));
    while (slots.length < capacity)
        slots.push(createParkingSlot(slots.length));
    while (slots.length > capacity)
        slots.pop()?.remove();
    for (const [index, slot] of slots.entries()) {
        const car = parkedCars[index];
        slot.disabled = !car || !isOpen;
        slot.classList.toggle('occupied', Boolean(car));
        slot.classList.toggle('selected', Boolean(car && selectedCarPlate === car.kennzeichen));
        slot.setAttribute('aria-label', car
            ? translate('tile.select', { plate: car.kennzeichen, space: index + 1 })
            : translate('tile.free', { space: index + 1 }));
        slot.setAttribute('aria-pressed', String(Boolean(car && selectedCarPlate === car.kennzeichen)));
        if (car) {
            slot.dataset.plate = car.kennzeichen;
            slot.title = translate('tile.title', { plate: car.kennzeichen });
        }
        else {
            delete slot.dataset.plate;
            slot.title = '';
        }
        const plateLabel = slot.querySelector('.space-plate');
        const freeLabel = slot.querySelector('.space-free');
        if (plateLabel)
            plateLabel.textContent = car?.kennzeichen ?? '';
        if (freeLabel) {
            freeLabel.hidden = Boolean(car);
            freeLabel.textContent = translate('free');
        }
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
        capacityInput.setCustomValidity(translate('validation.capacity'));
        capacityInput.reportValidity();
        return;
    }
    capacityInput.setCustomValidity('');
    capacity = requestedCapacity;
    isOpen = true;
    addEvent('event.open');
    intervalId = window.setInterval(runTick, 60000 / Number(speedInput.value));
    render();
});
finishButton.addEventListener('click', finishDay);
parkButton.addEventListener('click', () => parkCar());
spaces.addEventListener('click', (event) => {
    const target = event.target;
    if (!(target instanceof Element))
        return;
    const slot = target.closest('button[data-plate]');
    if (!slot || !isOpen)
        return;
    const plate = slot.dataset.plate;
    if (plate) {
        selectedCarPlate = selectedCarPlate === plate ? null : plate;
        render();
        if (selectedCarPlate) {
            spaces.querySelector(`button[data-plate="${selectedCarPlate}"]`)?.focus();
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
    activityEvents = [];
    billing.hidden = true;
    addEvent('event.newDay');
    render();
});
languageSelect.addEventListener('change', () => {
    void setLanguage(languageSelect.value === 'en' ? 'en' : 'de');
});
capacityInput.addEventListener('input', () => capacityInput.setCustomValidity(''));
void initializeLanguage();
