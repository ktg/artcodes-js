import {MDCCircularProgress} from '@material/circular-progress'
import {MDCRipple} from '@material/ripple'

import {createScanner, ScannerState} from "./artcodes";
import {Experience} from "./experience";

export async function buildScan(root: HTMLElement, experience: Experience) {
	const canvas = document.getElementById('artc_canvasOutput') as HTMLCanvasElement

	const buttonAction = document.getElementById('artc_buttonAction') as HTMLButtonElement
	const buttonStart = document.getElementById('artc_buttonStart') as HTMLButtonElement
	const buttonStop = document.getElementById('artc_buttonStop') as HTMLButtonElement

	const image = document.getElementById('artc_image') as HTMLImageElement
	const placeholder = document.getElementById('artc_placeholder')!!
	if (experience.image != null && experience.image != '') {
		image.src = experience.image
		image.style.display = ''
	} else {
		image.style.display = 'none'
		image.height = 600
		image.style.backgroundColor = '#000'
	}
	placeholder.style.display = ''

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
				debugView: true,
				stateChanged: (state) => {
					if (state == ScannerState.idle) {
						placeholder.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.style.display = ''
						buttonStart.classList.remove('mdc-fab--exited')
						loadingIndicator.classList.add('mdc-circular-progress--closed')
					} else if (state == ScannerState.loading) {
						placeholder.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.classList.add('mdc-fab--exited')
						loadingIndicator.classList.remove('mdc-circular-progress--closed')
					} else if (state == ScannerState.scanning) {
						placeholder.style.display = 'none'
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
		placeholder.style.display = ''
		canvas.style.display = 'none'
		buttonStop.style.display = 'none'
		buttonStart.classList.add('mdc-fab--exited')
		loadingIndicator.classList.add('mdc-circular-progress--closed')
		console.log(e)
	}
}


window.addEventListener('load', () => {
	const experience: Experience = {
		name: "Wetlands Test",
		image: "https://carolanguitar.files.wordpress.com/2014/10/bottom-to-top.jpg",
		settings: {
			threshSize: 801,
			threshConst: 0,
			embeddedChecksum: true,
			tile: false
		},
		actions: [{
			name: "Test 1",
			url: "https://carolanguitar.com",
			codes: ["1:1:1:1"]
		}, {
			name: "Test 2",
			url: "https://carolanguitar.com/tech-spec/",
			codes: ["1:1:2:2"]
		}, {
			name: "Test 3",
			url: "https://carolanguitar.com/user-guide/",
			codes: ["1:2:2:3"]
		}, {
			name: "Test 4",
			url: "https://wp.me/P4QC5t-3T",
			codes: ["2:2:2:3"]
		}, {
			name: "Test 5",
			url: "https://www.artcodes.co.uk",
			codes: ["1:1:1:4"]
		}],
	}


	// const experience: Experience = {
	// 	name: " Carolan Performance",
	// 	image: "https://carolanguitar.files.wordpress.com/2014/10/bottom-to-top.jpg",
	// 	actions: [{
	// 		name: "Carolan Guitar",
	// 		url: "https://carolanguitar.com",
	// 		codes: ["1:1:1:1:2"]
	// 	}, {
	// 		name: "Tech Specs",
	// 		url: "https://carolanguitar.com/tech-spec/",
	// 		codes: ["1:1:2:2:3"]
	// 	}, {
	// 		name: "User Guide",
	// 		url: "https://carolanguitar.com/user-guide/",
	// 		codes: ["1:1:2:3:5"]
	// 	}, {
	// 		name: "Specifications",
	// 		url: "http://wp.me/P4QC5t-3T",
	// 		codes: ["1:1:2:4:4"]
	// 	}, {
	// 		name: "Learn about Artcodes",
	// 		url: "http://www.artcodes.co.uk",
	// 		codes: ["1:1:5:5:6"]
	// 	}, {
	// 		name: "Let's Play",
	// 		url: "https://www.youtube.com/watch?v=lZaZwAXwox4",
	// 		codes: ["1:1:1:4:5"]
	// 	}, {
	// 		name: "Playlist",
	// 		url: "https://www.youtube.com/playlist?list=PLPvnQgbeSXV5tJzd4hZ9AFE0qF7oCuV2G",
	// 		codes: ["1:1:3:3:4"]
	// 	}],
	// }

	buildScan(document.getElementById('content')!!, experience)
})
