export declare class Action {
    readonly codes: Array<string>;
    readonly name: string;
    readonly url: string;
}
export declare class Settings {
    readonly threshSize: number;
    readonly threshConst: number;
}
export declare class Experience {
    readonly name: string;
    readonly image: string;
    readonly actions: Array<Action>;
    readonly settings: Settings;
}
