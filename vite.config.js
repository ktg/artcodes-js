// vite.config.js
const path = require('path')
import dts from 'vite-plugin-dts'

module.exports = {
	build: {
		lib: {
			entry: path.resolve(__dirname, 'src/artcodes.ts'),
			name: 'artcodes',
			fileName: 'artcodes'
		},
		rollupOptions: {
			// make sure to externalize deps that shouldn't be bundled
			// into your library
			//external: ['mirada'],
			//external: ['mirada'],
		}
	},
}