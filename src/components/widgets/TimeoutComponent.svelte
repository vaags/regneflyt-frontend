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
    let timeout: number
    let fadeTimeout: number
    let interval: number
    let remainingSeconds: number
    let remainingMilliseconds: number
    let transparentText: boolean = false

    $: if (state && internalState !== state) {
        switch (state) {
            case TimerState.Started:
                start(undefined)
                break
            case TimerState.Paused:
                pause()
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

        timeout = setTimeout(
            finished,
            resumeMilliseconds ? resumeMilliseconds : seconds * 1000
        )
        interval = setInterval(() => {
            remainingMilliseconds -= 100
            console.log(remainingMilliseconds)
            if (
                remainingSeconds > 1 &&
                (remainingMilliseconds / 1000) % 1 === 0
            ) {
                remainingSeconds-- // Should not display zero
                if (fadeOnSecondChange) fadeOut()
                dispatch('secondChange', { remainingSeconds })
            }
        }, 100)

        console.log('start')
    }

    function pause() {
        clearTickers()
        console.log('pause')
    }

    function resume() {
        start(remainingMilliseconds)
        console.log('resume')
    }

    function stop() {
        clearTickers()
        console.log('stop')
    }

    function finished() {
        clearTickers()
        dispatch('finished')
        console.log('finished')
    }

    function fadeOut() {
        transparentText = false
        clearTimeout(fadeTimeout)
        fadeTimeout = setTimeout(() => {
            transparentText = true
        }, 500)
    }

    function clearTickers() {
        clearInterval(interval)
        clearTimeout(timeout)
        clearTimeout(fadeTimeout)
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
