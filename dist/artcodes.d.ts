import type { Marker } from "./marker";
import type { Experience } from "./experience";
export declare enum State {
    loading = 0,
    idle = 1,
    scanning = 2
}
export declare class ScannerUI {
    readonly debugView?: Boolean;
    readonly video: HTMLVideoElement;
    readonly canvas: HTMLCanvasElement;
    readonly deviceSelect: HTMLSelectElement;
    readonly markerChanged: (marker: Marker) => void;
    readonly stateChanged: (state: State) => void;
}
export declare function createScanner(experience: Experience, ui: ScannerUI): Promise<Scanner>;
export declare class Scanner {
    private readonly experience;
    private readonly ui;
    private _state;
    private readonly camera;
    private readonly fps;
    private currentMarker;
    private readonly color;
    private readonly detector;
    constructor(experience: Experience, ui: ScannerUI);
    private setState;
    private selectListener;
    get state(): State;
    start(): Promise<void>;
    stop(): void;
}
