import { Quiz } from "../models/Quiz";
import { Operator } from "../models/Operator";
import { Puzzle } from "../models/Puzzle";
import { PuzzlePart } from "../models/PuzzlePart";
import { QuizPuzzlePart } from "../models/QuizPuzzlePart";

export function getPuzzle(quiz: Quiz, previousPuzzle: Puzzle, activeOperator: Operator, unknownPuzzlePart: Number) {
    const puzzle: Puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: activeOperator
    }

    puzzle.partOne = getPuzzlePart(quiz.partOne, previousPuzzle.partOne, unknownPuzzlePart === 1)
    puzzle.partTwo = getPuzzlePart(quiz.partTwo, previousPuzzle.partTwo, unknownPuzzlePart === 2)

    if (shouldAvoidNegativeAnswer()) swapPuzzlePartValues()

    puzzle.answer = getAnswer(puzzle.partOne.generatedValue, puzzle.partTwo.generatedValue, activeOperator, unknownPuzzlePart === 3)

    return puzzle;

    function shouldAvoidNegativeAnswer() {
        return (
            !quiz.allowNegativeAnswer &&
            activeOperator === Operator.Subtraction &&
            puzzle.partTwo.generatedValue > puzzle.partOne.generatedValue
        )
    }

    function swapPuzzlePartValues() {
        [puzzle.partOne, puzzle.partTwo] = [puzzle.partTwo, puzzle.partOne]
    }
}

function getPuzzlePart(quizPuzzlePart: QuizPuzzlePart, previousPuzzlePart: PuzzlePart, isUnknown: boolean): PuzzlePart {
    if (quizPuzzlePart.minValue === quizPuzzlePart.maxValue) {
        return {
            index: 0,
            generatedValue: quizPuzzlePart.minValue,
            userDefinedValue: undefined,
            isUnknown: isUnknown
        }
    }

    return quizPuzzlePart.randomize
        ? getRandomPuzzlePartValue(quizPuzzlePart.possibleValues, previousPuzzlePart.index)
        : getNextPuzzlePartValue(quizPuzzlePart.possibleValues, previousPuzzlePart.index)
}

function getRandomPuzzlePartValue(possibleNumbersArray: Array<number>, previousPuzzlePartIndex: number): PuzzlePart {
    const randomIndex = getRandomNumber(
        possibleNumbersArray.length,
        previousPuzzlePartIndex
    )

    return {
        index: randomIndex,
        generatedValue: possibleNumbersArray[randomIndex],
        userDefinedValue: undefined,
        isUnknown: undefined
    }

    function getRandomNumber(max: number, exclude: number) {
        // Adapted from https://stackoverflow.com/a/34184614
        var rnd = Math.floor(Math.random() * (max - 1))
        if (rnd >= exclude) rnd++

        return rnd
    }
}

function getNextPuzzlePartValue(possibleNumbersArray: Array<number>, previousPuzzlePartIndex: number): PuzzlePart {
    if (shouldReturnMinValue()) {
        return {
            index: 0,
            generatedValue: possibleNumbersArray[0],
            userDefinedValue: undefined,
            isUnknown: undefined
        }
    }

    return {
        index: previousPuzzlePartIndex + 1,
        generatedValue:
            possibleNumbersArray[previousPuzzlePartIndex + 1],
        userDefinedValue: undefined,
        isUnknown: undefined
    }

    function shouldReturnMinValue() {
        return (
            previousPuzzlePartIndex === undefined ||
            previousPuzzlePartIndex ===
            possibleNumbersArray.length - 1
        )
    }
}

function getAnswer(
    partOne: number,
    partTwo: number,
    activeOperator: Operator,
    isUnknown: boolean): PuzzlePart {
    return {
        index: 0,
        generatedValue: getResult(),
        userDefinedValue: undefined,
        isUnknown: isUnknown
    }

    function getResult(): number {
        switch (activeOperator) {
            case Operator.Addition:
                return partOne + partTwo
            case Operator.Subtraction:
                partOne - partTwo
            case Operator.Multiplication:
                partOne * partTwo
            case Operator.Division:
                partOne / partTwo
        }
    }
}