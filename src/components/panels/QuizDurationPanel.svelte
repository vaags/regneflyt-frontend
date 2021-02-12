<script lang="ts">
    import PanelComponent from '../widgets/PanelComponent.svelte'

    export let duration: number
    export let puzzleTimeLimit: boolean

    const durationValues = [0.5, 1, 3, 5]
</script>

<PanelComponent heading="Spilletid">
    {#each Object.values(durationValues) as d}
        <label class="flex items-center py-1">
            <input
                type="radio"
                class="h-5 w-5 text-blue-700"
                bind:group="{duration}"
                value="{d}"
            />
            <span class="ml-2 text-lg"
                >{d === 0.5
                    ? '30 sekunder'
                    : d === 1
                    ? `${d} minutt`
                    : `${d} minutter`}</span
            >
        </label>
    {/each}
    <label class="flex mt-3 items-center py-1">
        <input
            type="checkbox"
            class="h-5 w-5 rounded text-blue-700"
            bind:checked="{puzzleTimeLimit}"
        />
        <span class="ml-2 text-lg">Tidsbegrensning per oppgave</span>
    </label>
</PanelComponent>
