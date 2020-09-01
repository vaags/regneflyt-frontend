import type { Quiz } from "../models/Quiz"
import { Operator } from "../models/enums/Operator"
import { PuzzleMode } from "../models/enums/PuzzleMode";
import { QuizState } from "../models/enums/QuizState";

const urlParams = new URLSearchParams(window.location.search)

export function getQuiz(): Quiz {
    return {
        title: urlParams.get('title') || undefined,
        showSettings: getBoolParam('showSettings'),
        duration: getFloatParam('duration') || 0.5,
        puzzleTimeLimit: getIntParam('timeLimit') || 3,
        operatorSettings: [
            {
                operator: Operator.Addition,
                minValue: getIntParam('addMin') || 0,
                maxValue: getIntParam('addMax') || 19,
                possibleValues: [],
                score: 0
            },
            {
                operator: Operator.Subtraction,
                minValue: getIntParam('subMin') || 0,
                maxValue: getIntParam('subMax') || 19,
                possibleValues: [],
                score: 0
            },
            {
                operator: Operator.Multiplication,
                minValue: 0,
                maxValue: 0,
                possibleValues: getNumArrayParam('mulValues') || [7],
                score: 0
            },
            {
                operator: Operator.Division,
                minValue: 0,
                maxValue: 0,
                possibleValues: getNumArrayParam('divValues') || [5],
                score: 0
            },
        ],
        state: QuizState.Initial,
        selectedOperator:
            (getIntParam('operator') as Operator) || Operator.Addition,
        allowNegativeAnswer: getBoolParam('negatives'),
        puzzleMode:
            (getIntParam('puzzleMode') as PuzzleMode) || PuzzleMode.Normal
    }
}

export function setUrlParams(quiz: Quiz) {
    let parameters = {
        duration: quiz.duration.toString(),
        timeLimit: quiz.puzzleTimeLimit.toString(),
        operator: quiz.selectedOperator.toString(),
        negatives: quiz.allowNegativeAnswer.toString(),
        addMin: quiz.operatorSettings[Operator.Addition].minValue?.toString(),
        addMax: quiz.operatorSettings[Operator.Addition].maxValue?.toString(),
        subMin: quiz.operatorSettings[Operator.Subtraction].minValue?.toString(),
        subMax: quiz.operatorSettings[Operator.Subtraction].maxValue?.toString(),
        mulValues:
            quiz.operatorSettings[Operator.Multiplication].possibleValues?.toString() ||
            '',
        divValues:
            quiz.operatorSettings[3].possibleValues?.toString() ||
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

function getFloatParam(param: string): number {
    let value = urlParams.get(param)

    return value ? parseFloat(value) : 0
}

function getBoolParam(param: string): boolean {
    return urlParams.get(param) === 'false' ? false : true
}

function getNumArrayParam(param: string): Array<number> | undefined {
    var array = urlParams.get(param)

    return array && array !== 'null' ? array.split(',').map(Number) : undefined
}