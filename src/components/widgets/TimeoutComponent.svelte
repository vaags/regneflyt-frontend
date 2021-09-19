<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { tweened } from 'svelte/motion'
    import { TimerState } from '../../models/constants/TimerState'
    import TimeComponent from './TimeComponent.svelte'

    export let seconds: number
    export let state: TimerState = TimerState.Started
    export let fadeOnSecondChange: boolean = false
    export let showMinutes: boolean = false
    export let showProgressBar: boolean = false
    export let hidden: boolean = false
    export let countToZero: boolean = true

    const millisecondIntervalDuration = 100
    const percentageTweened = tweened(0, {
        duration: millisecondIntervalDuration,
    })

    const dispatch = createEventDispatcher()
    let internalState: TimerState = TimerState.Initialized
    let timeoutHandler: number // Used to keep track of total time left
    let millisecondsIntervalHandler: number // Used to update progress bar and "seconds left"-indicator on set intervals
    let secondsIntervalHandler: number // Used to update progress bar and "seconds left"-indicator on set intervals
    let secondIntervalDelayHandler: number
    let millisecondIntervalDelayHandler: number
    const milliseconds = seconds * 1000
    let remainingSeconds = seconds
    let remainingMilliseconds: number
    let transparentText: boolean = false
    let percentageCompleted: number = 0
    let timestampStart: number
    let timestampStop: number
    const transitionDelayCompensation = millisecondIntervalDuration // Because of transition delay (tweening), internal time keeping must be 100 ms ahead of actual time left.

    $: if (state && internalState !== state) {
        switch (state) {
            case TimerState.Started:
                start(undefined)
                break
            case TimerState.Resumed:
                start(remainingMilliseconds)
                break
            case TimerState.Stopped:
                stop()
                break
        }
        internalState = state
    }

    function start(resumeMilliseconds: number | undefined) {
        timestampStart = Date.now()
        clearTimeHandlers()
        setInitialProgress()

        timeoutHandler = window.setTimeout(
            finished,
            resumeMilliseconds ? resumeMilliseconds : seconds * 1000
        )

        // Decrementers must be delayed to account for completion and pauses in-between seconds
        const secondDecrementDelay = remainingMilliseconds % 1000
        const millisecondDecrementDelay =
            remainingMilliseconds % millisecondIntervalDuration

        secondIntervalDelayHandler = window.setTimeout(() => {
            if (secondDecrementDelay > 0) decrementSecond()
            secondsIntervalHandler = window.setInterval(() => {
                decrementSecond()
            }, 1000)
        }, secondDecrementDelay)

        millisecondIntervalDelayHandler = window.setTimeout(() => {
            if (millisecondDecrementDelay > 0) decrementMillisecond()
            millisecondsIntervalHandler = window.setInterval(() => {
                decrementMillisecond()
            }, millisecondIntervalDuration)
        }, millisecondDecrementDelay)

        function decrementMillisecond() {
            remainingMilliseconds -= millisecondIntervalDuration
            percentageCompleted =
                ((milliseconds -
                    (remainingMilliseconds - transitionDelayCompensation)) /
                    milliseconds) *
                100
        }

        function decrementSecond() {
            remainingSeconds--
            if (fadeOnSecondChange) fadeOut()
            dispatch('secondChange', { remainingSeconds })
        }

        function setInitialProgress() {
            percentageCompleted =
                (100 / milliseconds) * transitionDelayCompensation

            remainingSeconds = resumeMilliseconds
                ? Math.floor(resumeMilliseconds / 1000)
                : countToZero
                ? seconds - 1
                : seconds

            remainingMilliseconds = resumeMilliseconds ?? milliseconds
        }
    }

    function stop() {
        timestampStop = Date.now()

        const millisecondRest =
            (timestampStop - timestampStart) % millisecondIntervalDuration
        remainingMilliseconds -= millisecondRest // Remove the time passed since the last millisecond decrement (for more accurate timing when resuming after pause)
        clearTimeHandlers()
    }

    function finished() {
        clearTimeHandlers()
        percentageCompleted = 100
        dispatch('finished')
    }

    function fadeOut() {
        transparentText = false
        setTimeout(() => {
            transparentText = true
        }, 500)
    }

    function clearTimeHandlers() {
        clearInterval(millisecondsIntervalHandler)
        clearInterval(secondsIntervalHandler)
        clearTimeout(secondIntervalDelayHandler)
        clearTimeout(timeoutHandler)
        clearTimeout(millisecondIntervalDelayHandler)
    }

    onMount(() => {
        if (fadeOnSecondChange) fadeOut()
    })

    onDestroy(() => {
        clearTimeHandlers()
    })

    $: percentageTweened.set(percentageCompleted)
</script>

{#if !hidden && internalState}
    <div
        class="{fadeOnSecondChange ? 'transition duration-1000 ease-out' : ''}
        {transparentText ? 'opacity-0' : ''}"
    >
        {#if showMinutes}
            <TimeComponent seconds="{remainingSeconds}" />
        {:else if showProgressBar}
            <div class="w-1/3 mx-auto">
                <div
                    class="w-full bg-white border rounded overflow-hidden border-gray-500"
                >
                    <div
                        class="transition-colors text-gray-50
                            duration-200 {percentageCompleted === 100
                            ? 'bg-red-600'
                            : 'bg-blue-400'}
                            text-center leading-none"
                        style="width: {$percentageTweened}%"
                    >
                        <slot />
                    </div>
                </div>
            </div>
        {:else}{remainingSeconds}{/if}
    </div>
{/if}
