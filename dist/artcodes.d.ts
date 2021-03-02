declare class Action {
    readonly codes: Array<string>;
    readonly name: string;
    readonly url: string;
}
declare class Settings {
    readonly threshSize: number;
    readonly threshConst: number;
}
declare class Experience {
    readonly name: string;
    readonly image: string;
    readonly actions: Array<Action>;
    readonly settings: Settings;
}
declare class Marker {
    nodeIndex: number;
    regions: number[];
    action: Action;
    constructor(nodeIndex: number, regions: number[], action: Action);
    equals(marker: Marker): boolean;
}
declare enum State {
    loading = 0,
    idle = 1,
    scanning = 2
}
declare class ScannerUI {
    readonly debugView?: Boolean;
    readonly video: HTMLVideoElement;
    readonly canvas: HTMLCanvasElement;
    readonly deviceSelect: HTMLSelectElement;
    readonly markerChanged: (marker: Marker) => void;
    readonly stateChanged: (state: State) => void;
}
declare function createScanner(experience: Experience, ui: ScannerUI): Promise<Scanner>;
declare class Scanner {
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
export { State, ScannerUI, createScanner, Scanner };
