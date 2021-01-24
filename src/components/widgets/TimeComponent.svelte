<script lang="ts">
    import { afterUpdate } from 'svelte'

    export let seconds: number

    let minutes: number | undefined
    let remainingSeconds: number | undefined
    let time: string | undefined

    afterUpdate(() => {
        minutes = Math.floor(seconds / 60)
        remainingSeconds = seconds - minutes * 60
        time = `${getTrailingZero(minutes)}:${getTrailingZero(
            remainingSeconds
        )}`
    })

    function getTrailingZero(number: number) {
        return String(number).padStart(2, '0')
    }
</script>

{#if time}
    <span>{time}</span>
{/if}
