<script lang="ts">
    // Ref: https://codepen.io/fxm90/pen/yOBWVe?editors=0110
    export let label: string
</script>

<style>
    div {
        /* position: relative; */
        /* display: inline-block; */
        /* width: 0; */
        /* height: 0; */
        /* margin-left: 0.9em; */
        /* margin-right: 0.9em; */
        /* margin-bottom: 1.2em; */
        border-right: 0.3em solid transparent;
        border-bottom: 0.7em solid rgb(251, 191, 36);
        border-left: 0.3em solid transparent;
    }
    div:before,
    div:after {
        /* content: ''; */
        /* display: block; */
        /* width: 0; */
        /* height: 0; */
        /* position: absolute; */
        /* top: 0.6em; */
        /* left: -1em; */
        border-right: 1em solid transparent;
        border-bottom: 0.7em solid rgb(251, 191, 36);
        border-left: 1em solid transparent;
        /* transform: rotate(-35deg); */
    }
    div:after {
        /* transform: rotate(35deg); */
    }
</style>

<div
    data-before=""
    data-after=""
    class="relative text-sm mx-2 inline-block w-0 h-0 mb-2.5
           before:content after:content
           after:absolute after:top-2 after:w-0 after:-left-3.5 after:transform after:rotate-35
           before:absolute before:top-2 before:w-0 before:-left-3.5 before:transform before:-rotate-35"
    aria-label="{label}"></div>
