import { getMetadata } from '../../scripts/aem.js';
import { loadFragment } from '../fragment/fragment.js';

function normalizePath(pathname) {
  const path = pathname.replace(/\/index(\.html)?$/, '/');
  return path.length > 1 ? path.replace(/\/$/, '') : path;
}

export default async function decorate(block) {
  const navMeta = getMetadata('nav');
  const navPath = navMeta ? new URL(navMeta, window.location).pathname : '/nav';
  const fragment = await loadFragment(navPath);

  const nav = document.createElement('nav');
  nav.className = 'nav';
  nav.setAttribute('aria-label', 'Main');

  const brandSource = fragment?.querySelector('.section a:not(li a)');
  if (brandSource) {
    const brand = document.createElement('a');
    brand.className = 'nav-brand';
    brand.href = brandSource.href;
    brand.textContent = brandSource.textContent.trim();
    nav.append(brand);
  }

  const list = document.createElement('ul');
  list.className = 'nav-links';
  const current = normalizePath(window.location.pathname);
  fragment?.querySelectorAll('li > a').forEach((source) => {
    const item = document.createElement('li');
    const link = document.createElement('a');
    link.href = source.href;
    link.textContent = source.textContent.trim();
    if (normalizePath(new URL(source.href).pathname) === current) {
      link.setAttribute('aria-current', 'page');
    }
    item.append(link);
    list.append(item);
  });
  nav.append(list);

  const wrapper = document.createElement('div');
  wrapper.className = 'nav-wrapper';
  wrapper.append(nav);
  block.replaceChildren(wrapper);
}
