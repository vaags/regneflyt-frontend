<script lang="ts">
    import { tweened } from 'svelte/motion'
    import { sineOut } from 'svelte/easing'

    export let value: any

    export const valueTweened = tweened(0, {
        duration: 200,
        easing: sineOut,
    })

    $: valueTweened.set(value)
</script>

<span>{Math.round($valueTweened)}</span>
