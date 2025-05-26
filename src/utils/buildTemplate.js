import fs from 'fs';
import mustache from 'mustache';

export function renderHtml(params, type, templatePath) {
  const template = fs.readFileSync(`src/templates/${type}/${templatePath}`, 'utf-8');
  return mustache.render(template, params);
}
