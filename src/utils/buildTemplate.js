import fs from 'fs';
import path from 'path';
import mustache from 'mustache';

export function renderHtml(params, type, templatePath) {
  const templateFullPath = path.join(process.cwd(), 'src', 'templates', type, templatePath);
  const template = fs.readFileSync(templateFullPath, 'utf-8');
  return mustache.render(template, params);
}
