
import { Operator } from "./Operator";
import { QuizPuzzlePart } from "./QuizPuzzlePart";

export class Quiz {
    duration: number;
    puzzleTimeLimit: number;
    partOne: QuizPuzzlePart;
    partTwo: QuizPuzzlePart;
    isStarted: boolean;
    isCompleted: boolean;
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    activeOperator: Operator;
    operators: Array<Operator>;
}