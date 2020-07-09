<script>
    export let operator;
</script>

{#if operator == 'addition'}
    <span>+</span>
{:else if operator == 'subtraction'}
    <span>-</span>
{:else if operator == 'multiplication'}
    <span>x</span>
{:else if operator == 'division'}
    <span>/</span>
{/if}