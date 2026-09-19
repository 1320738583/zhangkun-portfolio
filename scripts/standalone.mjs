import { readFile, writeFile } from 'node:fs/promises';
import { resolve } from 'node:path';

// Keep a double-click preview alongside the normal Vite build.
let html = await readFile('dist/index.html', 'utf8');
const jsTag = html.match(/<script\b[^>]*src="([^"]+)"[^>]*><\/script>/);
const cssTag = html.match(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/);
if (!jsTag || !cssTag) throw new Error('Expected Vite script and stylesheet');
const js = await readFile(resolve('dist', jsTag[1]), 'utf8');
const css = await readFile(resolve('dist', cssTag[1]), 'utf8');
html = html.replace(jsTag[0], '').replace(cssTag[0], () => `<style>${css}</style>`);
html = html.replace('</body>', () => `<script>${js.replaceAll('</script', '<\\/script')}</script></body>`);
await writeFile('dist/作品集预览.html', html);
console.log('Double-click preview: dist/作品集预览.html');
