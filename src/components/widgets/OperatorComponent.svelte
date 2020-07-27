<script lang="ts">
    import { Operator } from '../../models/enums/Operator'

    export let operator: Operator
</script>

{#if operator === Operator.Addition}
    {@html '&#43;'}
{:else if operator === Operator.Subtraction}
    {@html '&#8722;'}
{:else if operator === Operator.Multiplication}
    {@html '&#215;'}
{:else if operator === Operator.Division}
    {@html '&#247;'}
{/if}
