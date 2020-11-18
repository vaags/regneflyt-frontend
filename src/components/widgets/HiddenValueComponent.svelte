<script lang="ts">
    export let value: any
    export let hiddenValue: any
    export let showHiddenValue: boolean
    export let strong: boolean = false
</script>

<button
    type="button"
    title="{showHiddenValue ? 'Vis opprinnelig verdi' : 'Vis skjult verdi'}"
    on:click="{() => (showHiddenValue = !showHiddenValue)}"
    class="cursor-pointer focus:outline-none {strong ? 'font-semibold' : ''} {showHiddenValue ? 'text-green-700' : 'text-blue-700'}">
    {showHiddenValue ? hiddenValue : value}
</button>
