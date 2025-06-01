import { renderHtml } from '../utils/buildTemplate';

export async function getForm() {
  const renderPosts = renderHtml({}, 'page', 'subscribe.html')
  return renderHtml({ content: renderPosts }, 'page', 'layout.html');
}
