export class Action {
	readonly codes: Array<string> = []
	//readonly match: string
	readonly name: string = "Temp"
	//readonly showDetails: boolean
	readonly url: string = ""
}

export class Settings {
	readonly threshSize: number = 101
	readonly threshConst: number = 1
}

export class Experience {
	readonly name: string | null = null
	readonly image: string | null = null
	readonly actions: Array<Action> = []
	readonly settings: Settings = new Settings()
	//readonly author: string
	//readonly description: string
	//readonly icon: string
}