export interface Action {
	readonly name?: string
	readonly url?: string
	readonly codes: Array<string>
	//readonly match: string
	//readonly showDetails: boolean
}

export interface Settings {
	readonly threshSize?: number
	readonly threshConst?: number
	readonly actionTimout?: number
	readonly actionDelay?: number
	readonly embeddedChecksum?: boolean
	readonly tile?: boolean
}

export interface Experience {
	readonly name?: string
	readonly image?: string
	readonly actions: Array<Action>
	readonly settings?: Settings
	//readonly author: string
	//readonly description: string
	//readonly icon: string
}