import type { Operator } from "./enums/Operator"
import type { PuzzleMode } from "./enums/PuzzleMode"

export type AppSettings = {
    isProduction: boolean
    transitionDuration: {
        duration: number
    },
    operators: Operator[]
    operatorLabels: string[],
    operatorSigns: string[],
    puzzleModes: PuzzleMode[]
    displayGreeting: boolean,
    apiEndpoint: string,
    apiKey: string,
    showHighscores: boolean
}