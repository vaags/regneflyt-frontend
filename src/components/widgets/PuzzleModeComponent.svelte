<script lang="ts">
    import { PuzzleMode } from '../../models/enums/PuzzleMode'

    export let puzzleMode: PuzzleMode
</script>

{#if puzzleMode === PuzzleMode.Normal}
    <span class="ml-2">
        Normal
        <span class="text-sm">(Svaret er ukjent)</span>
    </span>
{:else if puzzleMode === PuzzleMode.Alternate}
    <span class="ml-2">
        Omvendt
        <span class="text-sm">(Første eller andre ledd er ukjent)</span>
    </span>
{:else}
    <span class="ml-2">Tilfeldig</span>
{/if}
