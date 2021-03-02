import resolve from '@rollup/plugin-node-resolve';
import replace from '@rollup/plugin-replace';
import commonjs from '@rollup/plugin-commonjs';
import {terser} from 'rollup-plugin-terser';
import ts from "@wessberg/rollup-plugin-ts";
import copy from 'rollup-plugin-copy'


const mode = process.env.NODE_ENV;
const dev = mode === 'development';
const sourcemap = dev ? "inline" : false;


export default [
	{
		input: "src/artcodes.ts",
		output: {
			file: 'dist/artcodes.js',
			format: 'cjs',
		},
		plugins: [
			replace({
				'process.browser': true,
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			resolve({
				browser: true
			}),
			commonjs({
				sourceMap: !!sourcemap,
			}),
			ts(),
			!dev && terser({
				module: true
			})
		],

		preserveEntrySignatures: false,
	},
	{
		input: "src/test.ts",
		output: {
			file: 'build/main.js',
			format: 'es',
		},
		plugins: [
			replace({
				'process.browser': true,
				preventAssignment: true,
				'process.env.NODE_ENV': JSON.stringify(mode)
			}),
			resolve({
				browser: true
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
