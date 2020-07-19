<script>
    export let operator
</script>

{#if operator == 'addisjon'}
    <span>+</span>
{:else if operator == 'subtraksjon'}
    <span>-</span>
{:else if operator == 'multiplikasjon'}
    <span>x</span>
{:else if operator == 'divisjon'}
    <span>/</span>
{/if}
