import { Mat } from "mirada";
import { Marker } from "./marker";
import type { Experience } from "./experience";
export declare class MarkerDetector {
    private readonly maxRegions;
    private readonly minRegions;
    private readonly maxValue;
    private readonly minValue;
    private readonly experience;
    private readonly codes;
    constructor(experience: Experience);
    findMarker(hierarchy: Mat): Marker;
    private static getFirstChild;
    private static getNextNode;
    private createMarkerForNode;
    private countLeafs;
}
