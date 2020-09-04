import type { OperatorSettings } from "../models/OperatorSettings";
import { Operator } from "../models/enums/Operator";
import { PuzzleMode } from "../models/enums/PuzzleMode";
import type { Quiz } from "../models/Quiz";
import type { QuizScores } from "../models/QuizScores";
import type { Puzzle } from "../models/Puzzle";

export function getQuizScoreSum(quiz: Quiz, puzzleSet: Puzzle[]): QuizScores {
    let quizScores: QuizScores = {
        totalScore: 0,
        correctAnswerCount: 0,
        correctAnswerPercentage: 0
    }

    if (!puzzleSet || !puzzleSet.length) return quizScores

    const scoreSettings = getOperatorScoreSettings(quiz)

    const boolReducer = (accumulator: any, currentValue: any) =>
        accumulator + (currentValue ? 1 : 0)

    quizScores.totalScore = puzzleSet
        .map((p) => getPuzzleScore(p, scoreSettings))
        .reduce((a, b) => a + b)

    quizScores.correctAnswerCount = puzzleSet.map((p) => p.isCorrect).reduce(boolReducer)

    quizScores.correctAnswerPercentage = Math.round(
        (quizScores.correctAnswerCount / puzzleSet.length) * 100
    )

    return quizScores
}

function getPuzzleScore(puzzle: Puzzle, scoreSettings: OperatorSettings[]) {
    const operatorScore = scoreSettings[puzzle.operator].score

    if (puzzle.isCorrect)
        return puzzle.duration < 3 ? operatorScore * 2 : operatorScore

    return operatorScore * -1
}

export function getOperatorScoreSettings(quiz: Quiz): OperatorSettings[] {
    const puzzleModeMultiplier = getPuzzleModeMultiplier(quiz.puzzleMode)
    const allOperatorsMultiplier = quiz.selectedOperator === Operator.All ? 1.5 : 1

    quiz.operatorSettings.forEach(e => {
        e.score = getOperatorScore(e) * puzzleModeMultiplier * allOperatorsMultiplier
    });

    return quiz.operatorSettings
}

function getOperatorScore(settings: OperatorSettings): number {
    switch (settings.operator) {
        case Operator.Addition:
        case Operator.Subtraction:
            return Math.round((settings.maxValue - settings.minValue) * settings.maxValue / 10)
        case Operator.Multiplication:
        case Operator.Division:
            return getMultiplicationTableScore(settings.possibleValues) * settings.possibleValues.length
        default:
            throw ('Cannot get score: Operator not recognized')
    }
}

function getPuzzleModeMultiplier(puzzleMode: PuzzleMode) {
    switch (puzzleMode) {
        case PuzzleMode.Normal:
            return 1
        case PuzzleMode.Alternate:
            return 1.5
        case PuzzleMode.Random:
            return 2
        default:
            throw ('Cannot get puzzleMode multiplier: PuzzleMode not recognized')
    }
}

function getMultiplicationTableScore(multipliers: number[]): number {
    return multipliers
        .map(m => multiplicationScoreTable[m - 1])
        .reduce((a, b) => a + b)
}

const multiplicationScoreTable = [
    10, // 1
    20, // 2
    30, // 3
    30, // 4
    20, // 5
    40, // 6
    50, // 7
    50, // 8
    40, // 9
    10, // 10
    20, // 11
    60  // 12
]