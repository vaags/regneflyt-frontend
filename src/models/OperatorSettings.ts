import type { Operator } from "./constants/Operator"

export type OperatorSettings = {
    operator: Operator
    minValue: number
    maxValue: number
    possibleValues: Array<number>
    score: number
}