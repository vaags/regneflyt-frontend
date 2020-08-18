import type { Operator } from "./enums/Operator";
import type { PuzzleMode } from "./enums/PuzzleMode"
import type { QuizPuzzlePartSettings } from "./QuizPuzzlePartSettings"
import type { QuizState } from "./enums/QuizState"

export type Quiz = {
    title: string | undefined
    duration: number
    puzzleTimeLimit: number
    partSettings: QuizPuzzlePartSettings[]
    state: QuizState
    selectedOperator: Operator
    allowNegativeAnswer: boolean
    puzzleMode: PuzzleMode
    showSettings: boolean
    sharing: {
        title: string,
        showSettings: boolean
    }
}
