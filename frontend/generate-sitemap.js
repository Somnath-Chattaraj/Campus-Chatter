import { SitemapStream, streamToPromise } from 'sitemap';
import { createWriteStream } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

// Create __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Resolve the path to sitemap.xml
const sitemapPath = path.resolve(__dirname, 'public', 'sitemap.xml');

const sitemap = new SitemapStream({ hostname: 'https://capusify.site' });

const links = [
  { url: '/', changefreq: 'daily', priority: 1.0 },
  { url: '/about', changefreq: 'weekly', priority: 0.8 },
  { url: '/contact', changefreq: 'monthly', priority: 0.5 }
];

links.forEach(link => sitemap.write(link));
sitemap.end();

// Create the sitemap and handle errors
streamToPromise(sitemap.pipe(createWriteStream(sitemapPath)))
  .then(() => console.log('Sitemap created successfully!'))
  .catch(err => console.error('Error generating sitemap:', err));
