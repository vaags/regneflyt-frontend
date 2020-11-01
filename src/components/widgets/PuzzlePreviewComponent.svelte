<script lang="ts">
    import type { Puzzle } from '../../models/Puzzle'
    import HiddenValueComponent from './HiddenValueComponent.svelte'
    import TweenedValueComponent from './TweenedValueComponent.svelte'

    export let puzzle: Puzzle

    let showHiddenValue: boolean
</script>

{#each puzzle.parts as part, i}
    {#if puzzle.unknownPuzzlePart === i}
        <span on:click="{() => (showHiddenValue = !showHiddenValue)}">
            <HiddenValueComponent
                hiddenValue="{part.generatedValue}"
                showHiddenValue="{showHiddenValue}"
                value="?" />
        </span>
    {:else}
        <TweenedValueComponent value="{part.generatedValue}" />
    {/if}
    {#if i === 0}
        <span>
            {@html puzzle.operatorLabel}
        </span>
    {:else if i === 1}<span class="mr-2">=</span>{/if}
{/each}
