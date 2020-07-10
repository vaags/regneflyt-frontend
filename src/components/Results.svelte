<script>
    import { createEventDispatcher } from 'svelte';
    import Button from './widgets/Button.svelte';
    import Operator from './widgets/Operator.svelte';
    import Alert from './widgets/Alert.svelte';

    const dispatch = createEventDispatcher();

    export let puzzleSet;

    function resetQuiz() {
        dispatch('resetQuiz');
    }

</script>

<div class="card">
    <h2 class="mb-3 text-xl font-thin">Resultater</h2>
    {#if !puzzleSet || !puzzleSet.length}
        <Alert color="yellow" message="Ingen fullførte oppgaver ble funnet." />
    {:else}

        <table class="table-auto">
            <thead>
                <tr>
                    <th class="text-left py-2 font-light" colspan="2">Svar</th>
                    <th class="font-light px-3 py-2">Tidsbruk</th>
                </tr>
            </thead>
            <tbody>
                {#each puzzleSet as puzzle}
                    <tr>
                        <td class="border-t pr-3 py-2 whitespace-no-wrap">{puzzle.partOne} <Operator operator={puzzle.operator} /> {puzzle.partTwo} = <span class="">{puzzle.answer}</span></td>
                        <td class="border-t px-3 py-2">
                            {#if puzzle.isCorrect}
                                <span class="text-green-500">Riktig</span>
                            {:else}
                                <span class="text-red-500">Galt</span>
                            {/if}
                        </td>
                        <td class="border-t px-4 py-2">{Math.round(puzzle.duration * 10) / 10} s</td>
                    </tr>
                {/each}
                <tr>
                    <td class="border-t-2 px-3 py-2" colspan="2"></td>
                    <td class="border-t-2 px-3 py-2 font-bold">-</td>
                </tr>
            </tbody>
        </table>
    {/if}
</div>

<Button on:click={resetQuiz} label="Til hovedmenyen" />
