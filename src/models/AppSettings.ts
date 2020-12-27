export type AppSettings = {
    isProduction: boolean
    transitionDuration: {
        duration: number
    },
    pageTransitionDuration: {
        duration: number
    }
    operatorLabels: string[],
    operatorSigns: string[],
    menuFade: boolean
}