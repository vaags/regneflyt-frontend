export const Operator = {
    Addition: 0,
    Subtraction: 1,
    Multiplication: 2,
    Division: 3
} as const

export type Operator = typeof Operator[keyof typeof Operator]