import { createQwikCity } from '@builder.io/qwik-city/middleware/node';
import qwikCityPlan from '@qwik-city-plan';
import render from './entry.ssr';
import express from 'express';
import { fileURLToPath } from 'node:url';
import { join } from 'node:path';
import compression from 'compression';

const distDir = join(fileURLToPath(import.meta.url), '..', '..', '.build');
const buildDir = join(distDir, 'build');

const PORT = process.env.PORT ?? 3000;

const { router, notFound } = createQwikCity({ render, qwikCityPlan });
const app = express();

app.use(compression());
app.use(`/build`, express.static(buildDir, { immutable: true, maxAge: '1y' }));
app.use(express.static(distDir, { redirect: false }));
app.use(router);
app.use(notFound);

app.listen(PORT, () => {
  /* eslint-disable */
  console.log(`Server starter: http://localhost:${PORT}/`);
});
