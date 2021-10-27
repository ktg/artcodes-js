import {MDCCircularProgress} from '@material/circular-progress'
import {MDCRipple} from '@material/ripple'

import {createScanner, ScannerState} from "./artcodes";
import {Experience} from "./experience";

export async function buildScan(root: HTMLElement, experience: Experience) {
	const canvas = document.getElementById('artc_canvasOutput') as HTMLCanvasElement

	const buttonAction = document.getElementById('artc_buttonAction') as HTMLAnchorElement
	const buttonStart = document.getElementById('artc_buttonStart') as HTMLButtonElement
	const buttonStop = document.getElementById('artc_buttonStop') as HTMLButtonElement

	const image = document.getElementById('artc_image') as HTMLImageElement
	if (experience.image != null && experience.image != '') {
		image.src = experience.image
		image.style.display = ''
	} else {
		image.style.display = 'none'
		image.height = 600
		image.style.backgroundColor = '#000'
	}

	new MDCRipple(buttonAction)
	new MDCRipple(buttonStart)
	new MDCRipple(buttonStop)

	const deviceSelect = document.getElementById('artc_deviceSelect') as HTMLSelectElement
	const loadingIndicator = document.getElementById('artc_loadingIndicator')!!
	const circularProgress = new MDCCircularProgress(loadingIndicator)
	circularProgress.determinate = false

	try {
		const scanner = await createScanner(
			experience,
			{
				canvas: canvas,
				deviceSelect: deviceSelect,
				//debugView: true,
				stateChanged: (state) => {
					if (state == ScannerState.idle) {
						image.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.style.display = ''
						buttonStart.classList.remove('mdc-fab--exited')
						loadingIndicator.classList.add('mdc-circular-progress--closed')
					} else if (state == ScannerState.loading) {
						image.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.classList.add('mdc-fab--exited')
						loadingIndicator.classList.remove('mdc-circular-progress--closed')
					} else if (state == ScannerState.scanning) {
						image.style.display = 'none'
						canvas.style.display = ''
						buttonStop.style.display = ''
						buttonStart.classList.add('mdc-fab--exited')
						loadingIndicator.classList.add('mdc-circular-progress--closed')
					}
				},
				markerChanged: (marker) => {
					if (marker != null) {
						buttonAction.style.display = 'block'
						buttonAction.innerText = marker.action.name || ''
						buttonAction.classList.remove('mdc-fab--exited')
						buttonAction.addEventListener('click', () => {
							let url = marker.action.url
							if (url) {
								location.href = url
							}
						})
					} else {
						buttonAction.classList.add('mdc-fab--exited')
					}
				}
			}
		)

		buttonStart.addEventListener('click', () => {
			scanner.start()
		})

		buttonStop.addEventListener('click', () => {
			scanner.stop()
		})
	} catch (e) {
		image.style.display = ''
		canvas.style.display = 'none'
		buttonStop.style.display = 'none'
		buttonStart.classList.add('mdc-fab--exited')
		loadingIndicator.classList.add('mdc-circular-progress--closed')
		console.log(e)
	}
}


window.addEventListener('load', () => {
	// const experience: Experience = {
	// 	name: "Wetlands Test",
	// 	image: "https://carolanguitar.files.wordpress.com/2014/10/bottom-to-top.jpg",
	// 	settings: {
	// 		threshSize: 801,
	// 		threshConst: 0,
	// 		actionDelay: 5,
	// 		embeddedChecksum: true,
	// 		tile: true
	// 	},
	// 	actions: [{
	// 		name: "1111",
	// 		url: "https://carolanguitar.com",
	// 		codes: ["1:1:1:1"]
	// 	}, {
	// 		name: "1122",
	// 		url: "https://carolanguitar.com/tech-spec/",
	// 		codes: ["1:1:2:2"]
	// 	}, {
	// 		name: "1223",
	// 		url: "https://carolanguitar.com/user-guide/",
	// 		codes: ["1:2:2:3"]
	// 	}, {
	// 		name: "2223",
	// 		url: "https://wp.me/P4QC5t-3T",
	// 		codes: ["2:2:2:3"]
	// 	}, {
	// 		name: "1114",
	// 		url: "https://www.artcodes.co.uk",
	// 		codes: ["1:1:1:4"]
	// 	}],
	// }


	const experience: Experience = {
		name: " Carolan Performance",
		image: "https://carolanguitar.files.wordpress.com/2014/10/bottom-to-top.jpg",
		actions: [{
			name: "Carolan Guitar",
			url: "https://carolanguitar.com",
			codes: ["1:1:1:1:2"]
		}, {
			name: "Tech Specs",
			url: "https://carolanguitar.com/tech-spec/",
			codes: ["1:1:2:2:3"]
		}, {
			name: "User Guide",
			url: "https://carolanguitar.com/user-guide/",
			codes: ["1:1:2:3:5"]
		}, {
			name: "Specifications",
			url: "http://wp.me/P4QC5t-3T",
			codes: ["1:1:2:4:4"]
		}, {
			name: "Learn about Artcodes",
			url: "http://www.artcodes.co.uk",
			codes: ["1:1:5:5:6"]
		}, {
			name: "Ceilidh",
			url: "http://localhost/Dustysix.mp4",
			codes: ["1:1:1:4:5"]
		}, {
			name: "Making",
			url: "http://localhost/Making.mp4",
			codes: ["1:1:3:3:4"]
		}],
	}

	buildScan(document.getElementById('content')!!, experience)
})
