import type { Operator } from "./enums/Operator";
import type { PuzzleMode } from "./enums/PuzzleMode";
import type { QuizPuzzlePartSettings } from "./QuizPuzzlePartSettings";

export type Quiz = {
    duration: number;
    puzzleTimeLimit: number;
    countDownTime: number;
    partSettings: Array<QuizPuzzlePartSettings>;
    isAboutToStart: boolean;
    isStarted: boolean;
    isCompleted: boolean;
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    operators: Array<Operator>;
    puzzleMode: PuzzleMode;
    showRemainingTime: boolean;
    isLocalhost: boolean;
}
