import type { Operator } from "./enums/Operator";
import type { PuzzleMode } from "./enums/PuzzleMode";
import type { QuizPuzzlePartSettings } from "./QuizPuzzlePartSettings";
import type { QuizState } from "./enums/QuizState";

export type Quiz = {
    duration: number;
    puzzleTimeLimit: number;
    partSettings: QuizPuzzlePartSettings[];
    state: QuizState
    selectedOperator: Operator;
    allowNegativeAnswer: boolean;
    puzzleMode: PuzzleMode;
}
