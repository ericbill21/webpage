export default function decorate(block) {
  const list = document.createElement('ul');
  list.className = 'news-list';

  [...block.children].forEach((row) => {
    const [dateCell, textCell] = row.children;
    if (!textCell?.textContent.trim()) return;

    const item = document.createElement('li');
    item.className = 'news-item';

    const date = document.createElement('span');
    date.className = 'news-date';
    date.textContent = dateCell?.textContent.trim() || '';

    const text = document.createElement('div');
    text.className = 'news-text';
    const paragraphs = textCell.querySelectorAll(':scope > p');
    if (paragraphs.length === 1) text.append(...paragraphs[0].childNodes);
    else text.append(...textCell.childNodes);

    item.append(date, text);
    list.append(item);
  });

  block.replaceChildren(list);
}
