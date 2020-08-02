<script lang="ts">
    import { onDestroy, onMount, createEventDispatcher } from 'svelte'
    import { TimerState } from '../../models/enums/TimerState'
    import TimeComponent from './TimeComponent.svelte'

    export let seconds: number
    export let state: TimerState = TimerState.Started
    export let fadeOnSecondChange: boolean = false
    export let showMinutes: boolean = false

    const dispatch = createEventDispatcher()
    let internalState: TimerState = TimerState.Initialized
    let timeout: number
    let fadeTimeout: number
    let interval: number
    let secondsLeft: number
    let invisible: boolean = false
    let transparentText: boolean = false

    $: if (internalState !== TimerState.Finished && internalState !== state) {
        switch (state) {
            case TimerState.Started:
                start()
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
    }

    function start() {
        secondsLeft = seconds

        timeout = setTimeout(finished, seconds * 1000)
        interval = setInterval(() => {
            if (secondsLeft > 1) {
                secondsLeft-- // Should not display zero
                if (fadeOnSecondChange) fadeOut()
                dispatch('secondChange', { secondsLeft })
                console.log('seconds left:', secondsLeft)
            }
        }, 1000)

        internalState = TimerState.Started
        console.log('start')
    }

    function pause() {
        internalState = TimerState.Paused
        console.log('pause')
    }

    function resume() {
        internalState = TimerState.Resumed
        console.log('resume')
    }

    function stop() {
        internalState = TimerState.Stopped
        console.log('stop')
    }

    function finished() {
        clearInterval(interval)
        clearTimeout(timeout)
        dispatch('finished')
        internalState = TimerState.Finished
        console.log('finished')
    }

    function fadeOut() {
        transparentText = false
        clearTimeout(fadeTimeout)
        fadeTimeout = setTimeout(() => {
            transparentText = true
        }, 500)
    }

    onMount(() => {
        if (fadeOnSecondChange) fadeOut()
    })

    onDestroy(() => {
        clearInterval(interval)
        clearTimeout(timeout)
        clearTimeout(fadeTimeout)
    })
</script>

{#if !invisible}
    <span
        class="{fadeOnSecondChange ? 'transition duration-1000 ease-out' : ''}
        {transparentText ? 'opacity-0' : ''}">
        {#if showMinutes}
            <TimeComponent seconds="{secondsLeft}" />
        {:else}{secondsLeft}{/if}
    </span>
{/if}
