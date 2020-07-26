<script lang="ts">
    import { onDestroy } from 'svelte'
    export let time: number

    const interval = setInterval(() => {
        time--
    }, 1000)

    onDestroy(() => {
        clearInterval(interval)
    })
</script>

<div class="card">
    <h2>Gjør deg klar...</h2>

    <p class="text-center my-12 text-3xl md:text-4xl">{time}</p>
</div>
