interface Action {
    readonly name?: string;
    readonly url?: string;
    readonly codes: Array<string>;
}
interface Settings {
    readonly threshSize?: number;
    readonly threshConst?: number;
    readonly actionTimout?: number;
    readonly actionDelay?: number;
    readonly embeddedChecksum?: boolean;
    readonly tile?: boolean;
}
interface Experience {
    readonly name?: string;
    readonly image?: string;
    readonly actions: Array<Action>;
    readonly settings?: Settings;
}

declare class Marker {
    nodeIndex: number;
    regions: number[];
    action: Action;
    constructor(nodeIndex: number, regions: number[], action: Action);
    equals(marker: Marker | null): boolean;
}

declare enum ScannerState {
    loading = 0,
    idle = 1,
    scanning = 2
}
interface ScannerOptions {
    readonly debugView?: Boolean;
    readonly useUrlHash?: Boolean;
    readonly canvas: HTMLCanvasElement;
    readonly video?: HTMLVideoElement;
    readonly outlineColor?: string;
    readonly deviceSelect?: HTMLSelectElement;
    readonly markerChanged?: (marker: Marker | null) => void;
    readonly stateChanged?: (state: ScannerState) => void;
}
interface Scanner {
    get state(): ScannerState;
    start(): Promise<void>;
    stop(): void;
}
declare function createScanner(experience: Experience, options: ScannerOptions): Promise<Scanner>;

export { Action, Experience, Marker, Scanner, ScannerOptions, ScannerState, Settings, createScanner };
