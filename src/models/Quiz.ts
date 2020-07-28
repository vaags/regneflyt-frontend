import type { Operator } from "./enums/Operator";
import type { AnswerMode } from "./enums/AnswerMode";
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
    answerMode: AnswerMode;
    showRemainingTime: boolean;
    isLocalhost: boolean;
}
