const { buildSync } = require('esbuild')
const { dependencies, devDependencies } = require('./package.json')

buildSync({
	entryPoints: ['src/server.ts'],
	external: [...Object.keys(dependencies), ...Object.keys(devDependencies)],
	bundle: true,
	platform: 'node',
	outdir: '.build',
	tsconfig: 'tsconfig.json'
})
