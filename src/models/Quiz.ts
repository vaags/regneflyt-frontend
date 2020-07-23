
import { Operator } from "./Operator";
import { QuizPuzzlePart } from "./QuizPuzzlePart";
import { AnswerMode } from "./AnswerMode";

export class Quiz {
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