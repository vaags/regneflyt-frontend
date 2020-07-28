<script lang="ts">
    export let label = '[Label]'
    export let color = 'blue'
    export let small = false
    export let disabled = false
</script>

<button
    {disabled}
    on:click|preventDefault
    class="text-white font-light {small ? 'text-2xl' : 'text-3xl'} pb-1 px-4
    border-b-4 rounded btn-{color} focus:outline-none mr-1">
    {label}
</button>
