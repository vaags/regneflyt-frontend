<script lang="ts">
    import { Operator } from '../../models/enums/Operator'

    export let operator: Operator
    export let returnName: boolean = false
</script>

{#if operator === Operator.Addition}
    {@html returnName ? 'Addisjon' : '&#43;'}
{:else if operator === Operator.Subtraction}
    {@html returnName ? 'Subtraksjon' : '&#8722;'}
{:else if operator === Operator.Multiplication}
    {@html returnName ? 'Multiplikasjon' : '&#215;'}
{:else if operator === Operator.Division}
    {@html returnName ? 'Divisjon' : '&#247;'}
{:else if operator === Operator.All}
    {@html returnName ? 'Alle' : '&#8704'}
{/if}
