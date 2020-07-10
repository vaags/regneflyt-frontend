<script>
    export let label = "[Label]";
    export let color = "blue";
    export let isBig = false;
</script>

<button
    on:click|preventDefault
    class="bg-{color}-500
           hover:bg-{color}-700
           text-white
           font-light
           {isBig ? "text-xl" : ""}
           py-1
           px-{isBig ? 6 : 4}
           rounded
           ">
    {label}
</button>