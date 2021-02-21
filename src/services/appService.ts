import type { AppSettings } from '../models/AppSettings'

export function getAppSettings(isProduction: string): AppSettings {
    const isProductionBool = isProduction === 'true'

    return {
        isProduction: isProductionBool,
        separatorPageDuration: isProductionBool ? 3 : 1,
        puzzleTimeLimitDuration: 3,
        transitionDuration: {
            duration: 200,
        },
        pageTransitionDuration: {
            duration: 100,
        },
        operatorLabels: [
            'Addisjon',
            'Subtraksjon',
            'Multiplikasjon',
            'Divisjon',
            'Alle regnearter',
        ],
        operatorSigns: ['&#43;', '&#8722;', '&#215;', '&#247;', '&#8704'],
        menuFade: false,
    }
}
