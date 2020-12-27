import type { Operator } from "./constants/Operator"
import type { NumberRange } from "./NumberRange"

export type OperatorSettings = {
    operator: Operator
    range: NumberRange
    possibleValues: Array<number>
    score: number
}