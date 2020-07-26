<script lang="ts">
    import { Operator } from '../../models/enums/Operator'

    export let operator: Operator
</script>

{#if operator === Operator.Addition}
    <span>&#43;</span>
{:else if operator === Operator.Subtraction}
    <span>&#8722;</span>
{:else if operator === Operator.Multiplication}
    <span>&#215;</span>
{:else if operator === Operator.Division}
    <span>&#247;</span>
{/if}
