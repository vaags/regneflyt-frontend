import { Operator } from "./Operator";

export class Puzzle {
    partOne: PuzzlePart;
    partTwo: PuzzlePart;
    answer: number;
    timeout: boolean;
    duration: number;
    isCorrect: boolean;
    operator: Operator
}

export class PuzzlePart {
    index: number;
    value: number
}