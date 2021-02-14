import type { Quiz } from '../models/Quiz'
import { Operator } from '../models/constants/Operator'
import type { Puzzle } from '../models/Puzzle'
import type { PuzzlePart } from '../models/PuzzlePart'
import { PuzzleMode } from '../models/constants/PuzzleMode'
import type { OperatorSettings } from '../models/OperatorSettings'

export function getPuzzle(
    quiz: Quiz,
    operatorSigns: string[],
    previousPuzzle: Puzzle | undefined = undefined
): Puzzle {
    const activeOperator: Operator = getOperator(quiz.selectedOperator)

    return {
        parts: getPuzzleParts(
            quiz.operatorSettings[activeOperator],
            previousPuzzle?.parts
        ),
        operator: activeOperator,
        operatorLabel: operatorSigns[activeOperator],
        timeout: false,
        duration: 0,
        isCorrect: undefined,
        unknownPuzzlePart: getUnknownPuzzlePartNumber(
            activeOperator,
            quiz.puzzleMode
        ),
    }
}

function getOperator(operator: Operator | 4 | undefined): Operator {
    if (operator === undefined)
        throw 'Cannot get operator: parameter is undefined'
    if (operator === 4) {
        return (Math.ceil(Math.random() * 4) - 1) as Operator
    }

    return operator
}

function getPuzzleParts(
    settings: OperatorSettings,
    previousParts: PuzzlePart[] | undefined
): PuzzlePart[] {
    const parts: PuzzlePart[] = Array.from({ length: 3 }, (_) => ({
        userDefinedValue: undefined,
        generatedValue: 0,
    }))

    switch (settings.operator) {
        case Operator.Addition: {
            parts[2].generatedValue = getRandomNumber(
                settings.range.min,
                settings.range.max,
                previousParts?.[2].generatedValue
            )

            parts[0].generatedValue = getRandomNumber(
                0,
                parts[2].generatedValue,
                previousParts?.[0].generatedValue
            )

            parts[1].generatedValue =
                parts[2].generatedValue - parts[0].generatedValue

            break
        }
        case Operator.Subtraction:
            parts[0].generatedValue = getRandomNumber(
                settings.range.min,
                settings.range.max,
                previousParts?.[0].generatedValue
            )

            parts[1].generatedValue = getRandomNumber(
                settings.range.min,
                settings.range.max,
                previousParts?.[1].generatedValue
            )

            parts[2].generatedValue =
                parts[0].generatedValue - parts[1].generatedValue

            break
        case Operator.Multiplication:
            parts[0].generatedValue = getRandomNumberFromArray(
                settings.possibleValues,
                previousParts?.[0].generatedValue
            )
            parts[1].generatedValue = getRandomNumber(
                1,
                10,
                previousParts?.[1].generatedValue
            )
            parts[2].generatedValue =
                parts[0].generatedValue * parts[1].generatedValue
            break
        case Operator.Division:
            parts[0].generatedValue = getRandomNumber(
                1,
                10,
                getInitialDivisionPartValue(previousParts)
            )
            parts[1].generatedValue = getRandomNumberFromArray(
                settings.possibleValues,
                previousParts?.[1].generatedValue
            )
            parts[0].generatedValue =
                parts[0].generatedValue * parts[1].generatedValue
            parts[2].generatedValue =
                parts[0].generatedValue / parts[1].generatedValue
            break
        default:
            throw 'Cannot get puzzleParts: Operator not recognized'
    }

    return parts
}

function getInitialDivisionPartValue(puzzleParts: PuzzlePart[] | undefined) {
    if (!puzzleParts || puzzleParts.length === 0) return undefined

    return puzzleParts[0].generatedValue / puzzleParts[1].generatedValue
}

function getRandomNumberFromArray(
    numbers: number[],
    previousNumber: number | undefined
): number {
    if (numbers.length === 1) return numbers[0]

    let previousIndex = previousNumber
        ? numbers.indexOf(previousNumber)
        : undefined

    return numbers[getRandomNumber(0, numbers.length - 1, previousIndex)]
}

function getRandomNumber(
    min: number,
    max: number,
    exclude: number | undefined = undefined
) {
    // Adapted from https://stackoverflow.com/a/34184614
    var rnd = Math.floor(
        Math.random() * ((exclude === undefined ? max + 1 : max) - min) + min
    )
    if (exclude !== undefined && rnd >= exclude) rnd++

    return rnd
}

function getUnknownPuzzlePartNumber(
    operator: Operator,
    puzzleMode: PuzzleMode
): number {
    switch (puzzleMode) {
        case PuzzleMode.Random:
            if (getTrueOrFalse()) {
                return getAlternateUnknownPuzzlePart(operator)
            } else {
                return 2
            }
        case PuzzleMode.Alternate:
            return getAlternateUnknownPuzzlePart(operator)
        case PuzzleMode.Normal:
        default:
            return 2
    }
}

function getAlternateUnknownPuzzlePart(operator: Operator) {
    switch (operator) {
        case Operator.Addition:
        case Operator.Subtraction:
            return getTrueOrFalse() ? 0 : 1
        case Operator.Multiplication:
            return 1
        case Operator.Division:
            return 0
        default:
            throw new Error('No operator defined')
    }
}

function getTrueOrFalse() {
    // Stolen from https://stackoverflow.com/a/36756480
    return Math.random() >= 0.5
}
