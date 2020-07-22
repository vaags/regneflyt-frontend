import { Operator } from "./Operator";
import { PuzzlePart } from "./PuzzlePart";

export class Puzzle {
    partOne: PuzzlePart;
    partTwo: PuzzlePart;
    answer: PuzzlePart;
    timeout: boolean;
    duration: number;
    isCorrect: boolean;
    operator: Operator;
    unknownPuzzlePart: number;
}