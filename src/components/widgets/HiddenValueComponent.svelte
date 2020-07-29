<script lang="ts">
    export let value: any
    export let hiddenValue: any
    export let showHiddenValue: boolean
</script>

<button
    type="button"
    on:click
    class="cursor-pointer focus:outline-none {showHiddenValue ? 'text-blue-700' : ''}">
    {showHiddenValue ? hiddenValue : value}
</button>
