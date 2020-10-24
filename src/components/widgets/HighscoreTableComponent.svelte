<script lang="ts">
    import type { Highscore } from '../../models/Highscore'

    export let highScores: Highscore[]
    export let highlightRowNumber: number | undefined = undefined
</script>

{#if highScores?.length}
    <table class="table-auto w-full">
        {#each highScores as score, i}
            <tr class="{highlightRowNumber === i + 1 ? 'bg-blue-200' : ''}">
                <td class="border-t py-2 text-gray-600">{i + 1}</td>
                <td class="border-t px-4 py-2 uppercase">{score.name}</td>
                <td class="border-t px-4 py-2 whitespace-no-wrap">
                    {score.scoreSum.toLocaleString()}
                </td>
            </tr>
        {/each}
    </table>
{/if}
