<script lang="ts">
    import { PuzzleMode } from '../../models/enums/PuzzleMode'

    export let puzzleMode: PuzzleMode
</script>

{#if puzzleMode === PuzzleMode.Normal}
    <span>
        Normal
        <span class="text-sm">(Svaret er ukjent)</span>
    </span>
{:else if puzzleMode === PuzzleMode.Alternate}
    <span>
        Omvendt
        <span class="text-sm">(Første eller andre ledd er ukjent)</span>
    </span>
{:else}
    <span>Tilfeldig</span>
{/if}
