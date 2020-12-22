import type { Operator } from "./constants/Operator"
import type { PuzzleMode } from "./constants/PuzzleMode"
import type { OperatorSettings } from "./OperatorSettings"
import type { QuizState } from "./constants/QuizState"

export type Quiz = {
    title: string | undefined
    duration: number
    puzzleTimeLimit: number
    operatorSettings: OperatorSettings[]
    state: QuizState
    selectedOperator: Operator | 4
    allowNegativeAnswer: boolean
    puzzleMode: PuzzleMode
    showSettings: boolean
    previousScore: number | undefined
}
