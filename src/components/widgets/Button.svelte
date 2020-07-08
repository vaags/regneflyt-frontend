<script>
    export let label = "[Label]";
    export let color = "blue";
    export let textColor = "white";
</script>

<button
    on:click
    class="bg-{color}-500
           hover:bg-{color}-700
           text-{textColor}
           font-bold
           py-2
           px-4
           rounded
           ">
    {label}
</button>