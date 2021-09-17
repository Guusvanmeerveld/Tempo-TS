import run from '@rollup/plugin-run';

import typescript from '@rollup/plugin-typescript';
import tsConfigPaths from 'rollup-plugin-ts-paths';

import json from '@rollup/plugin-json';

const dev = process.env.ROLLUP_WATCH === 'true';

export default {
	input: 'src/index.ts',
	output: {
		dir: 'dist',
		format: 'cjs',
	},
	plugins: [
		json(),
		dev && run(),
		typescript({
			cacheDir: '.rollup.tscache',
		}),
		tsConfigPaths(),
	],
};
