<script lang="ts">
    import { onDestroy } from 'svelte'
    export let time: number

    const interval = setInterval(() => {
        if (time > 1) time-- // Should not show zero
    }, 1000)

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<div class="card">
    <h2>Gjør deg klar&hellip;</h2>

    <p class="text-center my-12 text-4xl md:text-5xl">{time}</p>
</div>
