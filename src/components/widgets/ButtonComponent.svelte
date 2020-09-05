<script lang="ts">
    export let color = 'blue'
    export let disabled: boolean = false
</script>

<button
    disabled="{disabled}"
    on:click|preventDefault
    class="text-white font-light text-3xl px-4 border-b-2 rounded btn-{color} transition-colors
        duration-200 ease-out focus:outline-none">
    <slot />
</button>
