import type { OperatorSettings } from "../models/OperatorSettings";
import { Operator } from "../models/enums/Operator";

export function getQuizScore(settings: OperatorSettings[]): OperatorSettings[] {
    settings.forEach(e => {
        e.score = getOperatorScore(e)
    });

    return settings
}

function getOperatorScore(settings: OperatorSettings): number {
    switch (settings.operator) {
        case Operator.Addition:
        case Operator.Subtraction:
            return Math.round((settings.maxValue - settings.minValue) * settings.maxValue / 10)
        case Operator.Multiplication:
        case Operator.Division:
            return getMultiplicationTableScore(settings.possibleValues) * settings.possibleValues.length
        default:
            throw ('Cannot get score: Operator not recognized')
    }
}

function getMultiplicationTableScore(multipliers: number[]): number {
    return multipliers
        .map(m => multiplicationScoreTable[m - 1])
        .reduce((a, b) => a + b)
}

const multiplicationScoreTable = [
    10, // 1
    20, // 2
    30, // 3
    30, // 4
    20, // 5
    40, // 6
    50, // 7
    50, // 8
    40, // 9
    10, // 10
    20, // 11
    60  // 12
]