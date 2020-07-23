<script lang="ts">
    import { Operator } from '../../models/Operator'

    export let operator: Operator
</script>

{#if operator === Operator.Addition}
    <span>+</span>
{:else if operator === Operator.Subtraction}
    <span>-</span>
{:else if operator === Operator.Multiplication}
    <span>&#215;</span>
{:else if operator === Operator.Division}
    <span>&#247;</span>
{/if}
