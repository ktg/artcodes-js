import {Mat} from "mirada";

export interface Thresholder {
	threshold(img: Mat, detected: boolean): void
}

export class MovingThresholder implements Thresholder {
	private readonly step = 4
	private readonly range = 128
	private readonly threshSize = 301
	private threshConst: number = 0
	private lastMatch: number = 0

	threshold(img: Mat, detected: boolean) {
		if (!detected) {
			let min = this.lastMatch - (this.range / 2)
			this.threshConst = ((this.threshConst + this.step - min) % this.range) + min
		} else {
			this.lastMatch = this.threshConst
			console.log("Thresh: " + this.threshConst)
		}
		//cv.equalizeHist(dst, dst)
		cv.blur(img, img, new cv.Size(3, 3))
		//cv.threshold(img, img, this.threshConst, 255, cv.THRESH_BINARY);
		cv.adaptiveThreshold(img, img, 255, cv.ADAPTIVE_THRESH_MEAN_C, cv.THRESH_BINARY, this.threshSize, this.threshConst)

	}
}

export class TileTresholder implements Thresholder {
	private readonly threshValue: number = 128
	private readonly minTiles = 4
	private readonly maxTiles = 8
	private tileCount: number = this.minTiles

	threshold(img: Mat, detected: boolean) {
		if (!detected) {
			if (this.tileCount == this.maxTiles) {
				this.tileCount = this.minTiles
			} else {
				this.tileCount++
			}
		} else {
			console.log("Tiles: " + this.tileCount)
		}
		//cv.equalizeHist(img, img)
		cv.blur(img, img, new cv.Size(3, 3))

		const width = img.cols
		const height = img.rows
		const tileWidth = Math.round(width / this.tileCount)
		const tileHeight = Math.round(height / this.tileCount)

		for (let colIndex = 0; colIndex < this.tileCount; colIndex++) {
			const startCol = colIndex * tileWidth
			const colWidth = colIndex === this.tileCount - 1 ? width - startCol : tileWidth
			for (let rowIndex = 0; rowIndex < this.tileCount; rowIndex++) {
				const startRow = rowIndex * tileHeight
				const rowHeight = rowIndex === this.tileCount - 1 ? height - startRow : tileHeight

				const tileMat = img.roi(new cv.Rect(startCol, startRow, colWidth, rowHeight))
				cv.threshold(tileMat, tileMat, this.threshValue, 255, cv.THRESH_BINARY + cv.THRESH_OTSU)
			}
		}
	}
}