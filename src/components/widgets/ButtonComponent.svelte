<script lang="ts">
    export let label = '[Label]'
    export let color = 'blue'
    export let small = false
</script>

<button
    on:click|preventDefault
    class="text-white font-light {small ? 'text-xl' : 'text-2xl'} py-1 px-4
    border border-gray-800 rounded btn-{color}
    ">
    {label}
</button>
