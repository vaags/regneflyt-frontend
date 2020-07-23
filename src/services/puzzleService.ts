import { Quiz } from "../models/Quiz";
import { Operator } from "../models/Operator";
import { Puzzle } from "../models/Puzzle";
import { PuzzlePart } from "../models/PuzzlePart";
import { QuizPuzzlePart } from "../models/QuizPuzzlePart";
import { AnswerMode } from "../models/AnswerMode";

export function getPuzzle(quiz: Quiz, previousPuzzle: Puzzle | undefined) {

    const puzzle: Puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: quiz.selectedOperator,
        unknownPuzzlePartNumber: getUnknownPuzzlePartNumber(quiz.selectedOperator, quiz.answerMode)
    }

    if (!previousPuzzle) InitializeQuizValues(quiz)

    puzzle.partOne = getPuzzlePart(quiz.partOne, previousPuzzle?.partOne, puzzle.unknownPuzzlePartNumber === 1)
    puzzle.partTwo = getPuzzlePart(quiz.partTwo, previousPuzzle?.partTwo, puzzle.unknownPuzzlePartNumber === 2)

    if (puzzle.operator === Operator.Division) {
        puzzle.partOne.generatedValue = puzzle.partOne.generatedValue * puzzle.partTwo.generatedValue
    } else if (shouldAvoidNegativeAnswer()) {
        swapPuzzlePartValues()
    }

    puzzle.answer = getAnswerPart(puzzle.partOne.generatedValue, puzzle.partTwo.generatedValue, puzzle.operator, puzzle.unknownPuzzlePartNumber === 3)

    // console.log('puzzle', puzzle)

    return puzzle;

    function shouldAvoidNegativeAnswer() {
        return (
            !quiz.allowNegativeAnswer &&
            puzzle.operator === Operator.Subtraction &&
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
            isUnknown
        }
    }

    return quizPuzzlePart.randomize
        ? getRandomPuzzlePartValue(quizPuzzlePart.possibleValues, previousPuzzlePart?.index, isUnknown)
        : getNextPuzzlePartValue(quizPuzzlePart.possibleValues, previousPuzzlePart?.index, isUnknown)
}

function getRandomPuzzlePartValue(possibleNumbersArray: Array<number>, previousPuzzlePartIndex: number | undefined, isUnknown: boolean): PuzzlePart {
    const randomIndex = getRandomNumber(
        possibleNumbersArray.length,
        previousPuzzlePartIndex
    )

    return {
        index: randomIndex,
        generatedValue: possibleNumbersArray[randomIndex],
        userDefinedValue: undefined,
        isUnknown
    }

    function getRandomNumber(max: number, exclude: number | undefined) {
        // Adapted from https://stackoverflow.com/a/34184614
        var rnd = Math.floor(Math.random() * (exclude === undefined ? max : max - 1))
        if (exclude !== undefined && rnd >= exclude) rnd++

        return rnd
    }
}

function getNextPuzzlePartValue(possibleNumbersArray: Array<number>, previousPuzzlePartIndex: number, isUnknown: boolean): PuzzlePart {
    console.log('gettting nex puzzle value')
    if (shouldReturnMinValue()) {
        return {
            index: 0,
            generatedValue: possibleNumbersArray[0],
            userDefinedValue: undefined,
            isUnknown
        }
    }

    return {
        index: previousPuzzlePartIndex + 1,
        generatedValue:
            possibleNumbersArray[previousPuzzlePartIndex + 1],
        userDefinedValue: undefined,
        isUnknown
    }

    function shouldReturnMinValue() {
        return (
            previousPuzzlePartIndex === undefined ||
            previousPuzzlePartIndex ===
            possibleNumbersArray.length - 1
        )
    }
}

function getAnswerPart(
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
                return partOne - partTwo
            case Operator.Multiplication:
                return partOne * partTwo
            case Operator.Division:
                return partOne / partTwo
        }
    }
}

function getUnknownPuzzlePartNumber(operator: Operator, answerMode: AnswerMode) {
    switch (answerMode) {
        case AnswerMode.Random:
            if (getTrueOrFalse()) {
                return getAlternateUnknownPuzzlePart()
            } else {
                return 3
            }
        case AnswerMode.Alternate: {
            return getAlternateUnknownPuzzlePart()
        }
        case AnswerMode.Normal: {
            return 3
        }
    }

    function getAlternateUnknownPuzzlePart() {
        switch (operator) {
            case Operator.Addition || Operator.Subtraction:
                return getTrueOrFalse() ? 1 : 2
            case Operator.Multiplication:
                return 2
            case Operator.Division:
                return 1
        }
    }

    function getTrueOrFalse() {
        // Stolen from https://stackoverflow.com/a/36756480
        return Math.random() >= 0.5
    }
}

function InitializeQuizValues(quiz: Quiz) {
    if (quiz.selectedOperator === Operator.Multiplication) {
        quiz.partTwo.possibleValues = getArrayOfNumbers(
            quiz.partTwo.minValue,
            quiz.partTwo.maxValue
        )
        quiz.partOne.minValue = quiz.partOne.possibleValues[0]
        quiz.partOne.maxValue =
            quiz.partOne.possibleValues[
            quiz.partOne.possibleValues.length - 1
            ]
    } else if (quiz.selectedOperator === Operator.Division) {
        quiz.partOne.possibleValues = getArrayOfNumbers(
            quiz.partOne.minValue,
            quiz.partOne.maxValue
        )
        quiz.partTwo.minValue = quiz.partTwo.possibleValues[0]
        quiz.partTwo.maxValue =
            quiz.partTwo.possibleValues[
            quiz.partTwo.possibleValues.length - 1
            ]
    } else {
        quiz.partOne.possibleValues = getArrayOfNumbers(
            quiz.partOne.minValue,
            quiz.partOne.maxValue
        )
        quiz.partTwo.possibleValues = getArrayOfNumbers(
            quiz.partTwo.minValue,
            quiz.partTwo.maxValue
        )
    }

    function getArrayOfNumbers(first: number, last: number): Array<number> {
        return Array(last)
            .fill(first)
            .map((x, y) => x + y)
    }
}