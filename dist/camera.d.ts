import type { Mat } from "mirada";
export declare class VideoReader {
    get isStreaming(): boolean;
    get constraints(): MediaStreamConstraints;
    set constraints(constraint: MediaStreamConstraints);
    get deviceId(): string;
    private readonly video;
    private readonly canvas;
    private _constraints;
    private mat;
    private settings;
    private _deviceId;
    private readonly cap;
    private streaming;
    protected stream: MediaStream | undefined;
    constructor(video: HTMLVideoElement, canvas: HTMLCanvasElement, constraints: MediaStreamConstraints);
    read(): Mat;
    get shouldFlip(): boolean;
    get width(): number;
    get height(): number;
    start(): Promise<void>;
    stop(): void;
}
