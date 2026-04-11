const LANG_KEY = 'lang';
const CACHE_PREFIX = 'tr_';
const BATCH_SIZE = 30;

// Collect all elements that need translation
function getTranslatableElements(): HTMLElement[] {
  const direct = Array.from(document.querySelectorAll<HTMLElement>('[data-translate]'));
  const blockChildren = Array.from(
    document.querySelectorAll('[data-translate-block]')
  ).flatMap((block) =>
    Array.from(block.querySelectorAll<HTMLElement>('p, h1, h2, h3, h4, h5, h6, li, blockquote'))
  );
  return [...direct, ...blockChildren].filter((el) => (el.textContent?.trim() ?? '') !== '');
}

async function translateBatch(texts: string[]): Promise<string[]> {
  const res = await fetch('/api/translate', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ texts }),
  });
  if (!res.ok) throw new Error(`Translation API error: ${res.status}`);
  const data = await res.json();
  return data.translated as string[];
}

function applyTranslation(el: HTMLElement, text: string) {
  if (!el.dataset.original) {
    el.dataset.original = el.textContent ?? '';
  }
  el.style.transition = 'opacity 0.25s';
  el.style.opacity = '0.2';
  setTimeout(() => {
    el.textContent = text;
    el.style.opacity = '1';
  }, 150);
}

function showIndicator(state: 'loading' | 'done' | null) {
  let indicator = document.getElementById('lang-indicator') as HTMLElement | null;

  if (state === null) {
    indicator?.remove();
    return;
  }

  if (!indicator) {
    indicator = document.createElement('div');
    indicator.id = 'lang-indicator';
    Object.assign(indicator.style, {
      position: 'fixed',
      bottom: '1.5rem',
      right: '1.5rem',
      padding: '0.35rem 0.75rem',
      borderRadius: '9999px',
      fontSize: '0.75rem',
      fontFamily: 'monospace',
      backgroundColor: 'var(--color-theme-primary)',
      color: 'var(--color-theme-light)',
      border: '1px solid var(--color-theme-secondary)',
      zIndex: '9999',
      cursor: 'pointer',
      transition: 'opacity 0.2s',
      userSelect: 'none',
    });
    document.body.appendChild(indicator);
  }

  if (state === 'loading') {
    indicator.textContent = '🌐 翻譯中...';
    indicator.style.opacity = '0.6';
    indicator.onclick = null;
  } else {
    indicator.textContent = '🌐 ZH';
    indicator.style.opacity = '1';
    indicator.title = '點擊還原英文';
    indicator.onclick = deactivate;
  }
}

function appendLangToLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    if (href.startsWith('/') && !href.includes('lang=')) {
      const separator = href.includes('?') ? '&' : '?';
      a.setAttribute('href', href + separator + 'lang=zh');
    }
  });
}

function removeLangFromLinks() {
  document.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((a) => {
    const href = a.getAttribute('href') ?? '';
    const cleaned = href.replace(/([?&])lang=zh(&?)/, (_, before, after) => {
      if (before === '?' && after === '&') return '?';
      return after ? before : '';
    });
    a.setAttribute('href', cleaned);
  });
}

async function activate() {
  showIndicator('loading');
  appendLangToLinks();

  const elements = getTranslatableElements();
  if (elements.length === 0) {
    showIndicator('done');
    return;
  }

  // Check session cache first
  const cacheKey = CACHE_PREFIX + location.pathname;
  const cached = sessionStorage.getItem(cacheKey);
  if (cached) {
    const translationMap: Record<string, string> = JSON.parse(cached);
    elements.forEach((el) => {
      const original = el.textContent?.trim() ?? '';
      if (translationMap[original]) applyTranslation(el, translationMap[original]);
    });
    showIndicator('done');
    return;
  }

  // Deduplicate — same text only needs one API call
  const uniqueTexts = [
    ...new Set(elements.map((el) => el.textContent?.trim() ?? '').filter(Boolean)),
  ];
  const translationMap: Record<string, string> = {};

  for (let i = 0; i < uniqueTexts.length; i += BATCH_SIZE) {
    const batch = uniqueTexts.slice(i, i + BATCH_SIZE);
    try {
      const translated = await translateBatch(batch);
      batch.forEach((text, j) => {
        if (translated[j]) translationMap[text] = translated[j];
      });
      // Apply this batch progressively
      elements.forEach((el) => {
        const original = el.textContent?.trim() ?? '';
        if (translationMap[original]) applyTranslation(el, translationMap[original]);
      });
    } catch (e) {
      console.error('[Translator] Batch failed:', e);
    }
  }

  sessionStorage.setItem(cacheKey, JSON.stringify(translationMap));
  showIndicator('done');
}

function deactivate() {
  localStorage.removeItem(LANG_KEY);
  document.querySelectorAll<HTMLElement>('[data-original]').forEach((el) => {
    el.style.transition = 'opacity 0.25s';
    el.style.opacity = '0.2';
    setTimeout(() => {
      el.textContent = el.dataset.original ?? '';
      el.style.opacity = '1';
      delete el.dataset.original;
    }, 150);
  });
  removeLangFromLinks();
  showIndicator(null);
}

export function initTranslator() {
  const params = new URLSearchParams(location.search);
  const langParam = params.get('lang');

  if (langParam === 'zh') {
    localStorage.setItem(LANG_KEY, 'zh');
  } else if (langParam === 'en' || langParam === '') {
    localStorage.removeItem(LANG_KEY);
    // Clear all cached translations so they don't persist
    Object.keys(sessionStorage)
      .filter((k) => k.startsWith(CACHE_PREFIX))
      .forEach((k) => sessionStorage.removeItem(k));
  }

  if (localStorage.getItem(LANG_KEY) === 'zh') {
    activate();
  }
}
