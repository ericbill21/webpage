const ICONS = {
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  github: '<path d="M9 19c-4.3 1.4-4.3-2.5-6-3m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12.3 12.3 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/>',
  scholar: '<path d="M22 9 12 4 2 9l10 5 10-5Z"/><path d="M6 11v5c0 1.5 2.7 3 6 3s6-1.5 6-3v-5"/>',
  linkedin: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 11v6M8 7.5v.01M12 17v-6M12 13.5a2.5 2.5 0 0 1 5 0V17"/>',
  file: '<path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z"/><path d="M14 3v5h5"/>',
  link: '<path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1"/><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1"/>',
};

function iconFor(href) {
  if (href.startsWith('mailto:')) return 'mail';
  if (href.includes('github.com')) return 'github';
  if (href.includes('scholar.google')) return 'scholar';
  if (href.includes('linkedin.com')) return 'linkedin';
  if (href.toLowerCase().endsWith('.pdf')) return 'file';
  return 'link';
}

function buildChip(source) {
  const chip = document.createElement('a');
  chip.className = 'chip';
  chip.href = source.href;
  chip.innerHTML = `<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[iconFor(source.href)]}</svg>`;
  chip.append(source.textContent.trim());
  if (!source.href.startsWith('mailto:')) chip.rel = 'me noopener';
  return chip;
}

export default function decorate(block) {
  const cells = [...block.querySelectorAll(':scope > div > div')];
  const picture = block.querySelector('picture');
  const textCell = cells.find((cell) => !cell.querySelector('picture')) || document.createElement('div');

  const isSeparatorsOnly = (text) => !text.replace(/[\s|·•,/]/g, '');
  const links = [];
  textCell.querySelectorAll('p, li').forEach((line) => {
    const lineLinks = [...line.querySelectorAll('a')];
    const nonLinkText = lineLinks.reduce((text, a) => text.replace(a.textContent, ''), line.textContent);
    if (lineLinks.length && isSeparatorsOnly(nonLinkText)) {
      links.push(...lineLinks);
      line.remove();
    }
  });

  let name = textCell.querySelector('h1, h2, h3');
  if (!name) {
    const first = textCell.querySelector('p');
    name = document.createElement('h1');
    if (first) {
      name.append(...first.childNodes);
      first.remove();
    }
  }
  const heading = document.createElement('h1');
  heading.className = 'profile-name';
  heading.append(...name.childNodes);
  name.remove();

  const roles = [...textCell.querySelectorAll('p')].filter((p) => p.textContent.trim());
  roles.forEach((p) => { p.className = 'profile-role'; });

  const body = document.createElement('div');
  body.className = 'profile-body';
  body.append(heading, ...roles);

  if (links.length) {
    const linkRow = document.createElement('div');
    linkRow.className = 'profile-links';
    linkRow.append(...links.map(buildChip));
    body.append(linkRow);
  }

  block.replaceChildren();
  if (picture) {
    const photo = document.createElement('div');
    photo.className = 'profile-photo';
    const img = picture.querySelector('img');
    if (img) img.loading = 'eager';
    photo.append(picture);
    block.append(photo);
  }
  block.append(body);
}
