import { Quiz } from "../models/Quiz";
import { Operator } from "../models/Operator";
import { Puzzle } from "../models/Puzzle";
import { PuzzlePart } from "../models/PuzzlePart";
import { QuizPuzzlePart } from "../models/QuizPuzzlePart";
import { AnswerMode } from "../models/AnswerMode";

export function getPuzzle(quiz: Quiz, previousPuzzle: Puzzle) {

    const puzzle: Puzzle = {
        partOne: undefined,
        partTwo: undefined,
        answer: undefined,
        timeout: undefined,
        duration: undefined,
        isCorrect: undefined,
        operator: getActiveOperator(quiz.selectedOperator, quiz.operators),
        unknownPuzzlePartNumber: undefined
    }

    puzzle.unknownPuzzlePartNumber = getUnknownPuzzlePartNumber(puzzle.operator, quiz.answerMode)

    puzzle.partOne = getPuzzlePart(quiz.partOne, previousPuzzle.partOne, puzzle.unknownPuzzlePartNumber === 1)
    puzzle.partTwo = getPuzzlePart(quiz.partTwo, previousPuzzle.partTwo, puzzle.unknownPuzzlePartNumber === 2)

    if (shouldAvoidNegativeAnswer()) swapPuzzlePartValues()

    puzzle.answer = getAnswerPart(puzzle.partOne.generatedValue, puzzle.partTwo.generatedValue, puzzle.operator, puzzle.unknownPuzzlePartNumber === 3)

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

function getActiveOperator(selectedOperator: Operator, operators: Array<Operator>) {
    if (selectedOperator === Operator.All) {
        const random = Math.ceil(Math.random() * 4)

        return operators[random - 1]
    }

    return selectedOperator
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