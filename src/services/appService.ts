import type { AppSettings } from "../models/AppSettings";

export function getAppSettings(isProduction: string, apiEndpoint: string, apiKey: string): AppSettings {
    return {
        isProduction: isProduction === 'true',
        transitionDuration: {
            duration: 200,
        },
        operatorLabels: [
            'Addisjon',
            'Subtraksjon',
            'Multiplikasjon',
            'Divisjon',
            'Alle',
        ],
        operatorSigns: ['&#43;', '&#8722;', '&#215;', '&#247;', '&#8704'],
        displayGreeting: true,
        apiEndpoint: apiEndpoint,
        apiKey: apiKey,
        showHighscores: false,
    }
}

export function addAnalytics() {
    // Simple Web Analytics tracking code
    // https://simple-web-analytics.com/app
    if (
        !sessionStorage.getItem('_swa') &&
        document.referrer.indexOf(
            location.protocol + '//' + location.host
        ) !== 0
    ) {
        fetch(
            'https://simple-web-analytics.com/track?' +
            new URLSearchParams({
                referrer: document.referrer,
                screen: screen.width + 'x' + screen.height,
                site: 'regneflyt',
                utcoffset: '0',
            })
        )
    }
    sessionStorage.setItem('_swa', '1')
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