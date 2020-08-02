<script lang="ts">
    export let label = '[Label]'
    export let color = 'blue'
    export let small = false
    export let disabled: boolean = false
</script>

<button
    {disabled}
    on:click|preventDefault
    class="text-white font-light {small ? 'text-xl' : 'text-2xl'} pb-1 px-4
    border-b-2 rounded btn-{color} transition-colors duration-200 ease-out
    focus:outline-none">
    {label}
</button>
