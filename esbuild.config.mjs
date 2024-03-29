/* eslint-disable no-undef */
// https://github.com/steveruizok/perfect-freehand/blob/main/packages/dev/esbuild.config.mjs

import fs from 'fs'
import esbuild from 'esbuild'
import cssModulesPlugin from 'esbuild-css-modules-plugin';

import serve, { error, log } from 'create-serve'

const isDevServer = process.argv.includes(`--dev`);

if (!fs.existsSync('./dist')) {
  fs.mkdirSync('./dist')
}

fs.copyFile('./src/index.html', './dist/index.html', (err) => {
  if (err) throw err
})

esbuild.build({
  entryPoints: ['src/index.tsx'],
  bundle: true,
  outfile: 'dist/bundle.js',
  minify: false,
  sourcemap: true,
  target: ['chrome58', 'firefox57', 'safari11', 'edge18'],
  incremental: isDevServer,
  define: {
    'process.env.NODE_ENV': isDevServer ? '"development"' : '"production"',
  },
  watch: isDevServer && {
    onRebuild(err) {
      serve.update()
      err ? error(`❌ Failed`) : log(`✅ Updated dev`)
    }
  },
  plugins: [
    cssModulesPlugin(),
  ]
}).catch(() => process.exit(1))

if (isDevServer) {
  serve.start({
    port: 5000,
    root: './dist',
    live: true,
  })
}