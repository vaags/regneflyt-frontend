import type { Operator } from "./enums/Operator";
import type { QuizPuzzlePart } from "./QuizPuzzlePart";
import type { AnswerMode } from "./enums/AnswerMode";

export type Quiz = {
    duration: number;
    puzzleTimeLimit: number;
    countDownTime: number;
    partOne: QuizPuzzlePart;
    partTwo: QuizPuzzlePart;
    isAboutToStart: boolean;
    isStarted: boolean;
    isCompleted: boolean;
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    operators: Array<Operator>;
    answerMode: AnswerMode;
    showRemainingTime: boolean;
}