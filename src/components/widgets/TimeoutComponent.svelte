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

    const intervalDuration = 100
    const percentageTweened = tweened(0, {
        duration: intervalDuration,
    })

    const dispatch = createEventDispatcher()
    let internalState: TimerState = TimerState.Initialized
    let timeoutHandler: number // Used to keep track of total time left
    let millisecondsIntervalHandler: number // Used to update progress bar and "seconds left"-indicator on set intervals
    let secondsIntervalHandler: number // Used to update progress bar and "seconds left"-indicator on set intervals
    let secondIntervalDelayHandler: number
    const milliseconds = seconds * 1000
    let remainingSeconds = seconds
    let remainingMilliseconds: number
    let transparentText: boolean = false
    let percentageCompleted: number = 0
    const transitionDelayCompensation = intervalDuration // Because of transition delay (tweening), internal time keeping must be 100 ms ahead of actual time left.

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
        clearTimeHandlers()
        setInitialProgress()

        timeoutHandler = setTimeout(
            finished,
            resumeMilliseconds ? resumeMilliseconds : seconds * 1000
        )

        secondIntervalDelayHandler = setTimeout(() => {
            secondsIntervalHandler = setInterval(() => {
                remainingSeconds--
                if (fadeOnSecondChange) fadeOut()
                dispatch('secondChange', { remainingSeconds })
            }, 1000)
        }, remainingMilliseconds % 1000) // Must be delayed to account for completion and pauses in-between seconds

        millisecondsIntervalHandler = setInterval(() => {
            remainingMilliseconds -= intervalDuration
            percentageCompleted =
                ((milliseconds -
                    (remainingMilliseconds - transitionDelayCompensation)) /
                    milliseconds) *
                100
        }, intervalDuration)

        function setInitialProgress() {
            percentageCompleted =
                (100 / milliseconds) * transitionDelayCompensation

            remainingSeconds = resumeMilliseconds
                ? Math.round(resumeMilliseconds / 1000)
                : seconds

            remainingMilliseconds = resumeMilliseconds
                ? resumeMilliseconds
                : seconds * 1000
        }
    }

    function stop() {
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
