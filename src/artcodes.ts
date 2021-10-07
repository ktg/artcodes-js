import * as Mirada from "mirada";
import {loadOpencv, Mat, Scalar} from "mirada";
import {VideoReader} from "./camera"
import type {Action, Experience, Settings} from "./experience";
import type {Marker} from "./marker"
import {MarkerDetector} from './markerDetector'
import {MovingThresholder, Thresholder, TileTresholder} from "./thresh";

export type {Experience, Action, Settings, Marker}

declare var cv: Mirada.CV

export enum ScannerState {
	loading,
	idle,
	scanning
}

export interface ScannerOptions {
	readonly debugView?: Boolean
	readonly useUrlHash?: Boolean
	readonly canvas: HTMLCanvasElement
	readonly video?: HTMLVideoElement
	readonly outlineColor?: string
	readonly deviceSelect?: HTMLSelectElement
	readonly markerChanged?: (marker: Marker | null) => void
	readonly stateChanged?: (state: ScannerState) => void
}

function parseColour(input: string): Array<number> {
	if (input.substr(0, 1) == "#") {
		const collen = (input.length - 1) / 3;
		const fact = [17, 1, 0.062272][collen - 1];
		return [
			Math.round(parseInt(input.substr(1, collen), 16) * fact),
			Math.round(parseInt(input.substr(1 + collen, collen), 16) * fact),
			Math.round(parseInt(input.substr(1 + 2 * collen, collen), 16) * fact)
		];
	} else return input.split("(")[1].split(")")[0].split(",").map(x => +x);
}

function parseColourToScalar(input: string | undefined): Scalar {
	if (input == null) {
		return new cv.Scalar(255, 255, 0, 255)
	}
	const array = parseColour(input)
	return new cv.Scalar(array[0], array[1], array[2], 255)
}

export interface Scanner {
	get state(): ScannerState

	start(): Promise<void>

	stop(): void
}

export async function createScanner(experience: Experience, options: ScannerOptions): Promise<Scanner> {
	if (location.protocol != 'https:' && location.hostname != 'localhost') {
		throw new Error("Artcodes requires https in order to access camera")
	}
	let opencvPath = 'opencv.js'
	await loadOpencv({
		opencvJsLocation: opencvPath
	})

	const scanner = new ScannerImpl(experience, options)

	if (location.hash == '#play') {
		await scanner.start()
	} else {
		scanner.stop()
	}
	return scanner
}

class ScannerImpl implements Scanner {
	private readonly experience: Experience
	private readonly options: ScannerOptions
	private _state: ScannerState = ScannerState.loading
	private readonly camera: VideoReader
	private readonly fps: number = 10
	private readonly morphKernel: Mat
	private readonly thresholder: Thresholder
	private detected: Marker | null = null
	private markerCount: number = 0

	private currentMarker: Marker | null = null

	private readonly detector

	constructor(experience: Experience, options: ScannerOptions) {
		this.experience = experience
		this.options = options

		this.detector = new MarkerDetector(experience)
		this.camera = new VideoReader({
			video: {
				width: {min: 600, ideal: 1920},
				height: {min: 400, ideal: 1080},
				facingMode: 'environment'
			},
			audio: false
		}, options.video);
		options.stateChanged?.(ScannerState.loading)
		if (this.experience.settings?.tile) {
			this.thresholder = new TileTresholder()
		} else {
			this.thresholder = new MovingThresholder()
		}
		this.morphKernel = cv.Mat.ones(2, 2, cv.CV_8U)
	}

	private setState(newState: ScannerState) {
		this._state = newState
		this.options.stateChanged?.(newState)
	}

	private selectListener = () => {
		this.camera.stop()
		this.camera.constraints = {
			video: {
				width: {min: 400, ideal: 800},
				height: {min: 400, ideal: 600},
				deviceId: this.options.deviceSelect?.value
			}
		}
		this.start()
	}

	get state(): ScannerState {
		return this._state
	}

