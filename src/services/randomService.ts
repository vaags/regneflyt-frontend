import { AleaState, mkAlea, restoreAlea } from '@spissvinkel/alea'

export function getRandomNumber(
    min?: number,
    max?: number,
    seed?: string,
    state?: AleaState,
    exclude?: number
): RandomNumber {
    if (seed === undefined) seed = Date.now().toString()

    const { random, getState } = state ? restoreAlea(state) : mkAlea(seed)

    let rnd: number

    if (min !== undefined && max !== undefined) {
        if (min >= max) throw 'Minimum must be smaller than maximum'

        // Adapted from https://stackoverflow.com/a/34184614
        rnd = Math.floor(
            min + random() * ((exclude === undefined ? max + 1 : max) - min + 1)
        )
        if (exclude !== undefined && rnd >= exclude) rnd++
    } else {
        rnd = random()
    }

    return {
        value: rnd,
        state: getState(),
        seed: seed,
    }
}

export type RandomNumber = {
    value: number
    state: AleaState
    seed: string
}
