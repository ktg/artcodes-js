import {loadOpencv} from "mirada";
import {Scanner, ScannerOptions} from "./artcodes";
import {Experience} from "./experience";

export async function createScanner(experience: Experience, options: ScannerOptions): Promise<Scanner> {
	if (location.protocol != 'https:' && location.hostname != 'localhost') {
		throw new Error("Artcodes requires https in order to access camera")
	}
	let opencvPath = '/opencv.js'
	const scripts = document.querySelectorAll<HTMLScriptElement>('script');
	scripts.forEach(el => {
		const index = el.src.indexOf('/main.')
		if (index > 0) {
			opencvPath = el.src.slice(0, index) + '/opencv.js'
		}
	});

	await loadOpencv({
		opencvJsLocation: opencvPath
	})

	const scanner = new Scanner(experience, options)

	if (location.hash == '#play') {
		await scanner.start()
	} else {
		scanner.stop()
	}
	return scanner
}
