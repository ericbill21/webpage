import decoratePublications from '../../scripts/pubs.js';

export default function decorate(block) {
  decoratePublications(block, { selectedOnly: true });
}
