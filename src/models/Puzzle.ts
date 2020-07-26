import type { Operator } from "./enums/Operator";
import type { PuzzlePart } from "./PuzzlePart";

export type Puzzle = {
    partOne: PuzzlePart;
    partTwo: PuzzlePart;
    answer: PuzzlePart;
    timeout: boolean;
    duration: number;
    isCorrect: boolean | undefined;
    operator: Operator;
    unknownPuzzlePartNumber: number;
}