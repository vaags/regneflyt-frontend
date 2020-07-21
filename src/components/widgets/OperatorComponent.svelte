<script lang="ts">
    import { Operator } from '../../models/Operator'

    export let operator: Operator
</script>

{#if operator === Operator.Addition}
    <span>+</span>
{:else if operator === Operator.Subtraction}
    <span>-</span>
{:else if operator === Operator.Multiplication}
    <span>x</span>
{:else if operator === Operator.Division}
    <span>/</span>
{/if}
