<script lang="ts">
    import { tweened } from 'svelte/motion'
    import { sineOut } from 'svelte/easing'

    export let value: any
    export let duration: number = 200

    export const valueTweened = tweened(0, {
        duration: duration,
        easing: sineOut,
    })

    $: valueTweened.set(value)
</script>

<span>{Math.round($valueTweened)}</span>
