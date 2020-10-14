import {Marker} from "./marker";

const test = {
	"actions": [{
		"codes": ["1:1:1:3:3", "1:1:1:6:6", "1:1:2:2:3", "1:1:2:4:4", "1:1:2:4:4", "1:1:2:5:6", "1:1:3:5:5", "1:1:4:4:5"],
		"match": "any",
		"name": "Artcodes",
		"showDetail": false,
		"url": "http://www.artcodes.co.uk"
	}, {
		"codes": ["1:1:1:1:2", "1:1:1:1:5", "1:1:1:3:6", "1:1:1:4:5", "1:1:2:2:6", "1:1:2:3:5", "1:1:3:3:4", "1:1:3:4:6"],
		"match": "any",
		"name": "How to Draw Artcodes",
		"showDetail": false,
		"url": "http://www.artcodes.co.uk/step-by-step-drawing/"
	}, {
		"codes": ["1:1:2:4:6"],
		"match": "any",
		"name": "Artcodes Basics",
		"showDetail": false,
		"url": "http://www.artcodes.co.uk/artcodes-basics"
	}],
	"author": "Kevin Glover",
	"availabilities": [{}],
	"description": "Artcodes marks a paradigm shift in visual recognition, offering difference to discerning brands. We design visually beautiful images and encode them, resulting in the same interactivity as that of the QR code but with a more visually engaging and playful experience. Images can be the identical with unique codes or the opposite visually unique with identical codes. This interplay offers a new opportunity for visual interaction within, product, packaging, service and interaction design.\n\nThere is an important structure to the Artcodes visual recognition app and it\u0027s imagery. It is not complicated to do and once mastered it allows the user to visually redesign the codes again and again. A context or brand specific app ensures users are able to find and trigger our beautifully designed patterns and their hidden content. The app does not recognize the image it simply scans the topography of the image thus allowing for a playful and poetic approach to the generation of visual markers and triggers.",
	"icon": "http://www.wornchaos.org/experiences/uk.ac.horizon.aestheticodes.default.png",
	"id": "http://aestheticodes.appspot.com/experience/4c758e29-0759-4583-a0d4-71ee692b7f86",
	"image": "https://aestheticodes.appspot.com/image/4b33ca9be1356c10dbc746ce2cb7d0a867f7a587ec2618536a3f047fc2aa4892",
	"name": "Artcodes",
	"pipeline": ["tile", "detect"]
}

export class Action {
	readonly codes: Array<string>
	//readonly match: string
	readonly name: string
	//readonly showDetails: boolean
	readonly url: string
}

export class Experience {
	readonly name: string
	readonly image: string
	readonly actions: Array<Action>
	//readonly author: string
	//readonly description: string
	//readonly icon: string
}