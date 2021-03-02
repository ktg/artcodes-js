import type { Action } from "./experience";
export declare class Marker {
    nodeIndex: number;
    regions: number[];
    action: Action;
    constructor(nodeIndex: number, regions: number[], action: Action);
    equals(marker: Marker): boolean;
}
