import type { Operator } from "./enums/Operator";
import type { PuzzleMode } from "./enums/PuzzleMode";

export type AppSettings = {
    isLocalhost: boolean;
    transitionDuration: {
        duration: number
    },
    operators: Operator[],
    puzzleModes: PuzzleMode[],
    displayGreeting: boolean
}