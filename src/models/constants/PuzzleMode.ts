export const PuzzleMode = {
    Normal: 0,
    Alternate: 1,
    Random: 2
} as const

export type PuzzleMode = typeof PuzzleMode[keyof typeof PuzzleMode]