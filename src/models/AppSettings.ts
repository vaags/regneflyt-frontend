export type AppSettings = {
    isProduction: boolean
    transitionDuration: {
        duration: number
    },
    operatorLabels: string[],
    operatorSigns: string[],
    displayGreeting: boolean,
}