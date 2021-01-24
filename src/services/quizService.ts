import type { Quiz } from "../models/Quiz"
import { Operator } from "../models/constants/Operator"
import { PuzzleMode } from "../models/constants/PuzzleMode";
import { QuizState } from "../models/constants/QuizState";

const urlParams = new URLSearchParams(window.location.search)

export function getQuiz(): Quiz {
    return {
        title: getStringParam('title'),
        showSettings: getBoolParam('showSettings'),
        duration: getFloatParam('duration') || 0.5,
        puzzleTimeLimit: !!getIntParam('timeLimit'), // Saved as int for backward compatibility
        difficulty: undefined,
        operatorSettings: [
            {
                operator: Operator.Addition,
                range: {
                    min: getIntParam('addMin') || 0,
                    max: getIntParam('addMax') || 19,

                },
                possibleValues: [],
                score: 0
            },
            {
                operator: Operator.Subtraction,
                range: {
                    min: getIntParam('subMin') || 0,
                    max: getIntParam('subMax') || 19,
                },
                possibleValues: [],
                score: 0
            },
            {
                operator: Operator.Multiplication,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getNumArrayParam('mulValues') || [7],
                score: 0
            },
            {
                operator: Operator.Division,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getNumArrayParam('divValues') || [5],
                score: 0
            },
        ],
        state: QuizState.Initial,
        selectedOperator:
            (getIntParam('operator') as Operator) ?? undefined,
        allowNegativeAnswer: getBoolParam('negatives'),
        puzzleMode:
            (getIntParam('puzzleMode') as PuzzleMode) || PuzzleMode.Normal,
        previousScore: undefined
    }
}

export function setUrlParams(quiz: Quiz) {
    let parameters = {
        duration: quiz.duration.toString(),
        timeLimit: quiz.puzzleTimeLimit ? '3' : '0', // Saved as int for backward compatibility
        operator: quiz.selectedOperator?.toString() || '',
        negatives: quiz.allowNegativeAnswer.toString(),
        addMin: quiz.operatorSettings[Operator.Addition].range.min?.toString(),
        addMax: quiz.operatorSettings[Operator.Addition].range.max?.toString(),
        subMin: quiz.operatorSettings[Operator.Subtraction].range.min?.toString(),
        subMax: quiz.operatorSettings[Operator.Subtraction].range.max?.toString(),
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

function getIntParam(param: string): number | undefined {
    const value = urlParams.get(param)

    return value != null ? parseInt(value) : undefined
}

function getStringParam(param: string): string | undefined {
    const value = urlParams.get(param)

    return value && value !== 'undefined' ? value : undefined
}

function getFloatParam(param: string): number {
    const value = urlParams.get(param)

    return value ? parseFloat(value) : 0
}

function getBoolParam(param: string): boolean {
    return urlParams.get(param) === 'false' ? false : true
}

function getNumArrayParam(param: string): Array<number> | undefined {
    var array = urlParams.get(param)

    return array && array !== 'null' ? array.split(',').map(Number) : undefined
}