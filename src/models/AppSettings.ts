export type AppSettings = {
    isProduction: boolean
    separatorPageDuration: number
    puzzleTimeLimitDuration: number
    transitionDuration: {
        duration: number
    }
    pageTransitionDuration: {
        duration: number
    }
    operatorLabels: string[]
    operatorSigns: string[]
    menuFade: boolean
}
