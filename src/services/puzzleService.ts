import type { Quiz } from "../models/Quiz";
import { Operator } from "../models/enums/Operator";
import type { Puzzle } from "../models/Puzzle";
import type { PuzzlePart } from "../models/PuzzlePart";
import { PuzzleMode } from "../models/enums/PuzzleMode";
import { GetEnumValues } from "./enumService";
import type { OperatorSettings } from "../models/OperatorSettings";

export function getPuzzle(quiz: Quiz, previousPuzzle: Puzzle | undefined) {

    const activeOperator: Operator = getOperator(quiz)

    const puzzle: Puzzle = {
        parts: getPuzzleParts(quiz.operatorSettings[activeOperator], previousPuzzle?.parts),
        operator: activeOperator,
        timeout: false,
        duration: 0,
        isCorrect: undefined,
        unknownPuzzlePartNumber: getUnknownPuzzlePartNumber(activeOperator, quiz.puzzleMode)
    }

    if (puzzle.operator === Operator.Division) {
        puzzle.parts[0].generatedValue = puzzle.parts[0].generatedValue * puzzle.parts[1].generatedValue
    } else if (shouldAvoidNegativeAnswer()) {
        puzzle.parts = puzzle.parts.reverse();
    }

    puzzle.parts.push(getAnswerPart(puzzle.parts[0].generatedValue, puzzle.parts[1].generatedValue, puzzle.operator))

    return puzzle;

    function shouldAvoidNegativeAnswer() {
        return (
            !quiz.allowNegativeAnswer &&
            puzzle.operator === Operator.Subtraction &&
            puzzle.parts[1].generatedValue > puzzle.parts[0].generatedValue
        )
    }

}

function getOperator(quiz: Quiz): Operator {
    if (quiz.selectedOperator === Operator.All) {
        let random = Math.ceil(Math.random() * 4)

        return GetEnumValues(Operator)[random - 1] as Operator;
    }

    return quiz.selectedOperator
}

function getPuzzleParts(settings: OperatorSettings, previousParts: PuzzlePart[] | undefined): PuzzlePart[] {
    const parts: PuzzlePart[] = [{ userDefinedValue: undefined, generatedValue: 0 }, { userDefinedValue: undefined, generatedValue: 0 }]

    switch (settings.operator) {
        case Operator.Addition:
            parts[0].generatedValue = getRandomNumber(settings.minValue, settings.maxValue, previousParts?.[0].generatedValue)
            parts[1].generatedValue = getRandomNumber(settings.minValue, settings.maxValue, previousParts?.[1].generatedValue)
            break;
        case Operator.Subtraction:
            parts[0].generatedValue = getRandomNumber(settings.minValue, settings.maxValue, previousParts?.[0].generatedValue)
            parts[1].generatedValue = getRandomNumber(settings.minValue, settings.maxValue, previousParts?.[1].generatedValue)
            break;
        case Operator.Multiplication:
            parts[0].generatedValue = getRandomNumberFromArray(settings.possibleValues, previousParts?.[0].generatedValue)
            parts[1].generatedValue = getRandomNumber(1, 10, previousParts?.[1].generatedValue)
            break;
        case Operator.Division:
            parts[0].generatedValue = getRandomNumber(1, 10, previousParts?.[0].generatedValue)
            parts[1].generatedValue = getRandomNumberFromArray(settings.possibleValues, previousParts?.[1].generatedValue)
            break;
        default:
            throw ('Cannot get puzzleParts: Operator not recognized')
    }

    return parts
}

function getRandomNumberFromArray(numbers: number[], previousNumber: number | undefined): number {
    if (numbers.length === 1) return numbers[0]

    let previousIndex = previousNumber ? numbers.indexOf(previousNumber) : undefined

    return numbers[getRandomNumber(0, numbers.length - 1, previousIndex)]
}

function getRandomNumber(min: number, max: number, exclude: number | undefined) {
    // Adapted from https://stackoverflow.com/a/34184614
    // console.log('min', min)
    // console.log('max', max)
    var rnd = Math.floor(Math.random() * ((exclude === undefined ? max + 1 : max) - min) + min)
    if (exclude !== undefined && rnd >= exclude) rnd++

    return rnd
}

function getAnswerPart(
    partOne: number,
    partTwo: number,
    activeOperator: Operator): PuzzlePart {
    return {
        generatedValue: getResult(),
        userDefinedValue: undefined
    }

    function getResult(): number {
        switch (activeOperator) {
            case Operator.Addition:
                return partOne + partTwo
            case Operator.Subtraction:
                return partOne - partTwo
            case Operator.Multiplication:
                return partOne * partTwo
            case Operator.Division:
                return partOne / partTwo
            default:
                throw new Error("Cannot get result. No valid operator defined");
        }
    }
}

function getUnknownPuzzlePartNumber(operator: Operator, puzzleMode: PuzzleMode): number {
    switch (puzzleMode) {
        case PuzzleMode.Random:
            if (getTrueOrFalse()) {
                return getAlternateUnknownPuzzlePart()
            } else {
                return 2
            }
        case PuzzleMode.Alternate: {
            return getAlternateUnknownPuzzlePart()
        }
        case PuzzleMode.Normal: {
            return 2
        }
    }

    function getAlternateUnknownPuzzlePart() {
        switch (operator) {
            case Operator.Addition:
            case Operator.Subtraction:
                return getTrueOrFalse() ? 0 : 1
            case Operator.Multiplication:
                return 1
            case Operator.Division:
                return 0
            default:
                throw new Error("No operator defined");
        }
    }

    function getTrueOrFalse() {
        // Stolen from https://stackoverflow.com/a/36756480
        return Math.random() >= 0.5
    }
}