import fs from 'fs';
import path from 'path';
import mustache from 'mustache';

export class TemplateRenderer {
  static renderHtml(params: Record<string, any>, file: string): string {
    const templateFullPath = path.join(process.cwd(), 'src', 'shared', 'templates', file);
    const template = fs.readFileSync(templateFullPath, 'utf-8');
    return mustache.render(template, params);
  }
}
