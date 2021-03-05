import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import {terser} from 'rollup-plugin-terser';
import ts from "@wessberg/rollup-plugin-ts";
import copy from 'rollup-plugin-copy'
import commonjs from "@rollup/plugin-commonjs";
import autoExternal from 'rollup-plugin-auto-external';

const mode = process.env.BUILD;
console.log(mode);
const dev = mode === 'development';
const sourcemap = dev ? "inline" : false;

export default [
	{
		input: "src/index.ts",
		output: {
			file: 'dist/artcodes.js',
			format: 'cjs',
			exports: "named",
			sourcemap: sourcemap
		},
		external: ['mirada'],
		plugins: [
			autoExternal(),
			// replace({
			// 	'process.browser': true,
			// 	preventAssignment: true,
			// 	'process.env.NODE_ENV': JSON.stringify(mode)
			// }),
			// resolve({
			// 	browser: true,
			// }),
			// commonjs({
			// 	sourceMap: !!sourcemap,
			// }),
			ts({
				tsconfig: {
					target: "es2017",
					declaration: true,
				}
			}),
			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: true,
	},
	{
		input: "src/test.ts",
		output: {
			file: 'build/main.js',
			format: 'iife',
		},
		plugins: [
			replace({
				'process.browser': true,
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			resolve({
				browser: true,
			}),
			commonjs({
				sourceMap: !!sourcemap,
			}),
			ts(),
			copy({
				targets: [
					{src: 'static/*', dest: 'build/'},
				]
			}),
			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
	},
];
