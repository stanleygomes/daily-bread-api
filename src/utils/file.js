import fs from 'fs';

export function loadFileContent(filePath) {
  return fs.readFileSync(filePath, 'utf-8');
}
