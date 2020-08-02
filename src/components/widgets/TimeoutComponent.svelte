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
    let secondsLeft: number
    let transparentText: boolean = false

    $: if (state && internalState !== state) {
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
        internalState = state
    }

    function start() {
        clearTickers()
        secondsLeft = seconds

        timeout = setTimeout(finished, seconds * 1000)
        interval = setInterval(() => {
            if (secondsLeft > 1) {
                secondsLeft-- // Should not display zero
                if (fadeOnSecondChange) fadeOut()
                dispatch('secondChange', { secondsLeft })
            }
        }, 1000)

        console.log('start')
    }

    function pause() {
        console.log('pause')
    }

    function resume() {
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
            <TimeComponent seconds="{secondsLeft}" />
        {:else}{secondsLeft}{/if}
    </span>
{/if}
