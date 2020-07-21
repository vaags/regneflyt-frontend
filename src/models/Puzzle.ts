export class Puzzle {
    partOne: PuzzlePart;
    partTwo: PuzzlePart;
    answer: number;
    timeout: boolean;
    duration: number;
    isCorrect: boolean;
}

interface PuzzlePart {
    index: number;
    value: number
}