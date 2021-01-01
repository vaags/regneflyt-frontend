<script lang="ts">
    // ref: https://css.gg/alarm
    export let label: string
</script>

<style>
    div {
        background: linear-gradient(to left, currentColor 5px, transparent 0)
                no-repeat 4.5px 6px/5px 2px,
            linear-gradient(to left, currentColor 7px, transparent 0) no-repeat
                4.5px 2px/2px 6px;
        /* box-sizing: border-box; */
        /* position: relative; */
        /* display: block; */
        /* width: 16px; */
        /* height: 16px; */
        /* border-radius: 100%; */
        border: 2px solid transparent;
        /* transform: scale(var(--ggs, 1)); */
        box-shadow: 0 0 0 2px;
    }
    div::after,
    div::before {
        content: '';
        /* display: block; */
        /* box-sizing: border-box; */
        position: absolute;
        width: 6px;
        height: 2px;
        background: currentColor;
        top: -4px;
    }
    div::before {
        left: -5px;
        transform: rotate(-42deg);
    }
    div::after {
        transform: rotate(42deg);
        right: -5px;
    }
</style>

<div
    class="text-gray-700 ml-0.5 relative inline-block w-4 h-4 rounded-full scale-150"
    aria-label="{label}"></div>