	async start(): Promise<void> {
		if (this._state != ScannerState.scanning) {
			try {
				const actionTimeout = this.experience.settings?.actionTimout || 10000
				const actionDelay = this.experience.settings?.actionDelay || 0
				const colour = parseColourToScalar(this.options.outlineColor)

				const videoProps = await this.camera.start()
				const dst = new cv.Mat(videoProps.width, videoProps.height, cv.CV_8UC1)
				if ('aspectRatio' in this.options.canvas.style) {
					this.options.canvas.style.aspectRatio = videoProps.width! + ' / ' + videoProps.height!
					this.options.canvas.width = videoProps.width!
					this.options.canvas.height = videoProps.height!
				} else {
					const canvasWidth = this.options.canvas.parentElement!.clientWidth
					this.options.canvas.style.width = canvasWidth + 'px'
					this.options.canvas.style.height = Math.round(canvasWidth / videoProps.width! * videoProps.height!) + 'px'
					this.options.canvas.width = videoProps.width!
					this.options.canvas.height = videoProps.height!
				}
				let lastActionTime: number = 0
				this.options.stateChanged?.(ScannerState.scanning)
				this.options.markerChanged?.(null)
				if (this.options.useUrlHash) {
					history.replaceState(null, "", '#play');
				}

				if (this.options.deviceSelect != null) {
					this.options.deviceSelect.removeEventListener('input', this.selectListener)
					while (this.options.deviceSelect.options.length > 0) {
						this.options.deviceSelect.remove(0);
					}
					const devices = await navigator.mediaDevices.enumerateDevices()
					const cameras = devices.filter(device => device.kind == 'videoinput')
					if (cameras.length > 1) {
						cameras.forEach(camera => {
							const opt = document.createElement('option');
							opt.value = camera.deviceId;
							opt.innerHTML = camera.label;
							this.options.deviceSelect?.appendChild(opt);
						})
						if (this.camera.deviceId != undefined) {
							this.options.deviceSelect.value = this.camera.deviceId
						}
						this.options.deviceSelect.addEventListener('input', this.selectListener)
						this.options.deviceSelect.style.display = ''
					}
				}

				const processVideo = () => {
					if (this.camera.isStreaming) {
						const begin = Date.now()
						const src = this.camera.read()

						cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY)

						this.thresholder.threshold(dst, this.detected != null)

						const contours = new cv.MatVector()
						const hierarchy = new cv.Mat()
						cv.findContours(dst, contours, hierarchy, cv.RETR_TREE, cv.CHAIN_APPROX_SIMPLE)

						if (this.options.debugView) {
							cv.cvtColor(dst, dst, cv.COLOR_GRAY2RGBA)
						} else {
							src.copyTo(dst)
						}

						const marker = this.detector.findMarker(hierarchy)
						if (marker != null) {
							if (!marker.equals(this.detected)) {
								this.markerCount = 0
								this.detected = marker
							}
							this.markerCount = Math.min(actionDelay, this.markerCount + 2)
							if (this.markerCount >= actionDelay) {
								if (!this.currentMarker?.equals(marker)) {
									console.log(marker.regions)
									this.currentMarker = marker
									this.options.markerChanged?.(marker)
								}
								lastActionTime = Date.now() + actionTimeout
							}
							cv.drawContours(dst, contours, marker.nodeIndex, colour, 2, cv.LINE_AA, hierarchy, 100)
						} else {
							this.detected = null
							this.markerCount = Math.max(0, this.markerCount - 1)
							if (this.currentMarker != null && lastActionTime != 0 && Date.now() > lastActionTime) {
								lastActionTime = 0
								this.currentMarker = marker
								this.options.markerChanged?.(null)
							}
						}

						if (videoProps.facingMode == 'user') {
							cv.flip(dst, dst, 1)
						}
						cv.imshow(this.options.canvas, dst)
						const delay = 1000 / this.fps - (Date.now() - begin)
						setTimeout(processVideo, delay)
					} else {
						dst.delete()
						this.setState(ScannerState.idle)
					}
				}

				processVideo()
			} catch (error) {
				console.trace(error)
				this.stop()
			}
		}
	}

	stop(): void {
		if (this.options.useUrlHash) {
			history.replaceState(null, "", ' ' + '')
		}
		this.camera.stop()
		this.setState(ScannerState.idle)
	}
}