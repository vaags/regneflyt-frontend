<script>
    export let label = "[Label]";
    export let color = "blue";
    export let textColor = "white";
    export let isBig = false;
</script>

<button
    on:click|preventDefault
    class="bg-{color}-500
           hover:bg-{color}-700
           text-{textColor}
           {isBig ? "text-xl" : ""}
           font-medium
           py-2
           px-{isBig ? 6 : 4}
           rounded
           ">
    {label}
</button>