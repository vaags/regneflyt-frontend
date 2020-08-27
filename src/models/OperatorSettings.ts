import type { Operator } from "./enums/Operator"

export type OperatorSettings = {
    operator: Operator
    minValue: number
    maxValue: number
    possibleValues: Array<number>
}