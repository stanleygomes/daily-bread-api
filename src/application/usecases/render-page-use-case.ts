import { TemplateRenderer } from '../../shared/utils/template-renderer.util.js';

export class RenderPageUseUseCase {
  constructor() {}

  execute(params: any, file: string): string  {
    const renderPage = TemplateRenderer.renderHtml(params, file)
    return TemplateRenderer.renderHtml({ content: renderPage }, 'page/layout.html');
  }
}
