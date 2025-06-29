// src/scripts/templates/template-creator.js
import { showFormattedDate } from '../utils'; // Pastikan path ini benar

const createStoryItemTemplate = (story) => `
  <article class="story-item" tabindex="0">
    <img
      class="story-item__thumbnail lazyload"
      src="${story.photoUrl}"  data-src="${story.photoUrl}"
      alt="Foto cerita oleh ${story.name}"
      tabindex="0"
    >
    <div class="story-item__content">
      <h3 class="story-item__title" tabindex="0">${story.name}</h3>
      <p class="story-item__date" tabindex="0">Diposting pada: ${showFormattedDate(story.createdAt, 'id-ID')}</p>
      <p class="story-item__description" tabindex="0">${story.description.substring(0, 150)}${story.description.length > 150 ? '...' : ''}</p>
      <a href="#/stories/${story.id}" class="story-item__detail-link" aria-label="Lihat detail cerita dari ${story.name}">Lihat Detail</a>
    </div>
  </article>
`;

export {
  createStoryItemTemplate,
};