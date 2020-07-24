<script lang="ts">
    export let label = '[Label]'
    export let color = 'blue'
    export let small = false
    export let disabled = false
</script>

<button
    {disabled}
    on:click|preventDefault
    class="text-white font-light {small ? 'text-2xl' : 'text-3xl'} py-1 px-4
    border border-gray-800 rounded btn-{color}
    ">
    {label}
</button>
