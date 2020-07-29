<script lang="ts">
    export let value: any
    export let hiddenValue: any
    export let showHiddenValue: boolean
</script>

<button
    type="button"
    on:click="{() => (showHiddenValue = !showHiddenValue)}"
    class="cursor-pointer focus:outline-none {showHiddenValue ? 'text-green-700' : 'text-blue-700'}">
    {showHiddenValue ? hiddenValue : value}
</button>
