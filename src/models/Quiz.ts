import { PuzzlePart } from "./PuzzlePart";
import { Operator } from "./Operator";

export class Quiz {
    duration: number;
    puzzleTimeLimit: number;
    partOne: PuzzlePart;
    partTwo: PuzzlePart;
    isStarted: boolean;
    isCompleted: boolean;
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    activeOperator: Operator;
    operators: Array<Operator>;
}