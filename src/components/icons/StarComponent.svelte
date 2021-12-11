<script lang="ts">
    // Ref: https://codepen.io/fxm90/pen/yOBWVe?editors=0110
    export let label: string
</script>

<div
    data-before=""
    data-after=""
    class="relative text-sm mx-2 inline-block w-0 h-0 mb-2.5
           before:content after:content
           after:absolute after:top-2 after:w-0 after:-left-3.5 after:rotate-35
           before:absolute before:top-2 before:w-0 before:-left-3.5 before:-rotate-35"
    aria-label="{label}"
></div>

<style>
    div {
        border-right: 0.3em solid transparent;
        border-bottom: 0.7em solid rgb(245, 158, 11);
        border-left: 0.3em solid transparent;
        transform: scale(0.85);
        margin-left: 0.4em;
    }
    div:before,
    div:after {
        border-right: 1em solid transparent;
        border-bottom: 0.7em solid rgb(245, 158, 11);
        border-left: 1em solid transparent;
    }
</style>
