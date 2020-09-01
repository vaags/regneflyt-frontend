import type { Operator } from "./enums/Operator";
import type { PuzzleMode } from "./enums/PuzzleMode"
import type { OperatorSettings } from "./OperatorSettings"
import type { QuizState } from "./enums/QuizState"

export type Quiz = {
    title: string | undefined
    duration: number
    puzzleTimeLimit: number
    operatorSettings: OperatorSettings[]
    state: QuizState
    selectedOperator: Operator
    allowNegativeAnswer: boolean
    puzzleMode: PuzzleMode
    showSettings: boolean
}
