import {MDCRipple} from '@material/ripple'
import {MDCCircularProgress} from '@material/circular-progress'

import scannerHtml from "./scanner.html";
import {createScanner, State} from "./artcodes";
import {Experience} from "./experience";

export async function buildScan(root: HTMLElement, experience: Experience) {
	root.innerHTML = scannerHtml

	const video = document.getElementById('artc_videoInput') as HTMLVideoElement
	const canvas = document.getElementById('artc_canvasOutput') as HTMLCanvasElement

	const buttonAction = document.getElementById('artc_buttonAction') as HTMLButtonElement
	const buttonStart = document.getElementById('artc_buttonStart') as HTMLButtonElement
	const buttonStop = document.getElementById('artc_buttonStop') as HTMLButtonElement

	const image = document.getElementById('artc_image') as HTMLImageElement
	const placeholder = document.getElementById('artc_placeholder')
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
	const loadingIndicator = document.getElementById('artc_loadingIndicator')
	const circularProgress = new MDCCircularProgress(loadingIndicator)
	circularProgress.determinate = false

	try {
		const scanner = await createScanner(
			experience,
			{
				canvas: canvas,
				video: video,
				deviceSelect: deviceSelect,
				stateChanged: (state) => {
					if (state == State.idle) {
						placeholder.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.style.display = ''
						buttonStart.classList.remove('mdc-fab--exited')
						loadingIndicator.classList.add('mdc-circular-progress--closed')
					} else if (state == State.loading) {
						placeholder.style.display = ''
						canvas.style.display = 'none'
						buttonStop.style.display = 'none'
						buttonStart.classList.add('mdc-fab--exited')
						loadingIndicator.classList.remove('mdc-circular-progress--closed')
					} else if (state == State.scanning) {
						placeholder.style.display = 'none'
						canvas.style.display = ''
						buttonStop.style.display = ''
						buttonStart.classList.add('mdc-fab--exited')
						loadingIndicator.classList.add('mdc-circular-progress--closed')
					}
				},
				markerChanged: (marker) => {
					if (marker != null) {
						buttonAction.innerText = marker.action.name
						buttonAction.classList.remove('mdc-fab--exited')
						buttonAction.addEventListener('click', () => {
							location.href = marker.action.url
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
