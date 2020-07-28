import type { Operator } from "./enums/Operator";
import type { QuizPuzzlePart } from "./QuizPuzzlePart";

export type QuizPuzzlePartSettings = {
    operator: Operator,
    partOne: QuizPuzzlePart,
    partTwo: QuizPuzzlePart
}