import type { Operator } from "./enums/Operator";
import type { QuizPuzzlePart } from "./QuizPuzzlePart";
import type { AnswerMode } from "./enums/AnswerMode";

export type Quiz = {
    duration: number;
    puzzleTimeLimit: number;
    partOne: QuizPuzzlePart;
    partTwo: QuizPuzzlePart;
    isStarted: boolean;
    isCompleted: boolean;
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    operators: Array<Operator>;
    answerMode: AnswerMode;
}