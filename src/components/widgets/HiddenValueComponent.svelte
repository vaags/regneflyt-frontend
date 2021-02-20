<script lang="ts">
    export let value: any
    export let hiddenValue: any
    export let showHiddenValue: boolean
    export let strong: boolean = false
</script>

<button
    type="button"
    on:click="{() => (showHiddenValue = !showHiddenValue)}"
    class="cursor-pointer {strong ? 'font-semibold' : ''} {showHiddenValue
        ? 'text-green-700'
        : 'text-blue-800'}"
>
    {showHiddenValue ? hiddenValue : value}
    <span class="sr-only"
        >{showHiddenValue ? 'Vis opprinnelig verdi' : 'Vis skjult verdi'}</span
    >
</button>
