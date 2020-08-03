<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { TimerState } from '../../models/enums/TimerState'
    import TimeComponent from './TimeComponent.svelte'

    export let seconds: number
    export let state: TimerState = TimerState.Started
    export let fadeOnSecondChange: boolean = false
    export let showMinutes: boolean = false
    export let invisible: boolean = false

    const dispatch = createEventDispatcher()
    let internalState: TimerState = TimerState.Initialized
    let tickerHandles: number[] = [2]
    let remainingSeconds: number
    let remainingMilliseconds: number
    let transparentText: boolean = false

    $: if (state && internalState !== state) {
        switch (state) {
            case TimerState.Started:
                start(undefined)
                break
            case TimerState.Resumed:
                resume()
                break
            case TimerState.Stopped:
                stop()
                break
        }
        internalState = state
    }

    function start(resumeMilliseconds: number | undefined) {
        clearTickers()
        remainingSeconds = resumeMilliseconds
            ? Math.round(resumeMilliseconds / 1000)
            : seconds
        remainingMilliseconds = resumeMilliseconds
            ? resumeMilliseconds
            : seconds * 1000

        tickerHandles[0] = setTimeout(
            finished,
            resumeMilliseconds ? resumeMilliseconds : seconds * 1000
        )

        tickerHandles[1] = setInterval(() => {
            remainingMilliseconds -= 100
            if (remainingSeconds > 1 && remainingMilliseconds % 1000 === 0) {
                remainingSeconds-- // Should not display zero
                if (fadeOnSecondChange) fadeOut()
                dispatch('secondChange', { remainingSeconds })
            }
        }, 100)
    }

    function resume() {
        start(remainingMilliseconds)
    }

    function stop() {
        clearTickers()
    }

    function finished() {
        clearTickers()
        dispatch('finished')
    }

    function fadeOut() {
        transparentText = false
        clearTimeout(tickerHandles[3])
        tickerHandles[2] = setTimeout(() => {
            transparentText = true
        }, 500)
    }

    function clearTickers() {
        tickerHandles.forEach((element) => {
            clearInterval(element)
            clearTimeout(element)
        })
    }

    onMount(() => {
        if (fadeOnSecondChange) fadeOut()
    })

    onDestroy(() => {
        clearTickers()
    })
</script>

{#if !invisible && internalState}
    <span
        class="{fadeOnSecondChange ? 'transition duration-1000 ease-out' : ''}
        {transparentText ? 'opacity-0' : ''}">
        {#if showMinutes}
            <TimeComponent seconds="{remainingSeconds}" />
        {:else}{remainingSeconds}{/if}
    </span>
{/if}
