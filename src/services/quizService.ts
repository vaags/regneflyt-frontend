import type { Quiz } from "../models/Quiz"
import { Operator } from "../models/enums/Operator"
import { PuzzleMode } from "../models/enums/PuzzleMode";

const urlParams = new URLSearchParams(window.location.search)

export function getQuiz(): Quiz {
    return {
        isLocalhost: location.hostname === 'localhost',
        duration: getIntParam('duration') || 1,
        showRemainingTime: getBoolParam('showRemainingTime'),
        puzzleTimeLimit: getIntParam('timeLimit') || 0,
        partSettings: [
            {
                operator: Operator.Addition,
                partOne: {
                    minValue: getIntParam('addOneMin') || 1,
                    maxValue: getIntParam('addOneMax') || 20,
                    possibleValues: []
                },
                partTwo: {
                    minValue: getIntParam('addTwoMin') || 1,
                    maxValue: getIntParam('addTwoMax') || 20,
                    possibleValues: []
                }
            },
            {
                operator: Operator.Subtraction,
                partOne: {
                    minValue: getIntParam('subOneMin') || 1,
                    maxValue: getIntParam('subOneMax') || 20,
                    possibleValues: []
                },
                partTwo: {
                    minValue: getIntParam('subTwoMin') || 1,
                    maxValue: getIntParam('subTwoMax') || 20,
                    possibleValues: []
                }
            },
            {
                operator: Operator.Multiplication,
                partOne: {
                    minValue: 0,
                    maxValue: 0,
                    possibleValues: getNumArrayParam('mulOneValues') || [7]
                },
                partTwo: {
                    minValue: getIntParam('mulTwoMin') || 1,
                    maxValue: getIntParam('mulTwoMax') || 10,
                    possibleValues: []
                }
            },
            {
                operator: Operator.Division,
                partOne: {
                    minValue: getIntParam('divOneMin') || 2,
                    maxValue: getIntParam('divOneMax') || 20,
                    possibleValues: []
                },
                partTwo: {
                    minValue: 0,
                    maxValue: 0,
                    possibleValues: getNumArrayParam('divTwoValues') || [5]
                }
            },
        ],
        isStarted: false,
        isCompleted: false,
        isAboutToStart: false,
        countDownTime: 3,
        selectedOperator:
            (getIntParam('operator') as Operator) || Operator.Addition,
        allowNegativeAnswer: getBoolParam('negatives'),
        operators: [
            Operator.Addition,
            Operator.Subtraction,
            Operator.Multiplication,
            Operator.Division,
            Operator.All
        ],
        puzzleMode:
            (getIntParam('puzzleMode') as PuzzleMode) || PuzzleMode.Normal,
    }
}

export function setUrlParams(quiz: Quiz) {
    let parameters = {
        duration: quiz.duration.toString(),
        showRemainingTime: quiz.showRemainingTime.toString(),
        timeLimit: quiz.puzzleTimeLimit.toString(),
        operator: quiz.selectedOperator.toString(),
        negatives: quiz.allowNegativeAnswer.toString(),
        addOneMin: quiz.partSettings[Operator.Addition].partOne.minValue?.toString(),
        addOneMax: quiz.partSettings[Operator.Addition].partOne.maxValue?.toString(),
        addTwoMin: quiz.partSettings[Operator.Addition].partTwo.minValue?.toString(),
        addTwoMax: quiz.partSettings[Operator.Addition].partTwo.maxValue?.toString(),
        subOneMin: quiz.partSettings[Operator.Subtraction].partOne.minValue?.toString(),
        subOneMax: quiz.partSettings[Operator.Subtraction].partOne.maxValue?.toString(),
        subTwoMin: quiz.partSettings[Operator.Subtraction].partTwo.minValue?.toString(),
        subTwoMax: quiz.partSettings[Operator.Subtraction].partTwo.maxValue?.toString(),
        mulOneValues:
            quiz.partSettings[Operator.Multiplication].partOne.possibleValues?.toString() ||
            '',
        mulTwoMin: quiz.partSettings[Operator.Multiplication].partTwo.minValue?.toString(),
        mulTwoMax: quiz.partSettings[Operator.Multiplication].partTwo.maxValue?.toString(),
        divOneMin: quiz.partSettings[Operator.Division].partOne.minValue?.toString(),
        divOneMax: quiz.partSettings[Operator.Division].partOne.maxValue?.toString(),
        divTwoValues:
            quiz.partSettings[3].partTwo.possibleValues?.toString() ||
            '',
        puzzleMode: quiz.puzzleMode.toString(),
    }

    window.history.replaceState(
        null,
        '',
        `?${new URLSearchParams(parameters)}`
    )
}

function getIntParam(param: string): number {
    let value = urlParams.get(param)

    return value ? parseInt(value) : 0
}

function getBoolParam(param: string): boolean {
    return urlParams.get(param) === 'false' ? false : true
}

function getNumArrayParam(param: string): Array<number> | undefined {
    var array = urlParams.get(param)

    return array && array !== 'null' ? array.split(',').map(Number) : undefined
}