import type { Operator } from "./enums/Operator";
import type { PuzzlePart } from "./PuzzlePart";

export type Puzzle = {
    parts: Array<PuzzlePart>;
    timeout: boolean;
    duration: number;
    isCorrect: boolean | undefined;
    operator: Operator;
    unknownPuzzlePartNumber: number;
}