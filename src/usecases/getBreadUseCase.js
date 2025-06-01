import { find, findById } from '../services/mongoService';
import { logger } from '../utils/logger';
import { renderHtml } from '../utils/buildTemplate';
import { BusinessError } from '../domain/errors/BusinessError';

export async function listBreads() {
  const breadList = await find('breads', {}, { created_at: -1 });

  const posts = breadList.map(bread => {
    return {
      title: bread.title,
      verse: bread.verse,
      date: bread.date,
      link: `/api/getBread?id=${bread._id}`,
    };
  });

  const params = {
    posts,
  };

  const renderPage = renderHtml(params, 'page', 'posts.html')

  return renderHtml({ content: renderPage }, 'page', 'layout.html');
}

export async function getBread(id) {
  const bread = await findById('breads', id);

  if (!bread) {
    logger.error("Bread not found with the provided ID.");
    throw new BusinessError("Bread not found with the provided ID.");
  }

  const renderPage = renderHtml(bread, 'page', 'post.html')

  return renderHtml({ content: renderPage }, 'page', 'layout.html');
}
