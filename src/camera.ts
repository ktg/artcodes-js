import type * as Mirada from "mirada";
import type {Mat, VideoCapture} from "mirada";

declare var cv: Mirada.CV

export interface VideoSettings {
	width: number
	height: number
	shouldFlip: boolean
}

export class VideoReader {
	public get isStreaming(): boolean {
		return this.streaming
	}

	public get constraints(): MediaStreamConstraints {
		return this._constraints
	}

	public set constraints(constraint) {
		const wasRunning = this.streaming
		this.stop()
		this._constraints = constraint
		if (wasRunning) {
			this.start()
		}
	}

	public get deviceId(): string | undefined {
		return this._deviceId
	}

	private readonly video: HTMLVideoElement
	private readonly canvas: HTMLCanvasElement

	private _constraints: MediaStreamConstraints

	private mat: Mat
	private _deviceId: string | undefined
	private readonly cap: VideoCapture
	private streaming: boolean = false
	protected stream: MediaStream | undefined;

	constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement, constraints: MediaStreamConstraints) {
		this._constraints = constraints
		this.video = video
		this.cap = new cv.VideoCapture(video)
		this.canvas = canvas
		this.mat = cv.Mat.zeros(10, 10, cv.CV_8UC4)
		this.streaming = false
	}

	read(): Mat {
		this.cap.read(this.mat);
		return this.mat
	}

	async start(): Promise<VideoSettings> {
		this.stream = this.video.srcObject = await navigator.mediaDevices.getUserMedia(this._constraints)
		const settings = this.stream.getVideoTracks()[0].getSettings()
		this._deviceId = settings.deviceId
		const width = settings.width!!
		const height = settings.height!!
		this.video.width = width
		this.video.height = height
		await this.video.play()
		this.canvas.width = width
		this.canvas.height = height
		this.mat = cv.Mat.zeros(height, width, cv.CV_8UC4)
		this.streaming = true
		return {width: width, height: height, shouldFlip: settings.facingMode == "user"}
	}

	stop(): void {
		if (this.streaming) {
			this.stream?.getVideoTracks().forEach(t => t.stop())
			this.canvas.getContext('2d')?.clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.video.pause()
			this.streaming = false
			this.mat.delete()
		}
	}
}