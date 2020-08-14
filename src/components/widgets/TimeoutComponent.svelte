<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { TimerState } from '../../models/enums/TimerState'
    import TimeComponent from './TimeComponent.svelte'

    export let seconds: number
    export let state: TimerState = TimerState.Started
    export let fadeOnSecondChange: boolean = false
    export let showMinutes: boolean = false
    export let showProgressBar: boolean = false
    export let hidden: boolean = false

    const percentageTweened = tweened(0, {
        duration: 100,
    })

    const dispatch = createEventDispatcher()
    let internalState: TimerState = TimerState.Initialized
    let tickerHandles: number[] = [2]
    const milliseconds = seconds * 1000
    let remainingSeconds: number = seconds
    let remainingMilliseconds: number
    let transparentText: boolean = false
    let percentageCompleted: number = 0
    const transitionDelayCompensation = 100

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

        percentageCompleted = (100 / milliseconds) * 100 // Must be 100 ms ahead of actual time left, to account for transition time.
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
            percentageCompleted =
                ((milliseconds -
                    (remainingMilliseconds - transitionDelayCompensation)) /
                    milliseconds) *
                100

            if (remainingMilliseconds % 1000 === 0) {
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
        percentageCompleted = 100
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

    $: percentageTweened.set(percentageCompleted)
</script>

{#if !hidden && internalState}
    <span
        class="{fadeOnSecondChange ? 'transition duration-1000 ease-out' : ''}
        {transparentText ? 'opacity-0' : ''}">
        {#if showMinutes}
            <TimeComponent seconds="{remainingSeconds}" />
        {:else if showProgressBar}
            <div class="w-full">
                <div class="w-full bg-white border rounded border-gray-500">
                    <div
                        class="transition-colors text-base text-white
                        duration-200 {percentageCompleted === 100 ? 'bg-blue-800' : 'bg-blue-500'}
                        text-center leading-none"
                        style="width: {$percentageTweened}%">
                        <slot />
                    </div>
                </div>
            </div>
        {:else}{remainingSeconds}{/if}
    </span>
{/if}
