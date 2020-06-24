import * as Mirada from 'mirada'
import {Marker} from "./marker"
import {VideoReader} from "./camera"
import {MarkerDetector} from "./markerDetector"
import scannerHtml from './scanner.html'

declare var cv: Mirada.CV

// TODO Add options?
export async function scan(root: HTMLElement, experience: Experience) {
	console.log(scannerHtml)
	root.innerHTML = scannerHtml

	const video = document.getElementById('artc_videoInput') as HTMLVideoElement
	const canvas = document.getElementById('artc_canvasOutput') as HTMLCanvasElement

	const buttonStop = document.getElementById('artc_buttonStop') as HTMLButtonElement
	const buttonStart = document.getElementById('artc_buttonStart') as HTMLButtonElement
	const buttonAction = document.getElementById('artc_buttonAction') as HTMLButtonElement

	const deviceSelect = document.getElementById('artc_deviceSelect') as HTMLSelectElement
	const loadingIndicator = document.getElementById('artc_loadingIndicator')

	await Mirada.loadOpencv()
	const detector = new MarkerDetector(experience)

	const camera = new VideoReader(video, canvas, {
		video: {facingMode: 'environment'},
		audio: false
	});

	const selectListener = () => {
		camera.stop()
		camera.constraints = {
			video: {deviceId: deviceSelect.value}
		}
		startCamera()
	}

	const stopCamera = () => {
		history.replaceState(null, null, ' ' + '');
		camera.stop()
		buttonStop.style.display = 'none'
		deviceSelect.style.display = 'none'
	}

	const FPS = 10
	const color = new cv.Scalar(0, 255, 0)
	let currentMarker: Marker = null
	const startCamera = async () => {
		try {
			loadingIndicator.style.display = 'block'
			buttonStart.style.display = 'none'
			await camera.start()
			const size = camera.size
			//const blurSize = new cv.Size(3, 3)
			const dst = new cv.Mat(size.width, size.height, cv.CV_8UC1)
			let lastActionTime: number = 0
			const actionTimeout = 5000
			buttonStop.style.display = 'block'
			loadingIndicator.style.display = 'none'
			buttonStart.style.display = 'none'
			history.replaceState(null, null, '#play');

			navigator.mediaDevices.enumerateDevices()
				.then(function (devices) {
					deviceSelect.removeEventListener('input', selectListener)
					while (deviceSelect.options.length > 0) {
						deviceSelect.remove(0);
					}
					const cameras = devices.filter((device) => device.kind == 'videoinput')
					if (cameras.length > 1) {
						cameras.forEach((camera) => {
							const opt = document.createElement('option');
							opt.value = camera.deviceId;
							opt.innerHTML = camera.label;
							deviceSelect.appendChild(opt);
						})
						deviceSelect.value = camera.deviceId
						deviceSelect.addEventListener('input', selectListener)
						deviceSelect.style.display = 'block'
					}
				})
				.catch(function (err) {
					console.log(err.name + ": " + err.message);
				});
			const processVideo = () => {
				if (camera.isStreaming) {
					const begin = Date.now()
					const src = camera.read()
					cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)
					cv.flip(dst, dst, 1)
					cv.adaptiveThreshold(dst, dst, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, 101, 1)

					const contours = new cv.MatVector()
					const hierarchy = new cv.Mat()
					cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

					const marker = detector.findMarker(hierarchy)
					if (marker != null) {
						if (!marker.equals(currentMarker)) {
							buttonAction.innerText = marker.action.name
							currentMarker = marker
							buttonAction.style.display = 'block'
						}
						cv.drawContours(dst, contours, marker.nodeIndex, color, 2, cv.LINE_8, hierarchy, 100)
					} else if (currentMarker != null) {
						if (lastActionTime == 0) {
							lastActionTime = Date.now() + actionTimeout
						} else if (Date.now() > lastActionTime) {
							lastActionTime = 0
							currentMarker = marker
							buttonAction.style.display = 'none'
						}
					}
					cv.imshow(canvas, dst)
					const delay = 1000 / FPS - (Date.now() - begin)
					setTimeout(processVideo, delay)
				} else {
					dst.delete()
					buttonStart.style.display = 'block'
				}
			}

			processVideo()

		} catch (error) {
			console.log('navigator.MediaDevices.getUserMedia error: ', error.message, error.name);
			console.trace(error)
		}
	}

	buttonAction.addEventListener('click', () => {
		location.href = currentMarker.action.url
	})
	buttonStart.addEventListener("click", () => {
		startCamera()
	});
	loadingIndicator.style.display = 'none'
	buttonStart.style.display = 'block'
	buttonStop.addEventListener("click", () => {
		stopCamera()
	});

	if (location.hash == '#play') {
		await startCamera()
	}
}