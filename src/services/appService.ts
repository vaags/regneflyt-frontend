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

export function fakeInputFocus(fakeInput: any) {
    // Hack to get Safari / Ios to focus
    // create invisible dummy input to receive the focus first
    // Ref: https://stackoverflow.com/a/45703019
    if (!fakeInput) {
        fakeInput = document.createElement('input')
        fakeInput.setAttribute('type', 'number')
        fakeInput.style.position = 'absolute'
        fakeInput.style.opacity = '0'
        fakeInput.style.height = '0'
        fakeInput.style.fontSize = '16px' // disable auto zoom

        // you may need to append to another element depending on the browser's auto
        // zoom/scroll behavior
        document.body.prepend(fakeInput)
    }

    fakeInput.focus()
}
