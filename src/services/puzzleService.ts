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
        parts: [
            getPuzzlePart(quiz.operatorSettings[activeOperator], previousPuzzle?.parts[0]),
            getPuzzlePart(quiz.operatorSettings[activeOperator], previousPuzzle?.parts[1])
        ],
        operator: activeOperator,
        timeout: false,
        duration: 0,
        isCorrect: undefined,
        unknownPuzzlePartNumber: getUnknownPuzzlePartNumber(activeOperator, quiz.puzzleMode)
    }

    if (puzzle.operator === Operator.Division) {
        puzzle.parts[0].generatedValue = puzzle.parts[0].generatedValue * puzzle.parts[1].generatedValue
    } else if (shouldAvoidNegativeAnswer()) {
        swapPuzzlePartValues()
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

    function swapPuzzlePartValues() {
        [puzzle.parts[0], puzzle.parts[1]] = [puzzle.parts[1], puzzle.parts[0]]
    }
}

function getOperator(quiz: Quiz): Operator {
    if (quiz.selectedOperator === Operator.All) {
        let random = Math.ceil(Math.random() * 4)

        return GetEnumValues(Operator)[random - 1] as Operator;
    }

    return quiz.selectedOperator
}

function getPuzzlePart(operatorSettings: OperatorSettings, previousPuzzlePart: PuzzlePart | undefined): PuzzlePart {
    if (operatorSettings.possibleValues?.length > 0) {

        if (operatorSettings.possibleValues.length === 1) {
            return {
                generatedValue: operatorSettings.possibleValues[0],
                userDefinedValue: undefined
            }
        }

        let previousIndex: number | undefined = undefined;

        if (previousPuzzlePart !== undefined) {
            previousIndex = operatorSettings.possibleValues.indexOf(previousPuzzlePart.generatedValue);
        }

        let randomIndex = getRandomNumber(
            0, operatorSettings.possibleValues.length - 1, previousIndex
        )

        return {
            generatedValue: operatorSettings.possibleValues[randomIndex],
            userDefinedValue: undefined
        }
    } else {
        return {
            generatedValue: getRandomNumber(
                operatorSettings.minValue,
                operatorSettings.maxValue,
                previousPuzzlePart?.generatedValue),
            userDefinedValue: undefined
        }
    }

    function getRandomNumber(min: number, max: number, exclude: number | undefined) {
        // Adapted from https://stackoverflow.com/a/34184614
        var rnd = Math.floor(Math.random() * ((exclude === undefined ? max + 1 : max) - min) + min)
        if (exclude !== undefined && rnd >= exclude) rnd++

        return rnd
    }
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