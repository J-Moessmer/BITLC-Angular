(() => {
  const currentScript = document.currentScript;
  if (!(currentScript instanceof HTMLScriptElement)) return;

  const languageRoot = new URL('./', currentScript.src);
  const textNodes = new WeakMap();
  const attributes = new WeakMap();
  const dictionaries = {};
  const defaultLanguage = 'de';
  const calculatorErrorKeys = new Map([
    ['Bitte geben Sie eine Berechnung ein.', 'calculator.error.empty'],
    ['Ungültige Reihenfolge: Nach einer Zahl fehlt ein Operator.', 'calculator.error.sequence'],
    ['Ungültige Zahl: Mehr als ein Dezimalpunkt.', 'calculator.error.decimal'],
    ['Ungültige Zahl.', 'calculator.error.number'],
    ['Ungültige Reihenfolge: Operator an falscher Stelle.', 'calculator.error.operatorPosition'],
    ['Die Eingabe endet mit einem Operator. Bitte geben Sie eine vollständige Berechnung ein.', 'calculator.error.trailingOperator'],
    ['Die Berechnung muss mit einer Zahl beginnen und enden.', 'calculator.error.endsWithNumber'],
    ['Ungültige Berechnung: Zahlen und Operatoren müssen abwechselnd vorkommen.', 'calculator.error.alternating'],
    ['Division durch 0 ist nicht erlaubt.', 'calculator.error.divisionByZero'],
    ['Berechnung konnte nicht ausgewertet werden.', 'calculator.error.failed'],
  ]);
  let activeLanguage = defaultLanguage;
  let isApplying = false;

  const normalize = (value) => value.replace(/\s+/g, ' ').trim();

  async function loadDictionary(language) {
    const response = await fetch(new URL(`${language}.lang?v=1`, languageRoot));
    if (!response.ok) throw new Error(`Could not load ${language}.lang`);
    const dictionary = await response.json();
    if (!dictionary || typeof dictionary !== 'object' || Array.isArray(dictionary)) {
      throw new Error(`Invalid ${language}.lang format`);
    }
    dictionaries[language] = dictionary;
  }

  function translateText(original) {
    if (activeLanguage === defaultLanguage) return original;

    const normalized = normalize(original);
    const dictionary = dictionaries[activeLanguage];
    const exact = dictionary[`text:${normalized}`];
    if (typeof exact === 'string') {
      const leading = /^[.,!?;:]/.test(exact) ? '' : original.match(/^\s*/)?.[0] ?? '';
      const trailing = original.match(/\s*$/)?.[0] ?? '';
      return `${leading}${exact}${trailing}`;
    }

    const invalidCharacter = normalized.match(/^Ungültiges Zeichen: "(.*)"$/);
    if (invalidCharacter) {
      return dictionary['calculator.error.invalidCharacter'].replace('{char}', invalidCharacter[1]);
    }

    const calculatorErrorKey = calculatorErrorKeys.get(normalized);
    if (calculatorErrorKey && typeof dictionary[calculatorErrorKey] === 'string') {
      return dictionary[calculatorErrorKey];
    }

    if (normalized.startsWith('Ergebnis: ')) {
      return `${dictionary['calculator.resultPrefix']}${normalized.slice('Ergebnis: '.length)}`;
    }

    return original;
  }

  function translateAttributes() {
    const dictionary = dictionaries[activeLanguage];
    for (const node of document.querySelectorAll('[placeholder], [aria-label], [title], [alt]')) {
      if (node.closest('.project-language-control')) continue;
      for (const name of ['placeholder', 'aria-label', 'title', 'alt']) {
        if (!node.hasAttribute(name)) continue;
        let originals = attributes.get(node);
        if (!originals) {
          originals = new Map();
          attributes.set(node, originals);
        }
        if (!originals.has(name)) originals.set(name, node.getAttribute(name));
        const original = originals.get(name);
        if (activeLanguage === defaultLanguage) {
          node.setAttribute(name, original);
          continue;
        }
        const key = `attr:${name}:${normalize(original)}`;
        const translation = dictionary[key] ?? dictionary[`text:${normalize(original)}`];
        if (typeof translation === 'string') node.setAttribute(name, translation);
      }
    }

    const meta = document.querySelector('meta[name="description"]');
    if (meta) {
      const original = meta.dataset.originalDescription ?? meta.content;
      meta.dataset.originalDescription = original;
      const key = `pageMeta:${normalize(original)}`;
      if (activeLanguage === defaultLanguage) meta.content = original;
      else if (typeof dictionary[key] === 'string') meta.content = dictionary[key];
    }

    const originalTitle = document.documentElement.dataset.originalTitle ?? document.title;
    document.documentElement.dataset.originalTitle = originalTitle;
    const titleKey = `pageTitle:${normalize(originalTitle)}`;
    if (activeLanguage === defaultLanguage) document.title = originalTitle;
    else if (typeof dictionary[titleKey] === 'string') document.title = dictionary[titleKey];
  }

  function translateTextNodes() {
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
      acceptNode(node) {
        if (node.parentElement?.closest('script, style, select, .project-language-control')) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    for (const node of nodes) {
      if (!textNodes.has(node)) textNodes.set(node, node.nodeValue ?? '');
      const original = textNodes.get(node);
      const translated = translateText(original);
      if (node.nodeValue !== translated) node.nodeValue = translated;
    }
  }

  function applyTranslations() {
    if (!document.body || !dictionaries[activeLanguage] || isApplying) return;
    isApplying = true;
    document.documentElement.lang = activeLanguage;
    translateAttributes();
    translateTextNodes();
    const dictionary = dictionaries[activeLanguage];
    const label = languageControl.querySelector('span');
    if (label.textContent !== dictionary.languageLabel) label.textContent = dictionary.languageLabel;
    languageControl.querySelector('select').setAttribute('aria-label', dictionary.languageLabel);
    isApplying = false;
  }

  const languageControl = document.createElement('div');
  languageControl.className = 'project-language-control';
  const languageLabel = document.createElement('span');
  const languageSelect = document.createElement('select');
  languageSelect.setAttribute('aria-label', 'Sprache');
  languageSelect.innerHTML = '<option value="de">🇩🇪 Deutsch</option><option value="en">🇬🇧 English</option>';
  languageControl.append(languageLabel, languageSelect);
  const insertionPoint = document.querySelector('main, header') ?? document.body;
  insertionPoint.prepend(languageControl);

  languageSelect.addEventListener('change', () => {
    activeLanguage = languageSelect.value === 'en' ? 'en' : 'de';
    try {
      localStorage.setItem('project-language', activeLanguage);
    } catch {
      // Storage can be unavailable in private browsing contexts.
    }
    applyTranslations();
  });

  const observer = new MutationObserver(() => applyTranslations());
  observer.observe(document.body, { childList: true, characterData: true, subtree: true });

  async function initialize() {
    try {
      await Promise.all([loadDictionary('de'), loadDictionary('en')]);
      try {
        activeLanguage = localStorage.getItem('project-language') === 'en' ? 'en' : 'de';
      } catch {
        activeLanguage = defaultLanguage;
      }
      languageSelect.value = activeLanguage;
      languageSelect.disabled = false;
      applyTranslations();
    } catch (error) {
      console.error(error);
      languageLabel.textContent = 'Sprache';
      languageSelect.disabled = false;
    }
  }

  languageLabel.textContent = 'Sprache';
  languageSelect.disabled = true;
  void initialize();
})();
