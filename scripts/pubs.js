const AUTHOR_NAME = 'Eric Tillmann Bill';

const LINK_LABELS = [
  ['doi', 'Proceedings'],
  ['preprint', 'Preprint'],
  ['pdf', 'OpenReview'],
  ['ads', 'NASA/ADS'],
  ['code', 'Code'],
  ['dataset', 'Dataset'],
  ['webpage', 'Webpage'],
  ['presentation', 'Oral presentation'],
];

let cachedPubs;
async function fetchPublications() {
  if (cachedPubs) return cachedPubs;
  const resp = await fetch('/publications.json');
  cachedPubs = resp.ok ? resp.json() : [];
  return cachedPubs;
}

function boldAuthor(authors) {
  if (!authors) return '';
  return authors.split(AUTHOR_NAME).join(`<strong>${AUTHOR_NAME}</strong>`);
}

let modalEl;
function ensureModal() {
  if (modalEl) return modalEl;
  modalEl = document.createElement('div');
  modalEl.className = 'bibtex-modal';
  modalEl.innerHTML = `
    <div class="bibtex-dialog" role="dialog" aria-modal="true">
      <div class="bibtex-header">
        <h3>BibTeX</h3>
        <button type="button" class="bibtex-close" aria-label="Close">&times;</button>
      </div>
      <pre><code></code></pre>
      <button type="button" class="bibtex-copy">Copy to clipboard</button>
    </div>`;
  document.body.append(modalEl);
  modalEl.addEventListener('click', (e) => {
    if (e.target === modalEl || e.target.closest('.bibtex-close')) modalEl.classList.remove('is-open');
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') modalEl.classList.remove('is-open');
  });
  return modalEl;
}

function openBibtexModal(bibtex) {
  const modal = ensureModal();
  modal.querySelector('code').textContent = bibtex;
  const copyBtn = modal.querySelector('.bibtex-copy');
  copyBtn.textContent = 'Copy to clipboard';
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(bibtex).then(() => {
      copyBtn.textContent = 'Copied!';
      setTimeout(() => { copyBtn.textContent = 'Copy to clipboard'; }, 1500);
    });
  };
  modal.classList.add('is-open');
}

function buildBadges(pub) {
  const links = pub.links || {};
  const wrap = document.createElement('div');
  wrap.className = 'pub-links';
  LINK_LABELS.forEach(([key, label]) => {
    if (!links[key]) return;
    const a = document.createElement('a');
    a.className = 'badge';
    a.href = links[key];
    a.textContent = label;
    wrap.append(a);
  });
  if (links.bibtex) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'badge bibtex-trigger';
    btn.textContent = 'BibTeX';
    btn.addEventListener('click', () => openBibtexModal(links.bibtex));
    wrap.append(btn);
  }
  return wrap;
}

function buildPubArticle(pub) {
  const article = document.createElement('article');
  article.className = 'pub';

  const header = document.createElement('div');
  header.className = 'pub-header';

  const title = document.createElement('div');
  title.className = 'pub-title';
  title.innerHTML = `<strong>${pub.title}</strong>`;
  header.append(title);

  const authors = document.createElement('div');
  authors.className = 'pub-authors';
  authors.innerHTML = boldAuthor(pub.authors);
  header.append(authors);

  const venue = document.createElement('div');
  venue.className = 'pub-venue';
  venue.textContent = pub.details ? `${pub.venue}, ${pub.details}` : pub.venue;
  header.append(venue);

  article.append(header, buildBadges(pub));
  return article;
}

export default async function decoratePublications(block, { selectedOnly = false } = {}) {
  let pubs = await fetchPublications();
  if (selectedOnly) pubs = pubs.filter((p) => p.selected);

  const wrap = document.createElement('div');
  wrap.className = 'pubs';

  if (selectedOnly) {
    const list = document.createElement('div');
    list.className = 'pubs-list';
    [...pubs].sort((a, b) => b.year - a.year).forEach((p) => list.append(buildPubArticle(p)));
    wrap.append(list);
  } else {
    const years = [...new Set(pubs.map((p) => p.year))].sort((a, b) => b - a);
    years.forEach((year) => {
      const section = document.createElement('section');
      section.className = 'pubs-year-group';
      const h2 = document.createElement('h2');
      h2.className = 'pubs-year';
      h2.textContent = year;
      const list = document.createElement('div');
      list.className = 'pubs-list';
      pubs.filter((p) => p.year === year).forEach((p) => list.append(buildPubArticle(p)));
      section.append(h2, list);
      wrap.append(section);
    });
  }

  block.textContent = '';
  block.append(wrap);
}
