// import { fetchText } from '../services/huggingface.js';
import { find, findById } from '../services/mongoService';
import imageContent from '../assets/image-list.json'
import { logger } from '../utils/logger';
import { renderHtml } from '../utils/buildTemplate';
import { BusinessError } from '../domain/errors/BusinessError';

export async function listBreads() {
  const breadList = await find('breads');

  const posts = breadList.map(bread => {
    return {
      title: bread.message.title,
      verse: bread.message.verse,
      date: bread.date,
      link: `/api/getBread?id=${bread._id}`,
    };
  });

  const params = {
    posts,
  };

  const renderPosts = renderHtml(params, 'page', 'posts.html')

  return renderHtml({ content: renderPosts }, 'page', 'layout.html');
}

export async function getBread(id) {
  const breadList = await findById('breads', id);

  if (!breadList) {
    logger.error("Bread not found with the provided ID.");
    throw new BusinessError("Bread not found with the provided ID.");
  }

  const params = {
    ...breadList.message,
    date: breadList.date,
    image: getImage(),
  };

  const renderPosts = renderHtml(params, 'page', 'post.html')

  return renderHtml({ content: renderPosts }, 'page', 'layout.html');
}

function getImage() {
  const { images } = imageContent

  if (!images || images.length === 0) {
    logger.error("Lista de imagens vazia ou inválida.");
    throw new BusinessError("Lista de imagens vazia ou inválida.");
  }

  const randomIndex = Math.floor(Math.random() * images.length);
  return images[randomIndex];
}
