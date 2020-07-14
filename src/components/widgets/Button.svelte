<script>
    export let label = "[Label]";
    export let color = "blue";
</script>

<button
    on:click|preventDefault
    class="text-white
           font-light
           text-2xl
           py-1
           px-4
           border
           border-gray-800
           rounded
           btn-{color}
           ">
    {label}
</button>