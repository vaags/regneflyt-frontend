<script>
    export let min = 0
    export let max = 100
    export let zeroLabel = undefined
    export let value = undefined
</script>

<style>
    .slider {
        -webkit-appearance: none;
        height: 1rem;
        border-radius: 5px;
        background: #cbd5e0;
        outline: none;
        opacity: 0.7;
        -webkit-transition: 0.2s;
        transition: opacity 0.2s;
    }

    .slider::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: #2c5282;
        cursor: pointer;
    }

    .slider::-moz-range-thumb {
        width: 1.75rem;
        height: 1.75rem;
        border-radius: 50%;
        background: #2c5282;
        cursor: pointer;
    }
</style>

<div class="flex flex-row">
    <span class="text-blue-800 mr-4 mt-1 w-8">
        {zeroLabel && !value ? zeroLabel : value}
    </span>
    <span class="w-full mt-2">
        <input
            on:change
            class="w-full slider"
            type="range"
            {min}
            {max}
            step="1"
            bind:value />
    </span>
</div>
