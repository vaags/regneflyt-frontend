<script>
    export let min = 0;
    export let max = 100;

    export let value = undefined;
</script>

<div class="mb-4">
    <span class="text-blue-800 mr-4 float-left mt-1">{value}</span>
    <input
        class="w-3/4 md:w-1/2 mt-2"
        type="range"
        min={min}
        max={max}
        step="1"
        bind:value={value}>
    
</div>