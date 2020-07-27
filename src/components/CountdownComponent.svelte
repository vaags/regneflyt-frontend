<script lang="ts">
    import { onDestroy, onMount } from 'svelte'
    export let time: number
    let whiteText = false
    let timeout: number

    const interval = setInterval(() => {
        if (time > 1) time-- // Should not show zero
        fadeOut()
    }, 1000)

    onDestroy(() => {
        clearInterval(interval)
        clearTimeout(timeout)
    })

    function fadeOut() {
        whiteText = false
        clearTimeout(timeout)
        timeout = setTimeout(() => {
            whiteText = true
        }, 500)
    }

    onMount(() => {
        fadeOut()
    })
</script>

<div class="card">
    <h2>Gjør deg klar&hellip;</h2>

    <p
        class="text-center my-12 text-4xl md:text-5xl {whiteText ? 'text-white' : ''}
        transition duration-1000 ease-out">
        {time}
    </p>
</div>
