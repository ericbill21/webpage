const AUTHOR_NAME = 'Eric Tillmann Bill';

const LINK_LABELS = [
  ['doi', 'Paper'],
  ['preprint', 'arXiv'],
  ['pdf', 'OpenReview'],
  ['webpage', 'Project'],
  ['code', 'Code'],
  ['dataset', 'Dataset'],
  ['presentation', 'Talk'],
  ['ads', 'NASA/ADS'],
];

const TITLE_LINK_PRIORITY = ['webpage', 'doi', 'preprint', 'pdf'];

let pubsPromise;
function fetchPublications() {
  pubsPromise = pubsPromise || fetch('/publications.json')
    .then((resp) => (resp.ok ? resp.json() : []))
    .catch(() => []);
  return pubsPromise;
}

function shortName(title) {
  const prefix = title.split(':')[0].trim();
  return prefix !== title && prefix.length <= 12 ? prefix : '';
}

function el(tag, className, text) {
  const node = document.createElement(tag);
  if (className) node.className = className;
  if (text) node.textContent = text;
  return node;
}

function authorsNode(authors = '') {
  const p = el('p', 'pub-authors');
  authors.split(AUTHOR_NAME).forEach((part, i) => {
    if (i > 0) p.append(el('strong', '', AUTHOR_NAME));
    p.append(part);
  });
  return p;
}

let dialog;
function openBibtex(bibtex) {
  if (!dialog) {
    dialog = el('dialog', 'bibtex-dialog');
    const header = el('div', 'bibtex-header');
    const close = el('button', 'bibtex-close', '×');
    close.type = 'button';
    close.setAttribute('aria-label', 'Close');
    close.addEventListener('click', () => dialog.close());
    header.append(el('span', 'bibtex-title', 'BibTeX'), close);
    const copy = el('button', 'chip bibtex-copy', 'Copy');
    copy.type = 'button';
    copy.addEventListener('click', async () => {
      await navigator.clipboard.writeText(dialog.querySelector('code').textContent);
      copy.textContent = 'Copied';
      setTimeout(() => { copy.textContent = 'Copy'; }, 1500);
    });
    const pre = el('pre');
    pre.append(el('code'));
    dialog.append(header, pre, copy);
    dialog.addEventListener('click', (e) => { if (e.target === dialog) dialog.close(); });
    document.body.append(dialog);
  }
  dialog.querySelector('code').textContent = bibtex;
  dialog.showModal();
}

function teaserNode(pub) {
  const teaser = el('div', 'pub-teaser');
  if (pub.teaser) {
    const img = el('img');
    img.src = pub.teaser;
    img.alt = `Teaser figure for ${shortName(pub.title) || pub.title}`;
    img.loading = 'lazy';
    img.width = 320;
    img.height = 200;
    teaser.append(img);
  } else {
    teaser.classList.add('pub-teaser-fallback');
    const name = shortName(pub.title);
    if (name) teaser.append(el('span', 'pub-teaser-name', name));
    teaser.append(el('span', 'pub-teaser-year', String(pub.year)));
  }
  return teaser;
}

function buildPub(pub) {
  const links = pub.links || {};
  const article = el('article', 'pub');
  const body = el('div', 'pub-body');

  const title = el('h3', 'pub-title');
  const titleHref = TITLE_LINK_PRIORITY.map((key) => links[key]).find(Boolean);
  if (titleHref) {
    const a = el('a', '', pub.title);
    a.href = titleHref;
    title.append(a);
  } else {
    title.textContent = pub.title;
  }

  const venue = el('p', 'pub-venue', pub.venue);
  if (pub.details) venue.append(' ', el('span', 'pub-tag', pub.details));

  const chips = el('div', 'pub-links');
  LINK_LABELS.forEach(([key, defaultLabel]) => {
    if (!links[key]) return;
    const label = key === 'pdf' && !links.pdf.includes('openreview.net') ? 'PDF' : defaultLabel;
    const a = el('a', 'chip', label);
    a.href = links[key];
    chips.append(a);
  });
  if (links.bibtex) {
    const button = el('button', 'chip', 'BibTeX');
    button.type = 'button';
    button.addEventListener('click', () => openBibtex(links.bibtex));
    chips.append(button);
  }

  body.append(title, authorsNode(pub.authors), venue, chips);
  article.append(teaserNode(pub), body);
  return article;
}

function listOf(pubs) {
  const list = el('div', 'pubs-list');
  pubs.forEach((pub) => list.append(buildPub(pub)));
  return list;
}

export default async function decoratePublications(block, { selectedOnly = false } = {}) {
  const all = await fetchPublications();
  const wrap = el('div', 'pubs');

  if (selectedOnly) {
    wrap.append(listOf(all.filter((p) => p.selected).sort((a, b) => b.year - a.year)));
  } else {
    const years = [...new Set(all.map((p) => p.year))].sort((a, b) => b - a);
    years.forEach((year) => {
      const group = el('section', 'pubs-year-group');
      group.append(el('h2', 'pubs-year', String(year)), listOf(all.filter((p) => p.year === year)));
      wrap.append(group);
    });
  }

  block.replaceChildren(wrap);
}
