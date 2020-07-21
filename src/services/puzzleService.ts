import { Quiz } from "../models/Quiz";
import { Operator } from "../models/Operator";
import { Puzzle, PuzzlePart } from "../models/Puzzle";
import { QuizPuzzlePart } from "../models/QuizPuzzlePart";

export function getPuzzle(quiz: Quiz, previousPuzzle: Puzzle): Puzzle {
    const puzzle: Puzzle = {
        partOne: {
            index: undefined,
            value: undefined,
        },
        partTwo: {
            index: undefined,
            value: undefined,
        },
        answer: undefined,
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: undefined
    }

    puzzle.partOne = getPuzzlePart(quiz.partOne, previousPuzzle.partOne)
    puzzle.partTwo = getPuzzlePart(quiz.partTwo, previousPuzzle.partTwo)

    if (shouldAvoidNegativeAnswer()) swapPuzzlePartValues()

    return puzzle;

    function shouldAvoidNegativeAnswer() {
        return (
            !quiz.allowNegativeAnswer &&
            quiz.activeOperator === Operator.Subtraction &&
            puzzle.partTwo.value > puzzle.partOne.value
        )
    }

    function swapPuzzlePartValues() {
        [puzzle.partOne, puzzle.partTwo] = [puzzle.partTwo, puzzle.partOne]
    }
}

function getPuzzlePart(quizPuzzlePart: QuizPuzzlePart, previousPuzzlePart: PuzzlePart): PuzzlePart {
    if (quizPuzzlePart.minValue === quizPuzzlePart.maxValue) {
        return {
            index: 0,
            value: quizPuzzlePart.minValue,
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
        value: possibleNumbersArray[randomIndex],
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
            value: possibleNumbersArray[0],
        }
    }

    return {
        index: previousPuzzlePartIndex + 1,
        value:
        possibleNumbersArray[previousPuzzlePartIndex + 1],
    }

    function shouldReturnMinValue() {
        return (
            previousPuzzlePartIndex === undefined ||
            previousPuzzlePartIndex ===
            possibleNumbersArray.length - 1
        )
    }
}