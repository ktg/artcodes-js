declare class Action {
    readonly codes: Array<string>;
    //readonly match: string
    readonly name: string;
    //readonly showDetails: boolean
    readonly url: string;
}
declare class Settings {
    readonly threshSize: number;
    readonly threshConst: number;
}
declare class Experience {
    readonly name: string | null;
    readonly image: string | null;
    readonly actions: Array<Action>;
    readonly settings: Settings;
}
declare class Marker {
    nodeIndex: number;
    regions: number[];
    action: Action;
    constructor(nodeIndex: number, regions: number[], action: Action);
    equals(marker: Marker | null): boolean;
}
declare enum State {
    loading = 0,
    idle = 1,
    scanning = 2
}
declare class ScannerOptions {
    readonly debugView?: Boolean;
    readonly useUrlHash?: Boolean;
    readonly video: HTMLVideoElement;
    readonly canvas: HTMLCanvasElement;
    readonly deviceSelect: HTMLSelectElement | null;
    readonly markerChanged: (marker: Marker | null) => void;
    readonly stateChanged: (state: State) => void;
}
declare class Scanner {
    private readonly experience;
    private readonly options;
    private _state;
    private readonly camera;
    private readonly fps;
    private currentMarker;
    private readonly color;
    private readonly detector;
    constructor(experience: Experience, options: ScannerOptions);
    private setState;
    private selectListener;
    get state(): State;
    start(): Promise<void>;
    stop(): void;
}
declare function createScanner(experience: Experience, options: ScannerOptions): Promise<Scanner>;
export { createScanner };
