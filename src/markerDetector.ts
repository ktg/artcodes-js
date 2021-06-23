import type {Mat} from "mirada";
import type {Action, Experience} from "./experience";
import {Marker} from "./marker";

const NEXT_NODE = 0;
const FIRST_CHILD_NODE = 2;
//const PREV_NODE = 1;
//const PARENT_NODE = 3;

class MarkerCode {
	readonly code: Array<number>
	readonly action: Action

	constructor(code: Array<number>, action: Action) {
		this.code = code
		this.action = action
	}
}

export class MarkerDetector {
	private readonly maxRegions: number
	private readonly minRegions: number
	private readonly maxValue: number
	private readonly minValue: number
	private readonly embeddedChecksum: boolean

	private readonly experience: Experience
	private readonly codes: Array<MarkerCode>

	constructor(experience: Experience) {
		this.experience = experience
		let codes = Array<MarkerCode>()
		let minValue = 20
		let maxValue = 1
		let maxRegions = 20
		let minRegions = 1
		this.embeddedChecksum = experience.settings && experience.settings.embeddedChecksum || false
		experience.actions.forEach(action => {
			action.codes.forEach(code => {
				const markerCode = new MarkerCode(code.split(':').map((value) => {
					return Number.parseInt(value)
				}), action)
				codes.push(markerCode)
				maxRegions = Math.min(markerCode.code.length, maxRegions)
				minRegions = Math.max(markerCode.code.length, minRegions)
				markerCode.code.forEach((value) => {
					minValue = Math.min(value, minValue)
					maxValue = Math.max(value, maxValue)
				})
			})
		})
		this.codes = codes
		this.maxRegions = maxRegions
		this.minRegions = minRegions
		this.maxValue = maxValue
		this.minValue = minValue
		//console.log(this)
	}

	findMarker(hierarchy: Mat): Marker | null {
		for (let i = 0; i < hierarchy.cols; ++i) {
			let result = this.createMarkerForNode(i, hierarchy)
			if (result != null) {
				return result;
			}
		}
		return null
	}

	private static getFirstChild(hierarchy: Mat, nodeIndex: number): number {
		return (hierarchy.intPtr(0, nodeIndex) as Int32Array)[FIRST_CHILD_NODE]
	}

	private static getNextNode(hierarchy: Mat, nodeIndex: number): number {
		return (hierarchy.intPtr(0, nodeIndex) as Int32Array)[NEXT_NODE]
	}

	private createMarkerForNode(nodeIndex: number, hierarchy: Mat) {
		let regions: number[] = []
		let checksum: number | null = null

		let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, nodeIndex)
		while (currentNodeIndex >= 0) {
			let leafs = MarkerDetector.countLeafs(currentNodeIndex, hierarchy, this.minValue, this.maxValue)
			if (leafs != null) {
				if (regions.length >= this.maxRegions) {
					return null
				}

				regions.push(leafs)
			} else if (this.embeddedChecksum && checksum == null) {
				checksum = MarkerDetector.countChecksum(currentNodeIndex, hierarchy)
				if (checksum == null) {
					return null
				}
			} else {
				return null
			}
			currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex);
		}

		if (regions.length < this.minRegions) {
			return null
		}

		regions.sort()

		if (this.embeddedChecksum) {
			if (checksum == null) {
				return null
			}
			if (!MarkerDetector.isChecksumValid(regions, checksum)) {
				return null
			}
		}

		for (let code of this.codes) {
			let is_same = (code.code.length == regions.length) && code.code.every((element, index) => element === regions[index]);
			if (is_same) {
				return new Marker(nodeIndex, regions, code.action);
			}
		}
		return null;
	}

	private static isChecksumValid(regions: number[], checksum: number) {
		// Find weighted sum of code, e.g. 1:1:2:4:4 -> 1*1 + 1*2 + 2*3 + 4*4 + 4*5 = 45
		// Although do not use weights/values divisible by 7
		// e.g. transform values 1,2,3,4,5,6,7,8, 9,10,11,12,13,14,15... to
		//                       1,2,3,4,5,6,8,9,10,11,12,13,15,16,17
		const embeddedChecksumModValue = 7
		let weightedSum = 0
		let weight = 1
		regions.forEach((value) => {
			if (weight % embeddedChecksumModValue == 0) {
				weight++
			}
			weightedSum += value * weight
			weight++
		})

		return checksum == (weightedSum - 1) % 7 + 1
	}

	private static countChecksum(regionIndex: number, hierarchy: Mat): number | null {
		let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, regionIndex)
		if (currentNodeIndex < 0) {
			return null
		}

		let dotCount = 0
		while (currentNodeIndex >= 0) {
			if (MarkerDetector.isValidHollowDot(currentNodeIndex, hierarchy)) {
				dotCount++;
			} else //if (!(this.relaxedEmbeddedChecksumIgnoreNonHollowDots && this.isValidDot(currentDotIndex, hierarchy)))
			{
				return null
			}

			currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex)
		}

		return dotCount
	}

	private static isValidHollowDot(nodeIndex: number, hierarchy: Mat): boolean {
		let firstChild = MarkerDetector.getFirstChild(hierarchy, nodeIndex)
		return firstChild >= 0
			&& MarkerDetector.getNextNode(hierarchy, firstChild) < 0
	}

	private static countLeafs(nodeIndex: number, hierarchy: Mat, minLeaves: number, maxLeaves: number): number | null {
		let leafCount = 0;
		let currentNodeIndex = MarkerDetector.getFirstChild(hierarchy, nodeIndex)
		while (currentNodeIndex >= 0) {
			if (MarkerDetector.getFirstChild(hierarchy, currentNodeIndex) >= 0) {
				return null;
			}
			leafCount++
			if (leafCount > maxLeaves) {
				console.log("Leaf count too high:" + leafCount)
				return null;
			}
			currentNodeIndex = MarkerDetector.getNextNode(hierarchy, currentNodeIndex);
		}

		if (leafCount < minLeaves) {
			return null;
		}

		return leafCount;
	}
}
