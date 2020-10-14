import {Mat, Size, VideoCapture} from "mirada";
import * as Mirada from "mirada";

declare var cv: Mirada.CV

export class VideoReader {
	public get isStreaming(): boolean {
		return this.streaming
	}

	public get size(): Size {
		return this._size;
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

	public get deviceId(): string {
		return this._deviceId
	}

	private readonly video: HTMLVideoElement
	private readonly canvas: HTMLCanvasElement

	private _constraints: MediaStreamConstraints

	//private o: Options;
	private mat: Mat;
	private _size: Size;
	private _deviceId: string;
	private readonly cap: VideoCapture;
	private streaming: boolean
	// private static defaultOptions: Options = {
	// 	size: 'video',
	// 	constraints: {}
	// };
	protected stream: MediaStream | undefined;

	constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement, constraints: MediaStreamConstraints) {
		this.constraints = constraints
		this.video = video
		this.cap = new cv.VideoCapture(video)
		this.canvas = canvas
		this.mat = null
		this.streaming = false
		this._size = this.getSize()
	}

	read(): Mat {
		this.cap.read(this.mat);
		return this.mat
	}

	async start(): Promise<void> {
		const stream = await navigator.mediaDevices.getUserMedia(this._constraints)
		this.stream = this.video.srcObject = stream;
		this._deviceId = this.stream.getVideoTracks()[0].getCapabilities().deviceId
		await this.video.play()
		const size = this.getSize()
		this._size = size
		this.canvas.width = size.width
		this.canvas.height = size.height
		this.mat = cv.Mat.zeros(size.height, size.width, cv.CV_8UC4)
		this.streaming = true
	}

	stop(): void {
		if (this.streaming) {
			this.stream.getVideoTracks().forEach(function (t) {
				return t.stop();
			})
			this.canvas.getContext('2d').clearRect(0, 0, this.canvas.width, this.canvas.height)
			this.video.pause()
			this.streaming = false
			this.mat.delete()
		}
	}

	private getSize(): Size {
		return {
			width: this.video.width,
			height: this.video.height
		}
	}
}