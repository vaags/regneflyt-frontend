import type { Quiz } from '../models/Quiz'
import { Operator } from '../models/constants/Operator'
import { PuzzleMode } from '../models/constants/PuzzleMode'
import { QuizState } from '../models/constants/QuizState'
import type { OperatorSettings } from '../models/OperatorSettings'
import type { NumberRange } from '../models/NumberRange'
import type { AppSettings } from '../models/AppSettings'

const urlParams = new URLSearchParams(window.location.search)
const customDifficultyId = 0

export function getQuiz(): Quiz {
    let showSettings = getBoolParam('showSettings')
    let difficulty = getIntParam('difficulty')

    if (!showSettings && !difficulty) {
        difficulty = customDifficultyId // For backwards compatibility. (Previously there was only custom difficulty.)
    }

    return {
        title: getStringParam('title'),
        showSettings: showSettings,
        duration: getFloatParam('duration') ?? 0.5,
        puzzleTimeLimit: !!getIntParam('timeLimit'), // Saved as int for backwards compatibility
        difficulty: difficulty,
        operatorSettings: [
            {
                operator: Operator.Addition,
                range: {
                    min: getIntParam('addMin') ?? 0,
                    max: getIntParam('addMax') ?? 19,
                },
                possibleValues: [],
                score: 0,
            },
            {
                operator: Operator.Subtraction,
                range: {
                    min: getIntParam('subMin') ?? 0,
                    max: getIntParam('subMax') ?? 19,
                },
                possibleValues: [],
                score: 0,
            },
            {
                operator: Operator.Multiplication,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getNumArrayParam('mulValues') ?? [7],
                score: 0,
            },
            {
                operator: Operator.Division,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getNumArrayParam('divValues') ?? [5],
                score: 0,
            },
        ],
        state: QuizState.Initial,
        selectedOperator: (getIntParam('operator') as Operator) ?? undefined,
        puzzleMode:
            (getIntParam('puzzleMode') as PuzzleMode) ?? PuzzleMode.Normal,
        previousScore: undefined,
    }
}

export function getQuizTitle(quiz: Quiz, appSettings: AppSettings): string {
    return (
        quiz.title ??
        `${appSettings.operatorLabels[quiz.selectedOperator as number]}: ${
            quiz.difficulty === customDifficultyId
                ? 'Egendefinert'
                : `Nivå ${quiz.difficulty}`
        }`
    )
}

export function getQuizDifficultySettings(
    quiz: Quiz,
    difficulty: number
): Quiz {
    quiz.difficulty = difficulty

    if (
        quiz.selectedOperator === undefined ||
        quiz.difficulty === customDifficultyId
    )
        return quiz

    quiz.puzzleMode =
        quiz.difficulty > 3 ? PuzzleMode.Random : PuzzleMode.Normal
    quiz.duration = quiz.difficulty > 2 ? 1 : 0.5
    quiz.puzzleTimeLimit = quiz.difficulty > 1

    Object.values(Operator).forEach((operator) => {
        quiz.operatorSettings[operator] = getOperatorSettings(
            quiz.difficulty || 0,
            operator
        )
    })

    return quiz
}

function getOperatorSettings(
    difficulty: number,
    operator: number | undefined
): OperatorSettings {
    switch (operator) {
        case Operator.Addition:
            return {
                operator: Operator.Addition,
                range: getAdditionRange(),
                possibleValues: [],
                score: 0,
            }
        case Operator.Subtraction:
            return {
                operator: Operator.Subtraction,
                range: getSubtractionRange(),
                possibleValues: [],
                score: 0,
            }
        case Operator.Multiplication:
            return {
                operator: Operator.Multiplication,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getPossibleValues(),
                score: 0,
            }
        case Operator.Division:
            return {
                operator: Operator.Division,
                range: {
                    min: 0,
                    max: 0,
                },
                possibleValues: getPossibleValues(),
                score: 0,
            }
        default:
            throw 'Cannot recognize operator'
    }

    function getAdditionRange(): NumberRange {
        switch (difficulty) {
            case 1:
                return {
                    min: 1,
                    max: 10,
                }
            case 2:
                return {
                    min: 1,
                    max: 20,
                }
            case 3:
                return {
                    min: 10,
                    max: 30,
                }
            case 4:
                return {
                    min: 20,
                    max: 40,
                }
            case 5:
                return {
                    min: 30,
                    max: 70,
                }
            case 6:
                return {
                    min: 50,
                    max: 100,
                }
            default:
                throw 'Invalid difficulty provided'
        }
    }

    function getSubtractionRange(): NumberRange {
        switch (difficulty) {
            case 1:
                return {
                    min: 1,
                    max: 10,
                }
            case 2:
                return {
                    min: 10,
                    max: 20,
                }
            case 3:
                return {
                    min: 20,
                    max: 30,
                }
            case 4:
                return {
                    min: 20,
                    max: 40,
                }
            case 5:
                return {
                    min: 20,
                    max: 50,
                }
            case 6:
                return {
                    min: -20,
                    max: 50,
                }
            default:
                throw 'Invalid difficulty provided'
        }
    }

    function getPossibleValues(): number[] {
        switch (difficulty) {
            case 1:
                return [1, 2]
            case 2:
                return [3, 5]
            case 3:
                return [6, 4, 10]
            case 4:
                return [7, 9, 11]
            case 5:
                return [12, 8, 6]
            case 6:
                return [12, 8, 7, 9]
            default:
                throw 'Invalid difficulty provided'
        }
    }
}

export function setUrlParams(quiz: Quiz) {
    let parameters = {
        duration: quiz.duration.toString(),
        timeLimit: quiz.puzzleTimeLimit ? '3' : '0', // Saved as int for backward compatibility
        operator: quiz.selectedOperator?.toString() ?? '',
        addMin: quiz.operatorSettings[Operator.Addition].range.min?.toString(),
        addMax: quiz.operatorSettings[Operator.Addition].range.max?.toString(),
        subMin: quiz.operatorSettings[
            Operator.Subtraction
        ].range.min?.toString(),
        subMax: quiz.operatorSettings[
            Operator.Subtraction
        ].range.max?.toString(),
        mulValues:
            quiz.operatorSettings[
                Operator.Multiplication
            ].possibleValues?.toString() ?? '',
        divValues: quiz.operatorSettings[3].possibleValues?.toString() ?? '',
        puzzleMode: quiz.puzzleMode.toString(),
        difficulty: quiz.difficulty?.toString() ?? '',
    }

    window.history.replaceState(null, '', `?${new URLSearchParams(parameters)}`)
}

function getIntParam(param: string): number | undefined {
    const value = urlParams.get(param)

    return value != undefined ? parseInt(value) : undefined
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
