<script lang="ts">
    // ref: https://css.gg/alarm
    export let label: string
</script>

<div
    class="text-gray-700 ml-1.5 relative inline-block w-2 h-2 rounded-full scale-150"
    aria-label="{label}"
></div>

<style>
    div {
        background: linear-gradient(to left, currentColor 5px, transparent 0)
                no-repeat 1.5px 3px/4px 2px,
            linear-gradient(to left, currentColor 2px, transparent 0) no-repeat
                1.5px 1px/2px 3px;
        border: 1px solid transparent;
        box-shadow: 0 0 0 2px;
    }
    div::after,
    div::before {
        content: '';
        /* display: block; */
        /* box-sizing: border-box; */
        position: absolute;
        width: 4px;
        height: 2px;
        background: currentColor;
        top: -4px;
    }
    div::before {
        left: -4px;
        transform: rotate(-42deg);
    }
    div::after {
        transform: rotate(42deg);
        right: -4px;
    }
</style>
